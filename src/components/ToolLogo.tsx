import { useState } from "react";
import { TerminalSquare } from "lucide-react";
import type { Tool } from "@/data/tools";

function ghOwner(url: string): string | null {
  try {
    const m = url.match(/github\.com\/([^/]+)/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function ToolLogo({ tool, size = 40 }: { tool: Tool; size?: number }) {
  const owner = ghOwner(tool.github);
  const [errored, setErrored] = useState(false);

  if (!owner || errored) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-md border border-border bg-secondary/40 text-primary"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <TerminalSquare className="h-1/2 w-1/2" />
      </div>
    );
  }

  return (
    <img
      src={`https://github.com/${owner}.png?size=${size * 2}`}
      alt={`${tool.name} logo`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      className="shrink-0 rounded-md border border-border bg-secondary/40 object-cover"
      style={{ width: size, height: size }}
    />
  );
}
