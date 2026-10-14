import { useEffect, useState } from "react";

// Demo-only mock wallet stored in the browser.
const KEY = "tt-wallet";
type W = { address: string; balance: number } | null;

export function useWallet() {
  const [w, setW] = useState<W>(null);
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setW(JSON.parse(raw));
    const on = () => setW(JSON.parse(localStorage.getItem(KEY) || "null"));
    window.addEventListener("tt-wallet", on);
    return () => window.removeEventListener("tt-wallet", on);
  }, []);
  const save = (v: W) => {
    if (v) localStorage.setItem(KEY, JSON.stringify(v));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("tt-wallet"));
  };
  return {
    wallet: w,
    connect: () => save({ address: "0x7a3F…c91E", balance: 12500 }),
    disconnect: () => save(null),
    setBalance: (b: number) => w && save({ ...w, balance: b }),
  };
}
