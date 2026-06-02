import { Link } from "@tanstack/react-router";
import { Github, Shield } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="font-display text-lg font-bold">
                IT<span className="text-gradient">-ools</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Revue technologique d'outils <strong className="text-foreground">en ligne de commande</strong> open source pour la
              cybersécurité, l'OSINT, le réseau, le forensic, l'administration système et l'automatisation.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Usage responsable et légal uniquement
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold">Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Accueil</Link></li>
              <li><Link to="/outils" className="hover:text-foreground">Tous les outils</Link></li>
              <li><Link to="/categories" className="hover:text-foreground">Catégories</Link></li>
              <li><Link to="/a-propos" className="hover:text-foreground">À propos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold">Ressources</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li><a href="https://owasp.org" target="_blank" rel="noreferrer" className="hover:text-foreground">OWASP</a></li>
              <li><a href="https://cve.mitre.org" target="_blank" rel="noreferrer" className="hover:text-foreground">CVE Database</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="font-mono">© {new Date().getFullYear()} IT-ools · MIT-spirit</p>
          <p className="font-mono">CLI only · open source · usage légal</p>
        </div>
      </div>
    </footer>
  );
}
