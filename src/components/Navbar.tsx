import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useState } from "react";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/outils", label: "Outils" },
  { to: "/categories", label: "Catégories" },
  { to: "/a-propos", label: "À propos" },
] as const;

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative transition-transform group-hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl group-hover:bg-primary/50 transition" />
            <LogoMark size={32} className="relative" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">
              IT<span className="text-gradient">-ools</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              v1.0 · command-line review
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-md px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-md bg-primary/10 ring-1 ring-primary/30" />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/outils"
            className="hidden items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Rechercher un outil</span>
            <kbd className="ml-2 rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-md border border-border p-2 text-foreground"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
