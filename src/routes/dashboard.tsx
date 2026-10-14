import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/wallet";
import { TIERS, fmt } from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Token Train" },
      { name: "description", content: "Your trained models, training jobs and $TOKEN holdings." },
      { property: "og:title", content: "Dashboard — Token Train" },
      { property: "og:description", content: "Track your models and $TOKEN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const JOBS = [
  { name: "BrewBot", model: "Mistral 7B", status: "Live", date: "Oct 12" },
  { name: "AuditHawk", model: "DeepSeek Coder 33B", status: "Live", date: "Oct 09" },
  { name: "Captain Tales", model: "Llama 3 8B", status: "Training", date: "Oct 14" },
];

function Dashboard() {
  const { wallet, connect } = useWallet();
  if (!wallet)
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <h1 className="text-3xl font-bold">Connect to see your station</h1>
        <p className="mt-2 text-muted-foreground">Your models and $TOKEN balance show up here.</p>
        <Button className="mt-6" onClick={connect}>Connect wallet</Button>
      </div>
    );
  const tier = [...TIERS].reverse().find((t) => wallet.balance >= t.hold);
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm text-muted-foreground">// {wallet.address}</p>
      <h1 className="mt-2 text-4xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-px bg-border sm:grid-cols-3">
        {[["$TOKEN balance", fmt(wallet.balance)], ["Tier", tier?.name ?? "None"], ["Models trained", String(JOBS.length)]].map(([k, v]) => (
          <div key={k} className="bg-background p-6"><div className="font-mono text-xs text-muted-foreground">{k}</div><div className="mt-2 text-3xl font-bold">{v}</div></div>
        ))}
      </div>
      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your models</h2>
        <Button asChild size="sm"><Link to="/train">New model</Link></Button>
      </div>
      <div className="mt-4 border border-border">
        {JOBS.map((j) => (
          <div key={j.name} className="flex items-center justify-between border-b border-border p-4 last:border-0">
            <div><div className="font-bold">{j.name}</div><div className="font-mono text-xs text-muted-foreground">{j.model} · {j.date}</div></div>
            <span className={j.status === "Live" ? "font-mono text-xs text-primary" : "font-mono text-xs text-accent"}>● {j.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
