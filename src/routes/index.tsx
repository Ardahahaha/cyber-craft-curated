import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight, Search, ShieldCheck, Network, Fingerprint, Server, Workflow,
  TerminalSquare, Sparkles, Github, Layers, X, Cloud, Code2, Database, ShieldAlert, Bug,
  Calendar, Zap, GraduationCap, Flame, Copy, Check,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { TerminalSnippet } from "@/components/TerminalSnippet";
import { ToolCard } from "@/components/ToolCard";
import { ToolLogo } from "@/components/ToolLogo";
import { categories, tools, type Level, type CategorySlug, type Tool } from "@/data/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IT-ools — Bibliothèque premium d'outils CLI" },
      {
        name: "description",
        content:
          "Catalogue d'outils en ligne de commande pour cybersécurité, OSINT, réseau, forensic, malware analysis, sysadmin, DevOps, cloud, productivité, bases de données et blue team.",
      },
    ],
  }),
  component: Home,
});

const catIconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  ShieldCheck, Search, Network, Fingerprint, Server, Workflow, Cloud, Code2, Database, ShieldAlert, Bug,
};

const levels: Level[] = ["Débutant", "Intermédiaire", "Avancé"];
type OSFilter = "Linux" | "Windows" | "macOS";
const osFilters: OSFilter[] = ["Linux", "Windows", "macOS"];

const quickCats: { label: string; slug: CategorySlug }[] = [
  { label: "OSINT", slug: "osint-recon" },
  { label: "Network", slug: "network-diag" },
  { label: "Forensic", slug: "forensic-ir" },
  { label: "DevOps", slug: "devops-cloud" },
  { label: "Blue Team", slug: "blueteam" },
];


function dayIndex() {
  const start = new Date(2026, 0, 1).getTime();
  return Math.floor((Date.now() - start) / 86_400_000);
}

function Home() {
  const navigate = useNavigate({ from: "/" });
  const [q, setQ] = useState("");

  const [filterQ, setFilterQ] = useState("");
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [lvl, setLvl] = useState<Level | "all">("all");
  const [os, setOs] = useState<OSFilter | "all">("all");

  const [copiedCmd, setCopiedCmd] = useState(false);

  const recent = useMemo(() => tools.filter((t) => t.recent).slice(0, 6), []);
  const beginners = useMemo(
    () => tools.filter((t) => t.level === "Débutant").slice(0, 10),
    []
  );
  const advanced = useMemo(
    () => tools.filter((t) => t.level === "Avancé").slice(0, 10),
    []
  );

  const idx = dayIndex();
  const toolOfDay: Tool = tools[Math.abs(idx) % tools.length];
  const cmdPool = tools.filter((t) => t.command && t.command.length < 80);
  const cmdOfDay: Tool = cmdPool[Math.abs(idx * 7 + 3) % cmdPool.length];

  const filtered = useMemo(() => {
    const term = filterQ.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (lvl !== "all" && t.level !== lvl) return false;
      if (os !== "all" && !t.os.includes(os)) return false;
      if (!term) return true;
      return (
        t.name.toLowerCase().includes(term) ||
        t.short.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.command.toLowerCase().includes(term) ||
        t.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        t.category.toLowerCase().includes(term)
      );
    });
  }, [filterQ, cat, lvl, os]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/outils", search: q.trim() ? { q: q.trim() } : {} });
  };

  const copyCommand = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative">
          <HeroBackground />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-12 lg:pt-20">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-mono text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
                {tools.length} outils CLI · {categories.length} catégories
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                IT<span className="text-gradient">-ools</span>
                <br />
                <span className="text-muted-foreground/90 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  la bibliothèque premium d'outils CLI.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Cybersécurité, OSINT, réseau, forensic, reverse engineering, sysadmin,
                DevOps, cloud, productivité et blue team — uniquement en ligne de commande,
                uniquement en usage légal.
              </p>

              <form onSubmit={submitSearch} className="mt-7 max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher : nmap, jq, kubectl, volatility, sherlock..."
                    className="h-12 w-full rounded-md border border-border bg-secondary/40 pl-11 pr-28 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="submit"
                    className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow-blue hover:bg-primary/90">
                    Lancer <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5">
              <TerminalSnippet />
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Kpi icon={TerminalSquare} label="Outils CLI" value={tools.length} accent="text-primary" />
            <Kpi icon={Layers} label="Catégories" value={categories.length} accent="text-cyber-cyan" />
            <Kpi icon={GraduationCap} label="Débutant" value={tools.filter(t => t.level === "Débutant").length} accent="text-cyber-emerald" />
            <Kpi icon={Flame} label="Avancé" value={tools.filter(t => t.level === "Avancé").length} accent="text-accent" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeader title="Explorer par catégorie" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((c) => {
            const Icon = catIconMap[c.icon] ?? ShieldCheck;
            const count = tools.filter((t) => t.category === c.slug).length;
            return (
              <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }}
                className="group flex items-start gap-3 rounded-xl border border-border bg-secondary/20 p-4 transition hover:border-primary/40 hover:bg-secondary/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold truncate">{c.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">{count}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.short}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* TOOL OF DAY + COMMAND OF DAY */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* tool of day */}
          <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-card-cyber">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyber-cyan">
              <Calendar className="h-3.5 w-3.5" />
              outil du jour
            </div>
            <Link to="/outils/$slug" params={{ slug: toolOfDay.slug }} className="mt-4 flex items-start gap-4 group">
              <ToolLogo tool={toolOfDay} size={56} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-bold group-hover:text-primary transition">{toolOfDay.name}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{toolOfDay.short}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {toolOfDay.tags.slice(0, 3).map(t => (
                    <span key={t} className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">#{t}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition" />
            </Link>
          </div>

          {/* command of day */}
          <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-card-cyber">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent">
              <Zap className="h-3.5 w-3.5" />
              commande du jour
            </div>
            <Link to="/outils/$slug" params={{ slug: cmdOfDay.slug }} className="mt-3 block">
              <p className="font-display text-sm font-semibold text-foreground/90">{cmdOfDay.name}</p>
            </Link>
            <div className="mt-3 overflow-hidden rounded-md border border-border bg-background/70">
              <div className="flex items-center justify-between border-b border-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>$ snippet</span>
                <button
                  onClick={() => copyCommand(cmdOfDay.command)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                  aria-label="Copier"
                >
                  {copiedCmd ? <Check className="h-3 w-3 text-cyber-cyan" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <pre className="overflow-x-auto px-2.5 py-2 font-mono text-[12px] leading-snug text-cyber-cyan">
                <span className="text-muted-foreground">$ </span>{cmdOfDay.command}
              </pre>
            </div>
          </div>
        </div>
      </section>


      {/* DERNIERS AJOUTS + TOP DÉBUTANTS + TOP AVANCÉS */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <MiniList
            title="Derniers ajouts"
            tone="text-cyber-cyan"
            icon={<TerminalSquare className="h-3.5 w-3.5" />}
            items={recent}
          />
          <MiniList
            title="Top 10 — Débutant"
            tone="text-cyber-emerald"
            icon={<GraduationCap className="h-3.5 w-3.5" />}
            items={beginners}
          />
          <MiniList
            title="Top 10 — Avancé"
            tone="text-accent"
            icon={<Flame className="h-3.5 w-3.5" />}
            items={advanced}
          />
        </div>
      </section>

      {/* LISTE COMPLÈTE + FILTRES */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeader title="Tous les outils" />
        <p className="mt-2 text-sm text-muted-foreground">
          {tools.length} outils — recherche instantanée par nom, description, tag ou commande.
        </p>

        <div className="mt-6 space-y-4">
          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              placeholder="Rechercher : nom, description, tag ou commande..."
              className="h-12 w-full rounded-md border border-border bg-secondary/40 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {filterQ && (
              <button
                onClick={() => setFilterQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">Filtres rapides:</span>
            {levels.map((l) => (
              <Pill key={l} active={lvl === l} onClick={() => setLvl(lvl === l ? "all" : l)}>{l}</Pill>
            ))}
            {osFilters.map((o) => (
              <Pill key={o} active={os === o} onClick={() => setOs(os === o ? "all" : o)}>{o}</Pill>
            ))}
            {quickCats.map((qc) => (
              <Pill key={qc.slug} active={cat === qc.slug} onClick={() => setCat(cat === qc.slug ? "all" : qc.slug)}>
                {qc.label}
              </Pill>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">Catégorie:</span>
            <Pill active={cat === "all"} onClick={() => setCat("all")}>Toutes</Pill>
            {categories.map((c) => (
              <Pill key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                {c.name}
              </Pill>
            ))}
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          → {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-secondary/30 p-12 text-center">
            <p className="font-display text-lg font-semibold">Aucun outil trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">Essayez d'autres mots-clés ou filtres.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function MiniList({ title, tone, icon, items }: { title: string; tone: string; icon: React.ReactNode; items: Tool[] }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-5">
      <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider ${tone}`}>
        {icon}
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((t) => (
          <li key={t.slug}>
            <Link to="/outils/$slug" params={{ slug: t.slug }}
              className="group flex items-center gap-3 rounded-md border border-transparent px-2 py-1.5 transition hover:border-border hover:bg-background/40">
              <ToolLogo tool={t} size={28} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold truncate">{t.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{t.short}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-3">
      <Icon className={`h-5 w-5 ${accent}`} />
      <div>
        <p className={`font-display text-xl font-bold ${accent}`}>{value}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>;
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-primary/60 bg-primary/15 text-primary shadow-glow-blue"
          : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
