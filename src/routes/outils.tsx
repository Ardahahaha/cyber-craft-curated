import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { categories, tools, type Level, type CategorySlug } from "@/data/tools";

const levels: Level[] = ["Débutant", "Intermédiaire", "Avancé"];

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  lvl: z.string().optional(),
});

export const Route = createFileRoute("/outils")({
  head: () => ({
    meta: [
      { title: "Tous les outils — IT-ools" },
      { name: "description", content: "Recherche et filtrage parmi tous les outils open source recensés." },
    ],
  }),
  validateSearch: searchSchema,
  component: ToolsPage,
});

function ToolsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/outils" });

  const [q, setQ] = useState(search.q ?? "");
  const cat = (search.cat ?? "all") as CategorySlug | "all";
  const lvl = (search.lvl ?? "all") as Level | "all";

  const setParam = (k: "cat" | "lvl" | "q", v: string) => {
    navigate({
      search: (prev: Record<string, string | undefined>) => ({
        ...prev,
        [k]: v === "all" || v === "" ? undefined : v,
      }),
      replace: true,
    });
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
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
  }, [q, cat, lvl]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="border-b border-border bg-background/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary"># bibliothèque</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Tous les <span className="text-gradient">outils</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {tools.length} outils open source recensés. Filtrez par catégorie, niveau
            ou recherchez par nom ou tag technique.
          </p>

          <div className="mt-8 space-y-4">
            <div className="relative max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setParam("q", e.target.value);
                }}
                placeholder="Rechercher un outil, un tag, une catégorie..."
                className="h-12 w-full rounded-md border border-border bg-secondary/40 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {q && (
                <button
                  onClick={() => { setQ(""); setParam("q", ""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Catégorie:</span>
              <Pill active={cat === "all"} onClick={() => setParam("cat", "all")}>Toutes</Pill>
              {categories.map((c) => (
                <Pill key={c.slug} active={cat === c.slug} onClick={() => setParam("cat", c.slug)}>
                  {c.name}
                </Pill>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Niveau:</span>
              <Pill active={lvl === "all"} onClick={() => setParam("lvl", "all")}>Tous</Pill>
              {levels.map((l) => (
                <Pill key={l} active={lvl === l} onClick={() => setParam("lvl", l)}>
                  {l}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="mb-6 font-mono text-xs text-muted-foreground">
          → {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-12 text-center">
            <p className="font-display text-lg font-semibold">Aucun outil trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">Essayez d'autres mots-clés ou filtres.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
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
