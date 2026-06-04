// Server-only helpers for the discovery system.
// Never import from client-reachable code paths.

const GH = "https://api.github.com";

export type GhRepo = {
  id: number;
  full_name: string;
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  license: { spdx_id: string | null; name: string } | null;
  topics?: string[];
  archived: boolean;
  disabled: boolean;
  fork: boolean;
};

const SEARCH_QUERIES = [
  "topic:cli",
  "topic:command-line-tool",
  "topic:terminal",
  "topic:shell",
  "topic:tui",
  "topic:osint",
  "topic:pentest",
  "topic:pentesting",
  "topic:hacking",
  "topic:security-tools",
  "topic:web-security",
  "topic:forensics",
  "topic:dfir",
  "topic:incident-response",
  "topic:reverse-engineering",
  "topic:malware-analysis",
  "topic:devops",
  "topic:devops-tools",
  "topic:kubernetes",
  "topic:docker",
  "topic:sysadmin",
  "topic:linux",
  "topic:monitoring",
  "topic:observability",
  "topic:blue-team",
  "topic:threat-hunting",
  "topic:network-security",
  "topic:networking",
  "topic:bug-bounty",
  "topic:productivity",
  "topic:developer-tools",
];

const ETHICAL_HINTS = [
  "exploit",
  "pentest",
  "offensive",
  "malware",
  "ransomware",
  "rootkit",
  "red-team",
];

const CATEGORY_RULES: Array<{ cat: string; needles: string[] }> = [
  { cat: "cyber-cli", needles: ["pentest", "exploit", "vulnerab", "security-tool", "bug-bounty", "web-security"] },
  { cat: "osint-recon", needles: ["osint", "recon", "subdomain", "enumeration", "footprint"] },
  { cat: "network-diag", needles: ["network", "tcp", "packet", "dns", "tls", "ssl", "ping", "trace"] },
  { cat: "forensic-ir", needles: ["forensic", "incident-response", "dfir", "timeline", "memory-analysis"] },
  { cat: "malware-re", needles: ["malware", "reverse-eng", "disassembl", "decompil", "yara"] },
  { cat: "blueteam", needles: ["siem", "detection", "blue-team", "threat-hunting", "log-analysis", "monitoring"] },
  { cat: "devops-cloud", needles: ["devops", "kubernetes", "docker", "terraform", "cloud", "k8s", "helm"] },
  { cat: "databases-data", needles: ["database", "postgres", "mysql", "sqlite", "etl", "data"] },
  { cat: "sysadmin", needles: ["sysadmin", "linux", "systemd", "shell", "bash", "admin"] },
  { cat: "devprod", needles: ["productivity", "developer", "git", "editor", "tmux", "fzf"] },
];

function levelFromStars(stars: number): "Débutant" | "Intermédiaire" | "Avancé" {
  if (stars > 20000) return "Débutant"; // mainstream, well-doc
  if (stars > 3000) return "Intermédiaire";
  return "Avancé";
}

function categorize(topics: string[], desc: string | null): string {
  const blob = (topics.join(" ") + " " + (desc ?? "")).toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.needles.some((n) => blob.includes(n))) return rule.cat;
  }
  return "devprod";
}

function isEthical(topics: string[], desc: string | null): boolean {
  const blob = (topics.join(" ") + " " + (desc ?? "")).toLowerCase();
  return ETHICAL_HINTS.some((n) => blob.includes(n));
}

function scoreRepo(repo: GhRepo, readme: string | null): number {
  let score = 0;
  // Stars (log scale up to 30)
  score += Math.min(30, Math.round(Math.log10(Math.max(1, repo.stargazers_count)) * 10));
  // Recent activity (up to 20)
  const days = (Date.now() - new Date(repo.pushed_at).getTime()) / 86_400_000;
  if (days < 30) score += 20;
  else if (days < 180) score += 12;
  else if (days < 365) score += 6;
  // License (10)
  if (repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION") score += 10;
  // Topics relevance (10)
  const t = (repo.topics ?? []).join(" ").toLowerCase();
  if (/cli|command-line|terminal|shell|security|osint|forensic|devops|sysadmin/.test(t)) score += 10;
  // README quality (up to 25)
  if (readme) {
    if (readme.length > 500) score += 5;
    if (/install|installation/i.test(readme)) score += 5;
    if (/usage|example/i.test(readme)) score += 5;
    if (/```/.test(readme)) score += 5;
    if (/\b(brew|apt|cargo|pip|npm|go install|docker)\b/i.test(readme)) score += 5;
  }
  // Penalties
  if (repo.archived || repo.disabled) score -= 50;
  if (repo.fork) score -= 20;
  return Math.max(0, Math.min(100, score));
}

function extractInstall(readme: string | null): string | null {
  if (!readme) return null;
  const m = readme.match(/(?:brew install|apt install|cargo install|pip install|npm install -g|go install|docker pull)[^\n`]+/i);
  return m ? m[0].trim().slice(0, 200) : null;
}

function extractExample(readme: string | null, name: string): string | null {
  if (!readme) return null;
  const re = new RegExp("`+\\s*\\$?\\s*(" + name + "[^\\n`]{0,120})`+", "i");
  const m = readme.match(re);
  return m ? m[1].trim() : null;
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "it-ools-discovery",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function searchRepos(query: string, perPage = 30): Promise<GhRepo[]> {
  const q = `${query} pushed:>${cutoffISO()} stars:>30 fork:false archived:false`;
  const url = `${GH}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`GitHub search failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { items: GhRepo[] };
  return json.items ?? [];
}

async function fetchReadme(fullName: string): Promise<string | null> {
  try {
    const res = await fetch(`${GH}/repos/${fullName}/readme`, {
      headers: { ...authHeaders(), Accept: "application/vnd.github.raw" },
    });
    if (!res.ok) return null;
    const txt = await res.text();
    return txt.slice(0, 8000);
  } catch {
    return null;
  }
}

function cutoffISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 12);
  return d.toISOString().slice(0, 10);
}

export type DiscoveryRunResult = {
  totalFetched: number;
  totalKept: number;
  errors: string[];
};

export async function runDiscovery(): Promise<DiscoveryRunResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const errors: string[] = [];
  let totalFetched = 0;
  let totalKept = 0;

  for (const query of SEARCH_QUERIES) {
    const started = Date.now();
    let fetched = 0;
    let kept = 0;
    let err: string | null = null;
    try {
      const repos = await searchRepos(query);
      fetched = repos.length;

      // Existing rows for dedupe
      const fullNames = repos.map((r) => r.full_name);
      const { data: existing } = await supabaseAdmin
        .from("discovered_tools")
        .select("full_name")
        .in("full_name", fullNames);
      const known = new Set((existing ?? []).map((r) => r.full_name));

      const inserts = [];
      for (const repo of repos) {
        if (known.has(repo.full_name)) continue;
        const readme = await fetchReadme(repo.full_name);
        const score = scoreRepo(repo, readme);
        if (score < 25) continue;
        const topics = repo.topics ?? [];
        inserts.push({
          name: repo.name,
          full_name: repo.full_name,
          github_url: repo.html_url,
          description: repo.description,
          homepage: repo.homepage,
          language: repo.language,
          license: repo.license?.spdx_id ?? null,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics,
          readme_excerpt: readme?.slice(0, 1200) ?? null,
          last_commit: repo.pushed_at,
          score,
          suggested_category: categorize(topics, repo.description),
          level: levelFromStars(repo.stargazers_count),
          source: "github",
          source_query: query,
          status: "pending",
          install_cmd: extractInstall(readme),
          example_cmd: extractExample(readme, repo.name),
          ethical: isEthical(topics, repo.description),
        });
      }
      if (inserts.length) {
        const { error } = await supabaseAdmin.from("discovered_tools").insert(inserts);
        if (error) err = error.message;
        else kept = inserts.length;
      }
    } catch (e) {
      err = e instanceof Error ? e.message : String(e);
      errors.push(err);
    }

    await supabaseAdmin.from("discovery_runs").insert({
      source: "github",
      query,
      fetched_count: fetched,
      kept_count: kept,
      error: err,
      duration_ms: Date.now() - started,
    });

    totalFetched += fetched;
    totalKept += kept;
  }

  return { totalFetched, totalKept, errors };
}

export async function rotateDailyTool(count = 5): Promise<{ chosen: string | null; chosenIds: string[] }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const today = new Date().toISOString().slice(0, 10);

  // Tools already featured today
  const { data: todayRows } = await supabaseAdmin
    .from("daily_tool")
    .select("tool_id")
    .eq("featured_date", today);
  const todayIds = new Set((todayRows ?? []).map((r) => r.tool_id));

  // Tools already featured in past 30 days to avoid repetition
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data: recent } = await supabaseAdmin
    .from("daily_tool")
    .select("tool_id")
    .gte("featured_date", since.toISOString().slice(0, 10));
  const recentIds = new Set((recent ?? []).map((r) => r.tool_id));

  const { data: candidates } = await supabaseAdmin
    .from("discovered_tools")
    .select("id, score")
    .eq("status", "approved")
    .order("score", { ascending: false })
    .limit(100);

  const chosenIds: string[] = [];
  const remaining = Math.max(0, count - todayIds.size);
  if (remaining > 0) {
    const fresh = (candidates ?? []).filter((c) => !recentIds.has(c.id) && !todayIds.has(c.id));
    const pool = fresh.length >= remaining ? fresh : (candidates ?? []).filter((c) => !todayIds.has(c.id));
    for (const c of pool.slice(0, remaining)) chosenIds.push(c.id);
    if (chosenIds.length) {
      await supabaseAdmin.from("daily_tool").insert(
        chosenIds.map((id) => ({
          tool_id: id,
          featured_date: today,
          reason: "Sélection automatique du meilleur score disponible.",
        })),
      );
    }
  }
  return { chosen: chosenIds[0] ?? null, chosenIds };
}
