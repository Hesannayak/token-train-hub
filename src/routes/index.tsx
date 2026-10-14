import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Coins, Cpu, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Token Train — Train a custom AI model with just a prompt" },
      { name: "description", content: "Describe the AI you want, pick a base model, and train it. Hold $TOKEN to ride." },
      { property: "og:title", content: "Token Train — Train AI with a prompt" },
      { property: "og:description", content: "Describe it. Pick a model. Hold $TOKEN. Train." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: MessageSquareText, t: "Write a prompt", d: "Describe the model you want in plain words — tone, skills, domain." },
  { icon: Cpu, t: "Choose a model", d: "Pick a base like Llama, Mistral, Qwen or Gemma to start from." },
  { icon: Coins, t: "Hold $TOKEN", d: "Holding $TOKEN is your ticket. More you hold, bigger models you unlock." },
];

function Index() {
  return (
    <>
      <section className="grid-bg relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="mb-6 inline-block border border-primary px-3 py-1 font-mono text-xs text-primary">
            NEXT STOP → YOUR OWN AI
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl">
            Train a custom AI<br />
            <span className="text-primary">with just a prompt.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            No datasets. No GPUs. No code. Tell Token Train what you need, pick a base model, and we lay the tracks.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/train">Start training <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/token">Get $TOKEN</Link></Button>
          </div>
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-6 font-mono">
            {[["12,480", "models trained"], ["6", "base models"], ["3.2M", "$TOKEN staked"]].map(([v, l]) => (
              <div key={l}><div className="text-2xl text-foreground md:text-3xl">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-10 font-mono text-sm text-muted-foreground">// HOW IT WORKS</h2>
        <div className="grid gap-px bg-border md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.t} className="bg-background p-8">
              <div className="mb-6 flex items-center justify-between">
                <s.icon className="h-6 w-6 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your ticket to ride is $TOKEN.</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/token">See holder tiers <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </>
  );
}
