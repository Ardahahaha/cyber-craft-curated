import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, ShieldAlert, Star, Copy, Check, Github, Lightbulb, AlertTriangle, BookOpen } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { ETHICAL_NOTICE, getCategory, getTool, tools } from "@/data/tools";
import { useFavorites } from "@/hooks/use-favorites";

export const Route = createFileRoute("/outils/$slug")({
  beforeLoad: ({ params }) => {
    if (!getTool(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const tool = getTool(params.slug);
    return {
      meta: [
        { title: `${tool?.name ?? "Outil"} — TechTools Hub` },
        { name: "description", content: tool?.short ?? "" },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p>Outil introuvable. <Link to="/outils" className="text-primary underline">Retour</Link></p>
    </div>
  ),
});

function ToolPage() {
  const { slug } = Route.useParams();
  const tool = getTool(slug)!;
  const cat = getCategory(tool.category);
  const { has, toggle } = useFavorites();
  const fav = has(tool.slug);
  const [copied, setCopied] = useState(false);

  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const copy = () => {
    navigator.clipboard.writeText(tool.github);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="border-b border-border bg-background/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <Link to="/outils" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> tous les outils
            </Link>
            <span>/</span>
            <Link to="/categories/$slug" params={{ slug: cat.slug }} className="hover:text-foreground">
              {cat.name}
            </Link>
          </div>

          <div className="mt-6 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">{cat.name}</p>
              <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                {tool.name}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">{tool.short}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>{tool.level}</Badge>
                <Badge>Open Source</Badge>
                {tool.ethical && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-mono uppercase text-destructive">
                    <ShieldAlert className="h-3 w-3" /> usage encadré
                  </span>
                )}
                {tool.tags.map((t) => (
                  <span key={t} className="rounded bg-secondary/60 px-2 py-1 text-xs font-mono text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href={tool.github} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-blue transition hover:bg-primary/90">
                  <Github className="h-4 w-4" /> Voir sur GitHub <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button onClick={copy}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50">
                  {copied ? <><Check className="h-4 w-4 text-cyber-cyan" /> Lien copié</> : <><Copy className="h-4 w-4" /> Copier le lien</>}
                </button>
                <button onClick={() => toggle(tool.slug)}
                  className={`inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
                    fav ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary/40 hover:border-accent/40"
                  }`}>
                  <Star className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
                  {fav ? "Favori" : "Ajouter aux favoris"}
                </button>
              </div>
            </div>
            <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-hero font-display text-4xl font-bold text-background shadow-glow-blue sm:flex">
              {tool.name[0]}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-10">
            <Block icon={BookOpen} title="Présentation">
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
              <p className="mt-3 rounded-md border border-border bg-secondary/40 p-4 text-sm">
                <span className="font-semibold text-foreground">Utilité concrète : </span>
                <span className="text-muted-foreground">{tool.utility}</span>
              </p>
            </Block>

            <Block icon={Lightbulb} title="Cas d'usage">
              <ul className="space-y-2">
                {tool.useCases.map((u) => (
                  <li key={u} className="flex gap-3 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{u}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <div className="grid gap-6 sm:grid-cols-2">
              <Block title="Avantages">
                <ul className="space-y-2">
                  {tool.pros.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyber-cyan" /> {p}
                    </li>
                  ))}
                </ul>
              </Block>
              <Block title="Limites">
                <ul className="space-y-2">
                  {tool.limits.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {p}
                    </li>
                  ))}
                </ul>
              </Block>
            </div>

            <Block title="Exemple d'utilisation légitime">
              <p className="text-sm text-muted-foreground">
                {tool.ethical
                  ? `Exemple : un analyste sécurité utilise ${tool.name} dans le cadre d'un audit autorisé pour valider la robustesse d'un service interne, avec un mandat écrit du client.`
                  : `Exemple : un administrateur déploie ${tool.name} sur sa propre infrastructure pour superviser, automatiser ou diagnostiquer son environnement.`}
              </p>
            </Block>

            {tool.ethical && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-display font-semibold text-foreground">Avertissement éthique</p>
                    <p className="mt-1 text-sm text-muted-foreground">{ETHICAL_NOTICE}</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-gradient-card p-5">
              <h4 className="font-display text-sm font-semibold">Niveau requis</h4>
              <p className="mt-2 text-2xl font-display font-bold text-primary">{tool.level}</p>
            </div>
            <div className="rounded-xl border border-border bg-gradient-card p-5">
              <h4 className="font-display text-sm font-semibold">Alternatives</h4>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {tool.alternatives.map((a) => (
                  <li key={a} className="font-mono">→ {a}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-gradient-card p-5">
              <h4 className="font-display text-sm font-semibold">Lien officiel</h4>
              <a href={tool.github} target="_blank" rel="noreferrer"
                 className="mt-2 block break-all font-mono text-xs text-primary hover:underline">
                {tool.github}
              </a>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-2xl font-bold">Outils similaires</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ToolCard key={r.slug} tool={r} />)}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-mono uppercase text-primary">
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
