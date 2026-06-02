import { useEffect, useState } from "react";

const KEY = "tth:favorites";

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setFavs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const toggle = (slug: string) => {
    persist(favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug]);
  };

  const has = (slug: string) => favs.includes(slug);

  return { favs, toggle, has };
}
