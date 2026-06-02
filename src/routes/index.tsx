import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight, Search, ShieldCheck, Network, Fingerprint, Server, Workflow,
  TerminalSquare, Sparkles, Github, Layers, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { TerminalSnippet } from "@/components/TerminalSnippet";
import { ToolCard } from "@/components/ToolCard";
import { ToolLogo } from "@/components/ToolLogo";
import { categories, tools, type Level, type CategorySlug } from "@/data/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IT-ools — La revue des outils CLI open source" },
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

const levels: Level[] = ["Débutant", "Intermédiaire", "Avancé"];

function Home() {
  const navigate = useNavigate({ from: "/" });
  const [q, setQ] = useState("");

  const [filterQ, setFilterQ] = useState("");
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [lvl, setLvl] = useState<Level | "all">("all");

  const recent = useMemo(() => tools.filter((t) => t.recent).slice(0, 4), []);

  const filtered = useMemo(() => {
    const term = filterQ.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (lvl !== "all" && t.level !== lvl) return false;
      if (!term) return true;
      return (
        t.name.toLowerCase().includes(term) ||
        t.short.toLowerCase().includes(term) ||
        t.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        t.category.toLowerCase().includes(term)
      );
    });
  }, [filterQ, cat, lvl]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/outils", search: q.trim() ? { q: q.trim() } : {} });
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
                v1.0 · revue d'outils CLI open source
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                IT<span className="text-gradient">-ools</span>
                <br />
                <span className="text-muted-foreground/90 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  uniquement des outils en ligne de commande.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Une sélection rigoureuse d'outils <strong className="text-foreground">CLI</strong> pour la cybersécurité,
                l'OSINT, le réseau, le forensic, l'administration système et l'automatisation.
              </p>

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
            <Kpi icon={Github} label="Open source" value="100%" accent="text-cyber-cyan" />
            <Kpi icon={Sparkles} label="Mis à jour" value="Régulier" accent="text-primary" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeader title="Explorer par catégorie" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = catIconMap[c.icon] ?? ShieldCheck;
            const count = tools.filter((t) => t.category === c.slug).length;
            return (
              <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }}
                className="group flex items-start gap-4 rounded-xl border border-border bg-secondary/20 p-5 transition hover:border-primary/40 hover:bg-secondary/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-bold">{c.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">{count} CLI</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.short}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* DERNIERS AJOUTS */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="rounded-xl border border-border bg-secondary/20 p-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <TerminalSquare className="h-3.5 w-3.5 text-cyber-cyan" />
            Derniers ajouts
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recent.map((t) => (
              <Link key={t.slug} to="/outils/$slug" params={{ slug: t.slug }}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3 transition hover:border-primary/40">
                <ToolLogo tool={t} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.short}</p>
                </div>
                <ArrowRight className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LISTE COMPLÈTE + FILTRES */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeader title="Tous les outils" />
        <p className="mt-2 text-sm text-muted-foreground">
          {tools.length} outils — filtrez par catégorie, niveau ou recherchez.
        </p>

        <div className="mt-6 space-y-4">
          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              placeholder="Rechercher un outil, un tag, une catégorie..."
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
            <span className="font-mono text-[10px] uppercase text-muted-foreground">Catégorie:</span>
            <Pill active={cat === "all"} onClick={() => setCat("all")}>Toutes</Pill>
            {categories.map((c) => (
              <Pill key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                {c.name}
              </Pill>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">Niveau:</span>
            <Pill active={lvl === "all"} onClick={() => setLvl("all")}>Tous</Pill>
            {levels.map((l) => (
              <Pill key={l} active={lvl === l} onClick={() => setLvl(l)}>
                {l}
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
