import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ExternalLink, Star, GitFork } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type DiscoveredTool = {
  id: string;
  name: string;
  full_name: string;
  github_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  score: number;
  suggested_category: string | null;
  install_cmd: string | null;
  example_cmd: string | null;
  ethical: boolean;
};

export function DiscoverySections() {
  const [daily, setDaily] = useState<DiscoveredTool | null>(null);
  const [dailyReason, setDailyReason] = useState<string | null>(null);
  const [recent, setRecent] = useState<DiscoveredTool[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: d } = await supabase
        .from("daily_tool")
        .select("reason, tool:discovered_tools(*)")
        .lte("featured_date", today)
        .order("featured_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (d?.tool) {
        setDaily(d.tool as unknown as DiscoveredTool);
        setDailyReason(d.reason);
      }
      const { data: rows } = await supabase
        .from("discovered_tools")
        .select("*")
        .eq("status", "approved")
        .order("detected_at", { ascending: false })
        .limit(6);
      setRecent((rows ?? []) as unknown as DiscoveredTool[]);
    })();
  }, []);

  if (!daily && recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
      {daily && (
        <div className="rounded-2xl border border-primary/30 bg-gradient-card p-6 shadow-card-cyber">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyber-cyan">
            <Sparkles className="h-3.5 w-3.5" /> tool du jour · discovery
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold">{daily.name}</h2>
              {daily.suggested_category && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {daily.suggested_category}
                </p>
              )}
              <p className="mt-3 text-sm text-foreground/85">{daily.description}</p>
              {dailyReason && <p className="mt-2 text-xs text-muted-foreground italic">{dailyReason}</p>}
              {daily.example_cmd && (
                <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-background/70 px-3 py-2 font-mono text-[11px] text-cyber-cyan">
                  <span className="text-muted-foreground">$ </span>{daily.example_cmd}
                </pre>
              )}
              {daily.ethical && (
                <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
                  À utiliser uniquement sur vos propres systèmes, en laboratoire ou avec autorisation explicite.
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2 md:w-56">
              <Stat label="Score" value={daily.score} accent="text-cyber-emerald" />
              <Stat label="Stars" value={daily.stars} icon={Star} />
              <Stat label="Forks" value={daily.forks} icon={GitFork} />
              <a
                href={daily.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold hover:border-primary/50 hover:text-primary"
              >
                GitHub <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-cyber-cyan">discovery</div>
              <h2 className="mt-1 font-display text-2xl font-bold">Nouveaux outils détectés</h2>
            </div>
            <Link to="/outils" className="text-xs text-muted-foreground hover:text-primary">
              Voir tout →
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((t) => (
              <a
                key={t.id}
                href={t.github_url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-border bg-gradient-card p-4 hover-lift"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-base font-bold group-hover:text-primary">{t.name}</p>
                  <span className="font-mono text-[10px] text-cyber-emerald">{t.score}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.suggested_category} · {t.language ?? "—"}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
                <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{t.stars}</span>
                  <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" />{t.forks}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: number;
  accent?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background/60 px-3 py-2">
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </span>
      <span className={`font-mono text-sm font-bold ${accent ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}
