import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIERS, fmt } from "@/lib/data";
import { useWallet } from "@/lib/wallet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/token")({
  head: () => ({
    meta: [
      { title: "$TOKEN — the utility token of Token Train" },
      { name: "description", content: "Hold $TOKEN to take part in training, unlock bigger models, pay fees and vote on governance." },
      { property: "og:title", content: "$TOKEN — Token Train utility token" },
      { property: "og:description", content: "Hold $TOKEN to ride. Unlock bigger models." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TokenPage,
});

const UTIL = [
  ["Access", "Holding $TOKEN is required to take part in training."],
  ["Fees", "Training jobs are paid in $TOKEN, with holder discounts."],
  ["Governance", "Vote on new base models and platform direction."],
  ["Rewards", "Top-tier holders share in platform revenue."],
];

function TokenPage() {
  const { wallet, connect } = useWallet();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm text-muted-foreground">// UTILITY TOKEN</p>
      <h1 className="mt-2 text-6xl font-bold tracking-tight md:text-8xl"><span className="text-primary">$</span>TOKEN</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">The fuel of Token Train. Hold it to board, spend it to train, stake your voice in what comes next.</p>

      <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {UTIL.map(([t, d]) => (
          <div key={t} className="bg-background p-6"><h3 className="font-bold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
        ))}
      </div>

      <h2 className="mt-20 text-3xl font-bold">Holder tiers</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {TIERS.map((t, i) => {
          const active = wallet && wallet.balance >= t.hold && (!TIERS[i + 1] || wallet.balance < TIERS[i + 1].hold);
          return (
            <div key={t.name} className={cn("border p-6", active ? "border-primary bg-primary/5" : "border-border")}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{t.name}</h3>
                {active && <span className="bg-primary px-2 py-0.5 font-mono text-xs text-primary-foreground">YOU</span>}
              </div>
              <div className="mt-2 font-mono text-2xl">{fmt(t.hold)}+ <span className="text-sm text-muted-foreground">$TOKEN</span></div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.perks.map((p) => <li key={p} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{p}</li>)}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Tokenomics</h2>
          <div className="mt-6 space-y-3">
            {[["Community & training rewards", 40], ["Liquidity", 20], ["Treasury", 15], ["Team (vested)", 15], ["Ecosystem grants", 10]].map(([l, v]) => (
              <div key={l as string}>
                <div className="flex justify-between text-sm"><span>{l}</span><span className="font-mono">{v}%</span></div>
                <div className="mt-1 h-2 bg-muted"><div className="h-full bg-primary" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-border bg-card p-6">
          <h2 className="font-mono text-xs text-muted-foreground">GET $TOKEN</h2>
          <dl className="mt-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Total supply</dt><dd>1,000,000,000</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Contract</dt><dd>0x0000…TBA</dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-2">
            <Button disabled>Buy on DEX (coming soon)</Button>
            {!wallet && <Button variant="outline" onClick={connect}>Connect wallet</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
