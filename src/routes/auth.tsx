import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — IT-ools" },
      { name: "description", content: "Espace admin IT-ools." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/discovery", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin/discovery" },
        });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate({ to: "/admin/discovery", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-cyber-cyan">
            access · admin
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Espace réservé à l'administration de la veille IT-ools.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-gradient-card p-6">
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-background/70 px-3 text-sm focus:border-primary/60 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Mot de passe</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-background/70 px-3 text-sm focus:border-primary/60 focus:outline-none"
            />
          </label>
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-glow-blue hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </form>

        <Link to="/" className="text-center text-xs text-muted-foreground hover:text-foreground">
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
