import { useEffect, useState } from "react";

const KEY = "tt_stars_v1";

function read(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) || "0", 10) || 0;
}

const listeners = new Set<(n: number) => void>();

export function addStars(n = 1) {
  if (typeof window === "undefined") return;
  const next = read() + n;
  localStorage.setItem(KEY, String(next));
  listeners.forEach((fn) => fn(next));
}

export function useStars() {
  const [stars, setStars] = useState<number>(() => read());
  useEffect(() => {
    listeners.add(setStars);
    return () => {
      listeners.delete(setStars);
    };
  }, []);
  return stars;
}

export const STICKERS = [
  { at: 5, emoji: "🌟", name: "First Star" },
  { at: 15, emoji: "🦄", name: "Unicorn" },
  { at: 30, emoji: "🌈", name: "Rainbow" },
  { at: 50, emoji: "👑", name: "Royal Reader" },
  { at: 75, emoji: "🚀", name: "Super Star" },
  { at: 100, emoji: "🏆", name: "Champion" },
];

export function earnedStickers(stars: number) {
  return STICKERS.filter((s) => stars >= s.at);
}
