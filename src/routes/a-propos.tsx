import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Github } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ETHICAL_NOTICE } from "@/data/tools";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — TechTools Hub" },
      { name: "description", content: "La mission de TechTools Hub : centraliser des outils open source fiables et utiles." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-primary"># à propos</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          La <span className="text-gradient">mission</span>.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          TechTools Hub est une revue technologique indépendante qui recense les meilleurs
          outils open source pour la cybersécurité, l'OSINT, le réseau, le forensic,
          l'administration système et la veille technologique.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          L'objectif : offrir une sélection claire, sérieuse et utile, plutôt qu'une liste
          interminable. Chaque outil est documenté avec son utilité concrète, ses cas
          d'usage, ses limites et le niveau requis.
        </p>

        <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-display text-lg font-semibold">Éthique avant tout</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ETHICAL_NOTICE}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/outils" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue hover:bg-primary/90">
            Explorer les outils
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-5 py-3 text-sm font-semibold hover:border-primary/50">
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
