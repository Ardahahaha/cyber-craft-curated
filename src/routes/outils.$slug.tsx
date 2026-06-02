import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, ExternalLink, ShieldAlert, Star, Copy, Check, Github,
  Lightbulb, AlertTriangle, BookOpen, TerminalSquare, Download, MonitorSmartphone, Scale, Tag, GitFork, FileText, Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { ETHICAL_NOTICE, getCategory, getTool, tools } from "@/data/tools";
import { useFavorites } from "@/hooks/use-favorites";

function parseGithub(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

function useReadme(githubUrl: string) {
  const [state, setState] = useState<{ html: string | null; loading: boolean; error: string | null }>({
    html: null, loading: true, error: null,
  });

  useEffect(() => {
    const parsed = parseGithub(githubUrl);
    if (!parsed) {
      setState({ html: null, loading: false, error: "Lien GitHub invalide" });
      return;
    }
    const cacheKey = `readme:${parsed.owner}/${parsed.repo}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setState({ html: cached, loading: false, error: null });
        return;
      }
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
        setState({ html: null, loading: false, error: e.message ?? "Impossible de charger le README" });
      });
    return () => { cancelled = true; };
  }, [githubUrl]);

  return state;
}

export const Route = createFileRoute("/outils/$slug")({
  beforeLoad: ({ params }) => {
    if (!getTool(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const tool = getTool(params.slug);
    return {
      meta: [
        { title: `${tool?.name ?? "Outil"} — IT-ools` },
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
  const [copied, setCopied] = useState<string | null>(null);

  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
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
              <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                <TerminalSquare className="h-3.5 w-3.5" /> CLI tool · {cat.name}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                {tool.name}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">{tool.short}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>{tool.level}</Badge>
                <Badge>Open Source</Badge>
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-mono uppercase text-muted-foreground">
                  <MonitorSmartphone className="h-3 w-3" /> {tool.os.join(" · ")}
                </span>
                {tool.ethical && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-mono uppercase text-destructive">
                    <ShieldAlert className="h-3 w-3" /> usage légal uniquement
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href={tool.github} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-blue transition hover:bg-primary/90">
                  <Github className="h-4 w-4" /> Voir sur GitHub <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button onClick={() => copy(tool.command, "cmd-top")}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50">
                  {copied === "cmd-top" ? <><Check className="h-4 w-4 text-cyber-cyan" /> Commande copiée</> : <><Copy className="h-4 w-4" /> Copier la commande</>}
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

            <ReadmeBlock githubUrl={tool.github} />

            <Block icon={Download} title="Installation">
              <CodeBlock label="install" code={tool.install} onCopy={() => copy(tool.install, "install")} copied={copied === "install"} />
            </Block>

            <Block icon={TerminalSquare} title="Commande de base">
              <CodeBlock label="$ shell" code={tool.command} onCopy={() => copy(tool.command, "cmd")} copied={copied === "cmd"} />
              <p className="mt-3 text-xs text-muted-foreground">
                Exemple à exécuter sur vos propres systèmes, en laboratoire ou avec une autorisation écrite.
              </p>
            </Block>

            <Block icon={Lightbulb} title="Cas d'usage légaux">
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

          <aside className="space-y-5">
            <SideCard icon={Scale} title="Niveau requis">
              <p className="font-display text-xl font-bold text-primary">{tool.level}</p>
            </SideCard>
            <SideCard icon={MonitorSmartphone} title="Systèmes compatibles">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {tool.os.map((o) => (
                  <li key={o} className="font-mono">→ {o}</li>
                ))}
              </ul>
            </SideCard>
            <SideCard icon={Tag} title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tg) => (
                  <span key={tg} className="rounded bg-secondary/60 px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                    #{tg}
                  </span>
                ))}
              </div>
            </SideCard>
            <SideCard icon={GitFork} title="Alternatives">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {tool.alternatives.map((a) => (
                  <li key={a} className="font-mono">→ {a}</li>
                ))}
              </ul>
            </SideCard>
            <SideCard icon={Github} title="GitHub">
              <a href={tool.github} target="_blank" rel="noreferrer"
                 className="block break-all font-mono text-xs text-primary hover:underline">
                {tool.github}
              </a>
            </SideCard>
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

function CodeBlock({ label, code, onCopy, copied }: { label: string; code: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-background/70">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <button onClick={onCopy} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
          {copied ? <><Check className="h-3 w-3 text-cyber-cyan" /> copié</> : <><Copy className="h-3 w-3" /> copier</>}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12px] leading-relaxed text-cyber-cyan">
        <span className="text-muted-foreground">$ </span>{code}
      </pre>
    </div>
  );
}

function ReadmeBlock({ githubUrl }: { githubUrl: string }) {
  const { html, loading, error } = useReadme(githubUrl);
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
