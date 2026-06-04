import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, ExternalLink, Github, Star, GitFork, Scale, Tag, Download, TerminalSquare,
  BookOpen, FileText, Loader2, Copy, Check, ShieldAlert, Sparkles, Calendar, Code2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type DiscoveredTool = {
  id: string;
  name: string;
  full_name: string;
  github_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  license: string | null;
  stars: number;
  forks: number;
  topics: string[];
  readme_excerpt: string | null;
  last_commit: string | null;
  score: number;
  suggested_category: string | null;
  level: string | null;
  install_cmd: string | null;
  example_cmd: string | null;
  ethical: boolean;
  detected_at: string;
};

export const Route = createFileRoute("/outils/discovered/$id")({
  head: () => ({
    meta: [
      { title: "Outil découvert — IT-ools" },
      { name: "description", content: "Détail d'un outil CLI open source détecté automatiquement." },
    ],
  }),
  component: DiscoveredToolPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p>Outil introuvable. <Link to="/" className="text-primary underline">Retour</Link></p>
    </div>
  ),
});

function parseGithub(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

function useReadme(githubUrl: string | null) {
  const [state, setState] = useState<{ html: string | null; loading: boolean; error: string | null }>({
    html: null, loading: true, error: null,
  });
  useEffect(() => {
    if (!githubUrl) { setState({ html: null, loading: false, error: "no url" }); return; }
    const parsed = parseGithub(githubUrl);
    if (!parsed) { setState({ html: null, loading: false, error: "Lien GitHub invalide" }); return; }
    const cacheKey = `readme:${parsed.owner}/${parsed.repo}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setState({ html: cached, loading: false, error: null }); return; }
    } catch {}
    let cancelled = false;
    setState({ html: null, loading: true, error: null });
    fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`, {
      headers: { Accept: "application/vnd.github.html" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`GitHub a répondu ${r.status}`);
        return r.text();
      })
      .then((html) => {
        if (cancelled) return;
        try { sessionStorage.setItem(cacheKey, html); } catch {}
        setState({ html, loading: false, error: null });
      })
      .catch((e) => {
        if (cancelled) return;
        setState({ html: null, loading: false, error: e.message ?? "indisponible" });
      });
    return () => { cancelled = true; };
  }, [githubUrl]);
  return state;
}

function DiscoveredToolPage() {
  const { id } = Route.useParams();
  const [tool, setTool] = useState<DiscoveredTool | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("discovered_tools")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();
      if (cancelled) return;
      if (!data) setNotFoundState(true);
      else setTool(data as unknown as DiscoveredTool);
    })();
    return () => { cancelled = true; };
  }, [id]);

  const readme = useReadme(tool?.github_url ?? null);

  if (notFoundState) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="font-display text-2xl font-bold">Outil introuvable ou non publié</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Il a peut-être été retiré ou n'est pas encore approuvé.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Chargement…
        </div>
      </div>
    );
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const detectedFmt = new Date(tool.detected_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const commitFmt = tool.last_commit
    ? new Date(tool.last_commit).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  // Build a "principe" auto à partir du README brut s'il existe
  const principe = buildPrinciple(tool);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="border-b border-border bg-background/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> accueil
            </Link>
            <span>/</span>
            <span className="text-foreground/80">discovery</span>
          </div>

          <div className="mt-6">
            <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> outil détecté automatiquement
              {tool.suggested_category && <> · {tool.suggested_category}</>}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{tool.name}</h1>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{tool.full_name}</p>
            {tool.description && (
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{tool.description}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {tool.level && <Badge>{tool.level}</Badge>}
              {tool.language && <Badge>{tool.language}</Badge>}
              {tool.license && <Badge>{tool.license}</Badge>}
              <Badge className="text-cyber-emerald border-cyber-emerald/30 bg-cyber-emerald/10">
                Score {tool.score}
              </Badge>
              {tool.ethical && (
                <span className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-mono uppercase text-destructive">
                  <ShieldAlert className="h-3 w-3" /> usage légal uniquement
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={tool.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-blue hover:bg-primary/90"
              >
                <Github className="h-4 w-4" /> Voir sur GitHub <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {tool.homepage && (
                <a
                  href={tool.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-semibold hover:border-primary/40"
                >
                  Site officiel <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {tool.install_cmd && (
                <button
                  onClick={() => copy(tool.install_cmd!, "install-top")}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-semibold hover:border-primary/40"
                >
                  {copied === "install-top" ? <><Check className="h-4 w-4 text-cyber-cyan" /> commande copiée</> : <><Copy className="h-4 w-4" /> Copier l'installation</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-10">
            <Block icon={BookOpen} title="Principe de l'outil">
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {principe.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {tool.topics && tool.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tool.topics.slice(0, 10).map((t) => (
                    <span key={t} className="rounded bg-secondary/60 px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </Block>

            {tool.install_cmd && (
              <Block icon={Download} title="Installation">
                <CodeBlock
                  label="install"
                  code={tool.install_cmd}
                  onCopy={() => copy(tool.install_cmd!, "install")}
                  copied={copied === "install"}
                />
              </Block>
            )}

            {tool.example_cmd && (
              <Block icon={TerminalSquare} title="Exemple de commande">
                <CodeBlock
                  label="$ shell"
                  code={tool.example_cmd}
                  onCopy={() => copy(tool.example_cmd!, "cmd")}
                  copied={copied === "cmd"}
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  À exécuter uniquement sur vos propres systèmes ou avec autorisation écrite.
                </p>
              </Block>
            )}

            <ReadmeBlock githubUrl={tool.github_url} readmeState={readme} />
          </article>

          <aside className="space-y-5">
            <SideCard icon={Star} title="Popularité GitHub">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Stat label="Stars" value={tool.stars} accent="text-cyber-emerald" />
                <Stat label="Forks" value={tool.forks} />
              </div>
            </SideCard>
            <SideCard icon={Calendar} title="Activité">
              <ul className="space-y-1 text-xs text-muted-foreground font-mono">
                <li>Dernier commit : <span className="text-foreground">{commitFmt}</span></li>
                <li>Détecté le : <span className="text-foreground">{detectedFmt}</span></li>
              </ul>
            </SideCard>
            {tool.language && (
              <SideCard icon={Code2} title="Langage">
                <p className="font-display text-xl font-bold text-primary">{tool.language}</p>
              </SideCard>
            )}
            {tool.license && (
              <SideCard icon={Scale} title="Licence">
                <p className="font-mono text-sm">{tool.license}</p>
              </SideCard>
            )}
            {tool.topics && tool.topics.length > 0 && (
              <SideCard icon={Tag} title="Topics">
                <div className="flex flex-wrap gap-1.5">
                  {tool.topics.map((tg) => (
                    <span key={tg} className="rounded bg-secondary/60 px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                      #{tg}
                    </span>
                  ))}
                </div>
              </SideCard>
            )}
            <SideCard icon={Github} title="Repository">
              <a href={tool.github_url} target="_blank" rel="noreferrer" className="block break-all font-mono text-xs text-primary hover:underline">
                {tool.github_url}
              </a>
            </SideCard>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function buildPrinciple(tool: DiscoveredTool): string[] {
  const out: string[] = [];
  const cat = tool.suggested_category ? labelCategory(tool.suggested_category) : "outil en ligne de commande";
  const lang = tool.language ? ` écrit en ${tool.language}` : "";
  out.push(
    `${tool.name} est ${cat}${lang}, distribué sous licence ${tool.license ?? "open source"} ` +
    `et maintenu activement sur GitHub (${tool.stars.toLocaleString("fr-FR")} ★, ${tool.forks.toLocaleString("fr-FR")} forks).`,
  );
  if (tool.description) {
    out.push(`Objectif : ${tool.description.trim().replace(/\s+/g, " ")}.`);
  }
  const readme = tool.readme_excerpt;
  if (readme) {
    // Extract first meaningful paragraph (skip markdown headings, badges, html)
    const cleaned = readme
      .replace(/<[^>]+>/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, " ")
      .replace(/^#+\s.*$/gm, "")
      .replace(/\r/g, "")
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 80 && !/^\W*$/.test(p));
    if (cleaned[0]) out.push(cleaned[0].slice(0, 600));
    if (cleaned[1]) out.push(cleaned[1].slice(0, 600));
  }
  if (tool.example_cmd) {
    out.push(
      `Concrètement : on l'invoque depuis un terminal, par exemple via \`${tool.example_cmd}\`, puis on enchaîne ` +
      `avec les options propres à son usage (voir le README complet plus bas).`,
    );
  } else {
    out.push(
      `Concrètement : on l'invoque depuis un terminal et on enchaîne avec les options propres à son usage. ` +
      `Le README complet est embarqué ci-dessous pour les détails.`,
    );
  }
  return out;
}

function labelCategory(slug: string): string {
  const map: Record<string, string> = {
    "cyber-cli": "un outil de cybersécurité offensive en ligne de commande",
    "osint-recon": "un outil d'OSINT et de reconnaissance",
    "network-diag": "un outil de diagnostic et d'analyse réseau",
    "forensic-ir": "un outil de forensic et de réponse à incident",
    "malware-re": "un outil d'analyse de malware et de reverse engineering",
    "blueteam": "un outil blue team / détection",
    "devops-cloud": "un outil DevOps / cloud",
    "databases-data": "un outil de manipulation de bases de données et de data",
    "sysadmin": "un outil d'administration système",
    "devprod": "un outil de productivité développeur",
  };
  return map[slug] ?? "un outil en ligne de commande";
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-mono uppercase text-primary ${className}`}>
      {children}
    </span>
  );
}

function Block({ icon: Icon, title, children }: { icon?: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 font-display text-xl font-bold">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SideCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5">
      <h4 className="flex items-center gap-2 font-display text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-mono text-lg font-bold ${accent ?? "text-foreground"}`}>{value.toLocaleString("fr-FR")}</p>
    </div>
  );
}

function CodeBlock({ label, code, onCopy, copied }: { label: string; code: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-background/70">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <button onClick={onCopy} className="inline-flex items-center gap-1 hover:text-primary">
          {copied ? <><Check className="h-3 w-3 text-cyber-cyan" /> copié</> : <><Copy className="h-3 w-3" /> copier</>}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12px] leading-relaxed text-cyber-cyan">
        <span className="text-muted-foreground">$ </span>{code}
      </pre>
    </div>
  );
}

function ReadmeBlock({ githubUrl, readmeState }: { githubUrl: string; readmeState: { html: string | null; loading: boolean; error: string | null } }) {
  const { html, loading, error } = readmeState;
  return (
    <Block icon={FileText} title="README GitHub">
      <div className="overflow-hidden rounded-xl border border-border bg-background/60">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Github className="h-3 w-3" /> README.md</span>
          <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
            ouvrir sur github <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="max-h-[640px] overflow-y-auto p-5 sm:p-6">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Chargement du README depuis GitHub…
            </div>
          )}
          {error && !loading && (
            <p className="text-sm text-muted-foreground">
              README indisponible ({error}).{" "}
              <a href={githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Le consulter sur GitHub</a>.
            </p>
          )}
          {html && !loading && (
            <div className="readme-content" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </div>
    </Block>
  );
}
