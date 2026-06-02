import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryTile } from "@/components/CategoryTile";
import { categories, toolsByCategory } from "@/data/tools";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Catégories — TechTools Hub" },
      { name: "description", content: "Toutes les catégories d'outils open source : cybersécurité, OSINT, réseau, forensic et plus." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="border-b border-border bg-background/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent"># catégories</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Toutes les <span className="text-gradient">catégories</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {categories.length} domaines couverts — uniquement des outils en ligne de commande.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} count={toolsByCategory(c.slug).length} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
