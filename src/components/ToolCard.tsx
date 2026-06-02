import { Link } from "@tanstack/react-router";
import { ExternalLink, Star, Copy, Check, ShieldAlert, TerminalSquare, ChevronDown, Download, Play } from "lucide-react";
import { useState } from "react";

import type { Tool } from "@/data/tools";
import { getCategory } from "@/data/tools";
import { useFavorites } from "@/hooks/use-favorites";

const levelStyles: Record<Tool["level"], string> = {
  Débutant: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30",
  Intermédiaire: "bg-primary/15 text-primary border-primary/30",
  Avancé: "bg-accent/15 text-accent border-accent/30",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const cat = getCategory(tool.category);
  const { has, toggle } = useFavorites();
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const fav = has(tool.slug);

  const copyText = (text: string, key: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };


  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card p-5 hover-lift shadow-card-cyber">
      <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ToolLogo tool={tool} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              {cat.name}
            </div>
            <h3 className="mt-1.5 font-display text-lg font-bold leading-tight">
              {tool.name}
            </h3>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(tool.slug);
          }}
          aria-label="Favori"
          className={`shrink-0 rounded-md border p-1.5 transition ${
            fav
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${fav ? "fill-current" : ""}`} />
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{tool.short}</p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">
          <TerminalSquare className="h-2.5 w-2.5" /> CLI tool
        </span>
        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase ${levelStyles[tool.level]}`}>
          {tool.level}
        </span>
        <span className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">
          {tool.os.join(" · ")}
        </span>
        {tool.ethical && (
          <span className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-mono uppercase text-destructive">
            <ShieldAlert className="h-2.5 w-2.5" /> usage légal
          </span>
        )}
      </div>

      {/* Command preview */}
      <div className="mt-4 overflow-hidden rounded-md border border-border bg-background/70">
        <div className="flex items-center justify-between border-b border-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>commande de base</span>
          <button
            onClick={copyText(tool.command, "cmd")}
            aria-label="Copier la commande"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            {copied === "cmd" ? <Check className="h-3 w-3 text-cyber-cyan" /> : <Copy className="h-3 w-3" />}

          </button>
        </div>
        <pre className="overflow-x-auto px-2.5 py-2 font-mono text-[11px] leading-snug text-cyber-cyan">
          <span className="text-muted-foreground">$ </span>{tool.command}
        </pre>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {tool.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          aria-expanded={expanded}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 hover:shadow-glow-blue"
        >
          {expanded ? "Réduire" : "Détails"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        <a
          href={tool.github}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
        >
          GitHub <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm leading-relaxed text-foreground/90">{tool.description}</p>

          {tool.utility && (
            <div>
              <h4 className="mb-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Utilité</h4>
              <p className="text-sm text-foreground/80">{tool.utility}</p>
            </div>
          )}

          <div className="overflow-hidden rounded-md border border-border bg-background/70">
            <div className="flex items-center justify-between border-b border-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Download className="h-3 w-3" /> installation</span>
              <button
                onClick={copyText(tool.install, "install")}
                aria-label="Copier l'installation"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                {copied === "install" ? <Check className="h-3 w-3 text-cyber-cyan" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <pre className="overflow-x-auto px-2.5 py-2 font-mono text-[11px] leading-snug text-cyber-emerald">
              <span className="text-muted-foreground">$ </span>{tool.install}
            </pre>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-background/70">
            <div className="flex items-center justify-between border-b border-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Play className="h-3 w-3" /> lancement</span>
              <button
                onClick={copyText(tool.command, "launch")}
                aria-label="Copier la commande de lancement"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                {copied === "launch" ? <Check className="h-3 w-3 text-cyber-cyan" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <pre className="overflow-x-auto px-2.5 py-2 font-mono text-[11px] leading-snug text-cyber-cyan">
              <span className="text-muted-foreground">$ </span>{tool.command}
            </pre>
          </div>

          {tool.useCases?.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Cas d'usage</h4>
              <ul className="space-y-1 text-sm text-foreground/80">
                {tool.useCases.slice(0, 4).map((u) => (
                  <li key={u} className="flex gap-2"><span className="text-primary">▸</span>{u}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            to="/outils/$slug"
            params={{ slug: tool.slug }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Page complète & README →
          </Link>
        </div>
      )}
    </article>
  );
}

