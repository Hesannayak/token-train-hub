import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MODELS, fmt } from "@/lib/data";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "Base models — Token Train" },
      { name: "description", content: "Choose the base AI model to train: Llama, Mistral, Qwen, Gemma, DeepSeek and more." },
      { property: "og:title", content: "Base models — Token Train" },
      { property: "og:description", content: "Pick the engine for your custom AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Models,
});

function Models() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm text-muted-foreground">// CHOOSE YOUR ENGINE</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">Base models</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Every model needs a minimum $TOKEN balance to board. Training fees are paid in $TOKEN.</p>
      <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {MODELS.map((m) => (
          <div key={m.id} className="flex flex-col bg-background p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-xs text-muted-foreground">{m.family}</div>
                <h2 className="text-2xl font-bold">{m.name} <span className="text-primary">{m.params}</span></h2>
              </div>
              <span className="border border-accent px-2 py-0.5 font-mono text-xs text-accent">{m.tag}</span>
            </div>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{m.desc}</p>
            <dl className="mt-6 grid grid-cols-3 gap-2 font-mono text-xs">
              <div><dt className="text-muted-foreground">Min hold</dt><dd>{fmt(m.minHold)}</dd></div>
              <div><dt className="text-muted-foreground">Fee</dt><dd>{fmt(m.cost)}</dd></div>
              <div><dt className="text-muted-foreground">Time</dt><dd>{m.speed}</dd></div>
            </dl>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/train" search={{ model: m.id }}>Train with {m.name}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
