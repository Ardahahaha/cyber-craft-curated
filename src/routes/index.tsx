import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight, Search, ShieldCheck, Network, Fingerprint, Server, Workflow,
  TerminalSquare, Sparkles, Github, Zap, Star, Copy, Check, GraduationCap,
  Layers, Activity, Database, Lock, FileSearch, BookOpen,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { TerminalSnippet } from "@/components/TerminalSnippet";
import { categories, tools, toolsByCategory, type Tool } from "@/data/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechTools Hub — La revue des outils CLI open source" },
      {
        name: "description",
        content:
          "Dashboard d'outils en ligne de commande pour cybersécurité, OSINT, réseau, forensic, administration système et automatisation.",
      },
    ],
  }),
  component: Home,
});

const catIconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  ShieldCheck, Search, Network, Fingerprint, Server, Workflow,
};

function Home() {
  const navigate = useNavigate({ from: "/" });
  const [q, setQ] = useState("");

  const beginnerTools = useMemo(() => tools.filter((t) => t.level === "Débutant").slice(0, 6), []);
  const advancedTools = useMemo(() => tools.filter((t) => t.level === "Avancé").slice(0, 6), []);
  const recent = useMemo(() => tools.filter((t) => t.recent).slice(0, 4), []);
  const featured = useMemo(() => tools.filter((t) => t.featured)[0] ?? tools[0], []);
  const ethicalCount = useMemo(() => tools.filter((t) => t.ethical).length, []);

  // Stacks
  const stackCyber = ["nmap", "nuclei", "ffuf", "sqlmap", "hashcat"].map(byslug).filter(Boolean) as Tool[];
  const stackOsint = ["theharvester", "subfinder", "sherlock", "ghunt", "spiderfoot"].map(byslug).filter(Boolean) as Tool[];
  const stackReseau = ["tcpdump", "dig", "mtr", "iperf3", "curl"].map(byslug).filter(Boolean) as Tool[];
  const stackForensic = ["volatility", "yara", "plaso", "velociraptor"].map(byslug).filter(Boolean) as Tool[];

  // "Commande du jour" — déterministe par jour, sans IA
  const cmdOfDay = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return tools[day % tools.length];
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/outils", search: q.trim() ? { q: q.trim() } : {} });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO + STATUS BAR */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative">
          <HeroBackground />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-12 lg:pt-20">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-mono text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
                v1.0 · revue d'outils CLI open source
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                TechTools <span className="text-gradient">Hub</span>
                <br />
                <span className="text-muted-foreground/90 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  uniquement des outils en ligne de commande.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Une sélection rigoureuse d'outils <strong className="text-foreground">CLI</strong> pour la cybersécurité,
                l'OSINT, le réseau, le forensic, l'administration système et l'automatisation.
                Chaque outil documenté avec installation, commande de base, systèmes compatibles et cadre d'usage légal.
              </p>

              {/* Barre de recherche centrale */}
              <form onSubmit={submitSearch} className="mt-7 max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher un outil CLI : nmap, sqlmap, yara, jq..."
                    className="h-12 w-full rounded-md border border-border bg-secondary/40 pl-11 pr-28 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="submit"
                    className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow-blue hover:bg-primary/90">
                    Lancer <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                {/* Filtres rapides */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">filtres rapides:</span>
                  {[
                    { label: "Débutant", search: { lvl: "Débutant" } },
                    { label: "Avancé", search: { lvl: "Avancé" } },
                    { label: "Réseau", search: { cat: "reseau" } },
                    { label: "OSINT", search: { cat: "osint" } },
                    { label: "Forensic", search: { cat: "forensic" } },
                  ].map((f) => (
                    <Link key={f.label} to="/outils" search={f.search as never}
                      className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground">
                      {f.label}
                    </Link>
                  ))}
                </div>
              </form>
            </div>

            <div className="lg:col-span-5">
              <TerminalSnippet />
            </div>
          </div>

          {/* STATUS BAR / KPI */}
          <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Kpi icon={TerminalSquare} label="Outils CLI" value={tools.length} accent="text-primary" />
              <Kpi icon={Layers} label="Catégories" value={categories.length} accent="text-cyber-cyan" />
              <Kpi icon={Lock} label="Usage encadré" value={ethicalCount} accent="text-accent" />
              <Kpi icon={Github} label="Open source" value="100%" accent="text-cyber-cyan" />
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeader eyebrow="# dashboard" title="Tableau de bord" />

        <div className="mt-8 grid gap-5 lg:grid-cols-12">

          {/* COMMANDE DU JOUR */}
          <Panel className="lg:col-span-7" icon={TerminalSquare} title="Commande du jour" subtitle={`${cmdOfDay.name} · ${cmdOfDay.os.join(" · ")}`}>
            <CommandShowcase tool={cmdOfDay} />
          </Panel>

          {/* TOOL RECOMMANDÉ */}
          <Panel className="lg:col-span-5" icon={Sparkles} title="Tool recommandé" subtitle="Coup de projecteur de la rédaction">
            <RecommendedTool tool={featured} />
          </Panel>

          {/* CATEGORIES */}
          <Panel className="lg:col-span-12" icon={Layers} title="Catégories principales" subtitle="Naviguer par domaine d'usage">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => {
                const Icon = catIconMap[c.icon] ?? ShieldCheck;
                const count = toolsByCategory(c.slug).length;
                return (
                  <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }}
                    className="group flex items-start gap-3 rounded-lg border border-border bg-background/40 p-4 transition hover:border-primary/50 hover:bg-secondary/40">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/60 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-bold">{c.name}</p>
                        <span className="font-mono text-[10px] text-muted-foreground">{count} CLI</span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.short}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </Panel>

          {/* DEBUTER */}
          <Panel className="lg:col-span-6" icon={GraduationCap} title="Pour débuter" subtitle="CLI essentiels, faciles à prendre en main">
            <ToolList tools={beginnerTools} />
          </Panel>

          {/* AVANCES */}
          <Panel className="lg:col-span-6" icon={Activity} title="Outils avancés" subtitle="Sujets profonds, à manier avec rigueur">
            <ToolList tools={advancedTools} />
          </Panel>

          {/* STACKS */}
          <Panel className="lg:col-span-6" icon={ShieldCheck} title="Stack cybersécurité débutant" subtitle="Une base CLI cohérente pour démarrer un audit défensif autorisé">
            <StackList tools={stackCyber} />
          </Panel>

          <Panel className="lg:col-span-6" icon={Search} title="Stack OSINT" subtitle="Reconnaissance passive et identités numériques">
            <StackList tools={stackOsint} />
          </Panel>

          <Panel className="lg:col-span-6" icon={Network} title="Stack réseau" subtitle="Diagnostic, capture, métrologie">
            <StackList tools={stackReseau} />
          </Panel>

          <Panel className="lg:col-span-6" icon={Fingerprint} title="Stack forensic" subtitle="Mémoire, timelines, règles de détection">
            <StackList tools={stackForensic} />
          </Panel>

          {/* DERNIERS AJOUTS */}
          {recent.length > 0 && (
            <Panel className="lg:col-span-12" icon={Database} title="Derniers ajouts" subtitle="Fraîchement intégrés à la revue">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recent.map((t) => (
                  <Link key={t.slug} to="/outils/$slug" params={{ slug: t.slug }}
                    className="group rounded-lg border border-border bg-background/40 p-4 transition hover:border-primary/50">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">{t.category}</p>
                    <p className="mt-1 font-display text-sm font-bold">{t.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.short}</p>
                    <p className="mt-2 truncate font-mono text-[10px] text-cyber-cyan">$ {t.command}</p>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {/* NOTICE */}
          <Panel className="lg:col-span-12" icon={Lock} title="Usage légal uniquement" subtitle="TechTools Hub recense des outils défensifs et d'audit autorisés">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Les outils présentés — y compris ceux historiquement utilisés en sécurité offensive —
              sont documentés exclusivement pour l'apprentissage, l'audit autorisé, le laboratoire personnel,
              la défense et la formation. N'exécutez jamais une commande contre un système dont vous
              n'êtes ni propriétaire, ni explicitement autorisé à tester par écrit.
            </p>
          </Panel>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function byslug(slug: string) {
  return tools.find((t) => t.slug === slug);
}

function Kpi({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; accent: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`h-4 w-4 ${accent}`} />
        <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-1 font-display text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
    </div>
  );
}

function Panel({
  className = "",
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  className?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`glass relative overflow-hidden rounded-xl p-5 shadow-card-cyber ${className}`}>
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="relative mt-5">{children}</div>
    </div>
  );
}

function CommandShowcase({ tool }: { tool: Tool }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(tool.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <div className="overflow-hidden rounded-md border border-border bg-background/80">
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>{tool.name.toLowerCase().replace(/\s+/g, "-")}@hub:~</span>
          <button onClick={copy} className="inline-flex items-center gap-1 hover:text-primary">
            {copied ? <><Check className="h-3 w-3 text-cyber-cyan" /> copié</> : <><Copy className="h-3 w-3" /> copier</>}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-cyber-cyan">
          <span className="text-muted-foreground"># {tool.short}</span>
          {"\n"}
          <span className="text-muted-foreground">$ </span>{tool.command}
        </pre>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Exemple légal · {tool.os.join(" · ")} · niveau {tool.level}
        </p>
        <Link to="/outils/$slug" params={{ slug: tool.slug }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          Voir la fiche <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function RecommendedTool({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-hero font-display text-lg font-bold text-background shadow-glow-blue">
          <TerminalSquare className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold">{tool.name}</p>
          <p className="truncate text-xs text-muted-foreground">{tool.short}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">{tool.level}</span>
        <span className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">{tool.os.join(" · ")}</span>
        <Link to="/outils/$slug" params={{ slug: tool.slug }} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          Lire la fiche <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function ToolList({ tools: list }: { tools: Tool[] }) {
  return (
    <ul className="divide-y divide-border">
      {list.map((t) => (
        <li key={t.slug}>
          <Link to="/outils/$slug" params={{ slug: t.slug }}
            className="group flex items-center gap-3 py-2.5 transition hover:bg-secondary/30 -mx-2 px-2 rounded">
            <TerminalSquare className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">{t.short}</p>
            </div>
            <span className="hidden font-mono text-[10px] uppercase text-muted-foreground sm:inline">
              {t.level}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function StackList({ tools: list }: { tools: Tool[] }) {
  return (
    <ol className="space-y-2">
      {list.map((t, i) => (
        <li key={t.slug}>
          <Link to="/outils/$slug" params={{ slug: t.slug }}
            className="group flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2 transition hover:border-primary/50">
            <span className="font-mono text-[10px] text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold">{t.name}</p>
              <p className="truncate font-mono text-[11px] text-cyber-cyan">$ {t.command}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
