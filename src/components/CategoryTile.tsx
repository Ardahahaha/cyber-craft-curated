import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Search, Network, Fingerprint, Server, Workflow, Rss } from "lucide-react";
import type { Category } from "@/data/tools";

const iconMap = { ShieldCheck, Search, Network, Fingerprint, Server, Workflow, Rss };

const accentMap = {
  blue: "from-primary/20 to-primary/0 group-hover:shadow-glow-blue text-primary",
  violet: "from-accent/20 to-accent/0 group-hover:shadow-glow-violet text-accent",
  cyan: "from-cyber-cyan/20 to-cyber-cyan/0 group-hover:shadow-glow-cyan text-cyber-cyan",
} as const;

export function CategoryTile({ category, count }: { category: Category; count: number }) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] ?? ShieldCheck;
  const accent = accentMap[category.accent];

  return (
    <Link
      to="/categories/$slug"
      params={{ slug: category.slug }}
      className="group relative block overflow-hidden rounded-xl border border-border bg-gradient-card p-6 hover-lift shadow-card-cyber"
    >
      <div className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br ${accent} opacity-50 blur-2xl transition-opacity group-hover:opacity-100`} />

      <div className="relative flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background/60 ${accent.split(" ").pop()} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{count} outils</span>
      </div>

      <h3 className="relative mt-5 font-display text-xl font-bold tracking-tight">
        {category.name}
      </h3>
      <p className="relative mt-1 font-mono text-xs text-muted-foreground/80">
        {category.short}
      </p>
      <p className="relative mt-3 text-sm text-muted-foreground line-clamp-3">
        {category.description}
      </p>

      <div className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Explorer la catégorie
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
