import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MODELS, fmt } from "@/lib/data";
import { useWallet } from "@/lib/wallet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/train")({
  validateSearch: (s: Record<string, unknown>): { model?: string } => (typeof s["model"] === "string" ? { model: s["model"] } : {}),
  head: () => ({
    meta: [
      { title: "Train your model — Token Train" },
      { name: "description", content: "Write a prompt, choose a base model and start training your custom AI." },
      { property: "og:title", content: "Train your model — Token Train" },
      { property: "og:description", content: "One prompt. One model. Your AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Train,
});

const EXAMPLES = [
  "A friendly support agent for my coffee shop that knows our menu and opening hours.",
  "A Solidity auditor that flags reentrancy and overflow bugs with explanations.",
  "A pirate-voiced storyteller for kids' bedtime stories, max 300 words.",
];

function Train() {
  const { model: initial } = Route.useSearch();
  const { wallet, connect, setBalance } = useWallet();
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(initial ?? MODELS[0]!.id);
  const [progress, setProgress] = useState<number | null>(null);
  const model = MODELS.find((m) => m.id === modelId)!;
  const eligible = !!wallet && wallet.balance >= model.minHold;
  const affordable = !!wallet && wallet.balance >= model.cost;

  useEffect(() => {
    if (progress === null || progress >= 100) return;
    const t = setTimeout(() => setProgress((p) => Math.min(100, (p ?? 0) + Math.random() * 9 + 3)), 350);
    return () => clearTimeout(t);
  }, [progress]);

  const start = () => {
    if (!wallet) return;
    setBalance(wallet.balance - model.cost);
    setProgress(0);
  };

  if (progress !== null) {
    const done = progress >= 100;
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <p className="font-mono text-sm text-muted-foreground">// {done ? "ARRIVED" : "IN TRANSIT"}</p>
        <h1 className="mt-2 text-4xl font-bold">{done ? `${name || "Your model"} is ready` : "Training your model…"}</h1>
        <p className="mt-2 text-muted-foreground">{model.name} {model.params} · {fmt(model.cost)} $TOKEN paid</p>
        <Progress value={progress} className="mt-10 h-2" />
        <div className="mt-2 text-right font-mono text-sm">{Math.floor(progress)}%</div>
        <ul className="mt-8 space-y-2 font-mono text-sm">
          {["Expanding prompt into synthetic dataset", "Tokenizing samples", "Fine-tuning adapters", "Evaluating & deploying"].map((s, i) => (
            <li key={s} className={cn("flex items-center gap-2", progress > (i + 1) * 24 ? "text-foreground" : "text-muted-foreground")}>
              <Check className={cn("h-4 w-4", progress > (i + 1) * 24 ? "text-primary" : "opacity-20")} /> {s}
            </li>
          ))}
        </ul>
        {done && (
          <div className="mt-10 flex gap-3">
            <Button asChild><Link to="/dashboard">Go to dashboard</Link></Button>
            <Button variant="outline" onClick={() => { setProgress(null); setPrompt(""); setName(""); }}>Train another</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1fr_340px]">
      <div>
        <p className="font-mono text-sm text-muted-foreground">// NEW TRAINING JOB</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Describe your AI</h1>

        <label className="mt-10 block font-mono text-xs text-muted-foreground">MODEL NAME</label>
        <Input className="mt-2" placeholder="e.g. BrewBot" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="mt-6 block font-mono text-xs text-muted-foreground">TRAINING PROMPT</label>
        <Textarea className="mt-2 min-h-44 text-base" placeholder="Describe what your model should do, how it should sound, and what it should know…" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => setPrompt(e)} className="border border-border px-2 py-1 text-left text-xs text-muted-foreground hover:border-primary hover:text-foreground">
              {e.slice(0, 48)}…
            </button>
          ))}
        </div>

        <label className="mt-10 block font-mono text-xs text-muted-foreground">BASE MODEL</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {MODELS.map((m) => {
            const locked = !wallet || wallet.balance < m.minHold;
            return (
              <button key={m.id} onClick={() => setModelId(m.id)} className={cn("flex items-center justify-between border p-4 text-left", m.id === modelId ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground")}>
                <div>
                  <div className="font-bold">{m.name} {m.params}</div>
                  <div className="font-mono text-xs text-muted-foreground">hold {fmt(m.minHold)} · fee {fmt(m.cost)}</div>
                </div>
                {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-mono text-xs text-muted-foreground">TICKET</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row k="Model" v={`${model.name} ${model.params}`} />
          <Row k="Est. time" v={model.speed} />
          <Row k="Required hold" v={`${fmt(model.minHold)} $TOKEN`} />
          <Row k="Training fee" v={`${fmt(model.cost)} $TOKEN`} />
          <Row k="Your balance" v={wallet ? `${fmt(wallet.balance)} $TOKEN` : "—"} />
        </dl>
        <div className="my-6 border-t border-dashed border-border" />
        {!wallet ? (
          <Button className="w-full" onClick={connect}>Connect wallet</Button>
        ) : !eligible ? (
          <>
            <p className="mb-3 text-sm text-destructive">Hold at least {fmt(model.minHold)} $TOKEN to board this model.</p>
            <Button asChild className="w-full" variant="outline"><Link to="/token">Get more $TOKEN</Link></Button>
          </>
        ) : (
          <Button className="w-full" disabled={!prompt.trim() || !affordable} onClick={start}>All aboard — start training</Button>
        )}
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">Demo mode: wallet and training are simulated.</p>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono">{v}</dd></div>;
}
