import { Link } from "@tanstack/react-router";
import { TrainFront, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/wallet";
import { fmt } from "@/lib/data";

const NAV = [
  { to: "/models", label: "Models" },
  { to: "/train", label: "Train" },
  { to: "/token", label: "$TOKEN" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  const { wallet, connect, disconnect } = useWallet();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center bg-primary text-primary-foreground">
            <TrainFront className="h-4 w-4" />
          </span>
          TOKEN TRAIN
        </Link>
        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 font-mono text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "px-3 py-2 font-mono text-sm text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          {wallet ? (
            <Button variant="outline" size="sm" onClick={disconnect} className="font-mono">
              {fmt(wallet.balance)} $TOKEN · {wallet.address}
            </Button>
          ) : (
            <Button size="sm" onClick={connect}>
              <Wallet className="h-4 w-4" /> Connect wallet
            </Button>
          )}
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-border px-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} className="px-3 py-2 font-mono text-xs text-muted-foreground" activeProps={{ className: "px-3 py-2 font-mono text-xs text-primary" }}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 font-mono text-xs text-muted-foreground md:flex-row md:justify-between">
        <span>© 2026 Token Train — all aboard.</span>
        <span>$TOKEN is the utility token powering Token Train.</span>
      </div>
    </footer>
  );
}
