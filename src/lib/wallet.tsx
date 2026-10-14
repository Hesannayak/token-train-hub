import { useEffect, useState } from "react";

// Real Solana wallet (Phantom / any wallet injecting window.solana).
// $TOKEN balance is read on-chain from the SPL mint below.
// Until $TOKEN launches (no mint yet), a clearly-labelled preview balance is used.
export const TOKEN_MINT: string = import.meta.env.VITE_TOKEN_MINT ?? "";
const RPC: string = import.meta.env.VITE_SOLANA_RPC ?? "https://api.mainnet-beta.solana.com";
const PREVIEW_BALANCE = 12500;
export const PRE_LAUNCH = !TOKEN_MINT;

type Provider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  on?(ev: string, cb: (...a: unknown[]) => void): void;
};
type W = { address: string; full: string; balance: number } | null;
type State = { wallet: W; loading: boolean; error: string | null };

let state: State = { wallet: null, loading: false, error: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };

const getProvider = (): Provider | undefined =>
  typeof window === "undefined" ? undefined : ((window as unknown as { phantom?: { solana?: Provider }; solana?: Provider }).phantom?.solana ?? (window as unknown as { solana?: Provider }).solana);

const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

export async function fetchTokenBalance(owner: string): Promise<number> {
  if (PRE_LAUNCH) return PREVIEW_BALANCE;
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTokenAccountsByOwner", params: [owner, { mint: TOKEN_MINT }, { encoding: "jsonParsed" }] }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? "RPC error");
  return (json.result?.value ?? []).reduce(
    (s: number, a: { account: { data: { parsed: { info: { tokenAmount: { uiAmount: number | null } } } } } }) => s + (a.account.data.parsed.info.tokenAmount.uiAmount ?? 0),
    0,
  );
}

async function load(full: string) {
  set({ loading: true, error: null });
  try {
    const balance = await fetchTokenBalance(full);
    set({ wallet: { address: short(full), full, balance }, loading: false });
    return balance;
  } catch (e) {
    set({ wallet: { address: short(full), full, balance: 0 }, loading: false, error: "Couldn't read your $TOKEN balance. Try again." });
    return 0;
  }
}

async function connect() {
  const p = getProvider();
  if (!p) { window.open("https://phantom.app/", "_blank"); set({ error: "No Solana wallet found. Install Phantom, then reload." }); return; }
  try { const r = await p.connect(); await load(r.publicKey.toString()); }
  catch { set({ error: "Wallet connection was cancelled." }); }
}
async function disconnect() { try { await getProvider()?.disconnect(); } catch { /* ignore */ } set({ wallet: null, error: null }); }
async function refresh() { return state.wallet ? load(state.wallet.full) : 0; }

let inited = false;
function init() {
  if (inited) return; inited = true;
  const p = getProvider(); if (!p) return;
  p.connect({ onlyIfTrusted: true }).then((r) => load(r.publicKey.toString())).catch(() => {});
  p.on?.("accountChanged", (pk) => (pk ? load(String(pk)) : set({ wallet: null })));
  p.on?.("disconnect", () => set({ wallet: null }));
}

export function useWallet() {
  const [, force] = useState(0);
  useEffect(() => { const f = () => force((n) => n + 1); subs.add(f); init(); return () => { subs.delete(f); }; }, []);
  return {
    ...state,
    connect, disconnect, refresh,
    // Only adjusts the shown preview balance before launch; real balances come from chain.
    setBalance: (b: number) => { if (PRE_LAUNCH && state.wallet) set({ wallet: { ...state.wallet, balance: b } }); },
  };
}
