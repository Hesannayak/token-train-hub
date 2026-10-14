export type Model = {
  id: string;
  name: string;
  family: string;
  params: string;
  minHold: number;
  cost: number;
  speed: string;
  tag: string;
  desc: string;
};

export const MODELS: Model[] = [
  { id: "llama-3-8b", name: "Llama 3", family: "Meta", params: "8B", minHold: 1000, cost: 250, speed: "~12 min", tag: "Fast", desc: "Lean general-purpose base. Great for chat bots and quick specialists." },
  { id: "mistral-7b", name: "Mistral", family: "Mistral AI", params: "7B", minHold: 1000, cost: 220, speed: "~10 min", tag: "Efficient", desc: "Punches above its size. Ideal for instruction tuning on a budget." },
  { id: "qwen-14b", name: "Qwen 2.5", family: "Alibaba", params: "14B", minHold: 5000, cost: 600, speed: "~25 min", tag: "Multilingual", desc: "Strong reasoning and multilingual coverage for global audiences." },
  { id: "gemma-27b", name: "Gemma 2", family: "Google", params: "27B", minHold: 10000, cost: 1200, speed: "~40 min", tag: "Balanced", desc: "High quality outputs with balanced compute for production agents." },
  { id: "llama-3-70b", name: "Llama 3", family: "Meta", params: "70B", minHold: 50000, cost: 4000, speed: "~2 hr", tag: "Pro", desc: "Frontier-class open model for demanding domain experts." },
  { id: "deepseek-coder", name: "DeepSeek Coder", family: "DeepSeek", params: "33B", minHold: 25000, cost: 2200, speed: "~1 hr", tag: "Code", desc: "Purpose-built for code. Train your own repo-aware copilot." },
];

export const TIERS = [
  { name: "Passenger", hold: 1000, perks: ["Train 7–8B models", "1 concurrent job", "Community support"] },
  { name: "Conductor", hold: 10000, perks: ["Train up to 27B", "3 concurrent jobs", "10% fee discount", "Priority queue"] },
  { name: "Engineer", hold: 50000, perks: ["All models incl. 70B", "Unlimited jobs", "25% fee discount", "Governance voting", "Revenue share"] },
];

export const fmt = (n: number) => n.toLocaleString("en-US");
