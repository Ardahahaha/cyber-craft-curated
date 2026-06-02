import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Github, Layers } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { TerminalSnippet } from "@/components/TerminalSnippet";
import { CategoryTile } from "@/components/CategoryTile";
import { ToolCard } from "@/components/ToolCard";
import { categories, tools, toolsByCategory } from "@/data/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechTools Hub — La revue des meilleurs outils open source" },
      {
        name: "description",
        content:
          "Une sélection claire, utile et mise en valeur d'outils open source en cybersécurité, OSINT, réseau, forensic et automatisation.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const popular = tools.filter((t) => t.popular).slice(0, 6);
  const recent = tools.filter((t) => t.recent).slice(0, 4);
  const featured = tools.filter((t) => t.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[88vh]">
          <HeroBackground />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-12 lg:pt-28">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-mono text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
                v1.0 — revue technologique open source
              </div>

              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                TechTools <span className="text-gradient">Hub</span>
                <br />
                <span className="text-muted-foreground/90 text-3xl sm:text-4xl lg:text-5xl font-semibold">
                  la revue des meilleurs outils open source.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Cybersécurité, OSINT, réseau, forensic et automatisation : une sélection
                claire, utile et mise en valeur pour étudiants, administrateurs,
                analystes et passionnés.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/outils"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue transition hover:bg-primary/90"
                >
                  Explorer les outils
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  <Layers className="h-4 w-4" />
                  Voir les catégories
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground">
                <span><strong className="text-foreground">{tools.length}+</strong> outils</span>
                <span><strong className="text-foreground">{categories.length}</strong> catégories</span>
                <span className="inline-flex items-center gap-1.5"><Github className="h-3.5 w-3.5" /> 100% open source</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <TerminalSnippet />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: Zap, label: "Curé", v: "à la main" },
                  { icon: ShieldCheck, label: "Cadre", v: "éthique" },
                  { icon: Sparkles, label: "Mis à jour", v: "régulièrement" },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-lg p-3">
                    <s.icon className="h-4 w-4 text-primary" />
                    <p className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">{s.label}</p>
                    <p className="text-xs font-semibold">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              # pourquoi ce site
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Une revue, pas un fourre-tout.
            </h2>
          </div>
          <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
            {[
              {
                title: "Sélection rigoureuse",
                body: "Chaque outil est choisi pour son utilité réelle, sa maturité et la qualité de sa communauté.",
                icon: Sparkles,
              },
              {
                title: "Catégories claires",
                body: "Cybersécurité, OSINT, réseau, forensic, sysadmin, automatisation et veille : tout est rangé.",
                icon: Layers,
              },
              {
                title: "Cadre éthique",
                body: "Les outils offensifs sont présentés comme outils d'audit, de formation ou de défense uniquement.",
                icon: ShieldCheck,
              },
              {
                title: "Liens officiels",
                body: "Tous les liens pointent vers les dépôts GitHub officiels ou sites des projets.",
                icon: Github,
              },
            ].map((b, i) => (
              <div key={i} className="rounded-lg border border-border bg-gradient-card p-5 hover-lift">
                <b.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-display text-base font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU LUDIQUE CATEGORIES */}
      <section id="categories" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              # menu d'accueil
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Choisissez votre terrain de jeu.
            </h2>
          </div>
          <Link to="/categories" className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex items-center gap-1">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} count={toolsByCategory(c.slug).length} />
          ))}
        </div>
      </section>

      {/* OUTILS POPULAIRES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyber-cyan">
              # populaires
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Outils populaires</h2>
          </div>
          <Link to="/outils" className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex items-center gap-1">
            Tous les outils <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* À DÉCOUVRIR + DERNIERS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent"># à découvrir cette semaine</p>
            <h3 className="mt-2 font-display text-2xl font-bold">Coup de projecteur</h3>
            <div className="mt-6 space-y-4">
              {featured.map((t) => (
                <Link key={t.slug} to="/outils/$slug" params={{ slug: t.slug }}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-gradient-card p-4 hover-lift">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-hero font-display text-lg font-bold text-background shadow-glow-blue">
                    {t.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-bold">{t.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{t.short}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyber-cyan"># derniers ajouts</p>
            <h3 className="mt-2 font-display text-2xl font-bold">Fraîchement intégrés</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {recent.map((t) => (
                <Link key={t.slug} to="/outils/$slug" params={{ slug: t.slug }}
                  className="group rounded-lg border border-border bg-gradient-card p-4 hover-lift">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{t.category}</p>
                  <p className="mt-1 font-display text-base font-bold">{t.name}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{t.short}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-10 text-center shadow-card-cyber">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold sm:text-4xl">
              Prêt à enrichir votre <span className="text-gradient">stack technique</span> ?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Parcourez {tools.length}+ outils open source soigneusement sélectionnés et
              documentés.
            </p>
            <Link to="/outils" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue transition hover:bg-primary/90">
              Explorer la bibliothèque <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
