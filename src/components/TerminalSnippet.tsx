import { useEffect, useState } from "react";

const lines = [
  "$ techtools --scan --cli-only",
  "  loading categories ......... [ok]",
  "  indexing CLI tools ......... [ok]",
  "  verifying github sources ... [ok]",
  "  ready. welcome to TechTools Hub_",
];

export function TerminalSnippet() {
  const [shown, setShown] = useState<string[]>([""]);

  useEffect(() => {
    let i = 0;
    let j = 0;
    const acc: string[] = [""];
    const id = setInterval(() => {
      if (i >= lines.length) {
        clearInterval(id);
        return;
      }
      const cur = lines[i];
      if (j <= cur.length) {
        acc[i] = cur.slice(0, j);
        setShown([...acc]);
        j++;
      } else {
        i++;
        j = 0;
        acc.push("");
      }
    }, 24);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass overflow-hidden rounded-xl shadow-card-cyber">
      <div className="flex items-center gap-1.5 border-b border-border bg-background/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-cyan/70" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          techtools@hub:~
        </span>
      </div>
      <pre className="relative min-h-[180px] p-5 font-mono text-[13px] leading-relaxed text-cyber-cyan">
        {shown.map((line, idx) => (
          <div key={idx}>
            <span>{line}</span>
            {idx === shown.length - 1 && (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 -translate-y-px bg-cyber-cyan align-middle animate-blink" />
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
