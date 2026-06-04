import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ExternalLink, Star, GitFork, CalendarDays, ArrowRight } from "lucide-react";
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

type DailyRow = { featured_date: string; reason: string | null; tool: DiscoveredTool };

export function DiscoverySections() {
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [weekly, setWeekly] = useState<DiscoveredTool[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      // Try today's daily tools first
      let { data: dailyRows } = await supabase
        .from("daily_tool")
        .select("featured_date, reason, tool:discovered_tools(*)")
        .eq("featured_date", today)
        .order("created_at", { ascending: false });

      // Fallback : dernière journée disponible
      if (!dailyRows || dailyRows.length === 0) {
        const { data: latest } = await supabase
          .from("daily_tool")
          .select("featured_date")
          .order("featured_date", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (latest) {
          const { data: fb } = await supabase
            .from("daily_tool")
            .select("featured_date, reason, tool:discovered_tools(*)")
            .eq("featured_date", latest.featured_date)
            .order("created_at", { ascending: false });
          dailyRows = fb ?? [];
        }
      }
      setDaily((dailyRows ?? []).filter((r: any) => r.tool) as unknown as DailyRow[]);

      // Outils de la semaine (7 derniers jours)
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const { data: weekRows } = await supabase
        .from("discovered_tools")
        .select("*")
        .eq("status", "approved")
        .gte("detected_at", since.toISOString())
        .order("score", { ascending: false })
        .limit(12);
      setWeekly((weekRows ?? []) as unknown as DiscoveredTool[]);
    })();
  }, []);

  if (daily.length === 0 && weekly.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 space-y-10">
      {daily.length > 0 && (
        <div>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyber-cyan">
                <Sparkles className="h-3.5 w-3.5" /> tools du jour · discovery
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">
                {daily.length} nouveau{daily.length > 1 ? "x" : ""} outil{daily.length > 1 ? "s" : ""} sélectionné{daily.length > 1 ? "s" : ""}
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {daily.map((d) => (
              <DailyCard key={d.tool.id} tool={d.tool} reason={d.reason} />
            ))}
          </div>
        </div>
      )}

      {weekly.length > 0 && (
        <div>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                <CalendarDays className="h-3.5 w-3.5" /> tools de la semaine
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">Détectés ces 7 derniers jours</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {weekly.map((t) => (
              <Link
                key={t.id}
                to="/outils/discovered/$id"
                params={{ id: t.id }}
                className="group rounded-xl border border-border bg-gradient-card p-4 transition hover:border-primary/40 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-base font-bold group-hover:text-primary truncate">{t.name}</p>
                  <span className="font-mono text-[10px] text-cyber-emerald shrink-0">{t.score}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                  {t.suggested_category} · {t.language ?? "—"}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{t.stars}</span>
                    <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" />{t.forks}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DailyCard({ tool, reason }: { tool: DiscoveredTool; reason: string | null }) {
  return (
    <Link
      to="/outils/discovered/$id"
      params={{ id: tool.id }}
      className="group block rounded-2xl border border-primary/30 bg-gradient-card p-5 shadow-card-cyber transition hover:border-primary/60 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-lg font-bold group-hover:text-primary truncate">{tool.name}</p>
        <span className="font-mono text-[11px] font-bold text-cyber-emerald shrink-0">{tool.score}</span>
      </div>
      {tool.suggested_category && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {tool.suggested_category} · {tool.language ?? "—"}
        </p>
      )}
      <p className="mt-2 line-clamp-3 text-sm text-foreground/85">{tool.description}</p>
      {reason && <p className="mt-2 text-[11px] text-muted-foreground italic line-clamp-2">{reason}</p>}
      <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{tool.stars}</span>
          <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" />{tool.forks}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-primary group-hover:translate-x-1 transition">
          Voir la fiche <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
