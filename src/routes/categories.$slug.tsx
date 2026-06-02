import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { categories, toolsByCategory, getCategory } from "@/data/tools";

export const Route = createFileRoute("/categories/$slug")({
  beforeLoad: ({ params }) => {
    if (!categories.find((c) => c.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    return {
      meta: [
        { title: `${cat?.name ?? "Catégorie"} — TechTools Hub` },
        { name: "description", content: cat?.description ?? "" },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p>Catégorie introuvable. <Link to="/categories" className="text-primary underline">Retour</Link></p>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = getCategory(slug as never);
  const list = toolsByCategory(cat.slug);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="border-b border-border bg-background/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Link to="/categories" className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> toutes les catégories
          </Link>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-primary">
            # {cat.slug}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {cat.name}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{cat.description}</p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">→ {list.length} outils</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>
      <Footer />
    </div>
  );
}
