import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
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

const levels: Level[] = ["Débutant", "Intermédiaire", "Avancé"];

function Home() {
  const [filterQ, setFilterQ] = useState("");
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [lvl, setLvl] = useState<Level | "all">("all");

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

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero minimal */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            IT<span className="text-primary">-ools</span>
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            {tools.length} outils CLI open source, sélectionnés et documentés.
          </p>
        </div>
      </section>

      {/* Outils */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Barre de recherche */}
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            placeholder="Rechercher un outil, un tag..."
            className="h-11 w-full rounded-lg border border-border bg-secondary/30 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
          {filterQ && (
            <button
              onClick={() => setFilterQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterBtn active={cat === "all"} onClick={() => setCat("all")}>Toutes</FilterBtn>
          {categories.map((c) => (
            <FilterBtn key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
              {c.name}
            </FilterBtn>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterBtn active={lvl === "all"} onClick={() => setLvl("all")}>Tous niveaux</FilterBtn>
          {levels.map((l) => (
            <FilterBtn key={l} active={lvl === l} onClick={() => setLvl(l)}>
              {l}
            </FilterBtn>
          ))}
        </div>

        {/* Compteur */}
        <p className="mt-6 text-xs text-muted-foreground">
          {filtered.length} outil{filtered.length > 1 ? "s" : ""}
        </p>

        {/* Grille */}
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">Aucun outil trouvé</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-primary/15 text-primary border border-primary/40"
          : "border border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
