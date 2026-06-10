import { useEffect, useState } from "react";

const STARS_KEY = "tt_stars_v2";
const STREAK_KEY = "tt_streak_v1";
const LAST_PLAY_KEY = "tt_last_play_v1";
const DIFFICULTY_KEY = "tt_difficulty_v1";

function read(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STARS_KEY) || "0", 10) || 0;
}

const listeners = new Set<(n: number) => void>();

export function addStars(n = 1) {
  if (typeof window === "undefined") return;
  const next = read() + n;
  localStorage.setItem(STARS_KEY, String(next));
  listeners.forEach((fn) => fn(next));
  updateStreak();
}

export function useStars() {
  const [stars, setStars] = useState<number>(0);
  useEffect(() => {
    setStars(read());
    listeners.add(setStars);
    return () => { listeners.delete(setStars); };
  }, []);
  return stars;
}

// Difficulty
export type Difficulty = "easy" | "medium" | "hard";

export function getDifficulty(): Difficulty {
  if (typeof window === "undefined") return "easy";
  return (localStorage.getItem(DIFFICULTY_KEY) as Difficulty) || "easy";
}

export function setDifficulty(d: Difficulty) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DIFFICULTY_KEY, d);
}

export function useDifficulty() {
  const [diff, setDiff] = useState<Difficulty>("easy");
  useEffect(() => { setDiff(getDifficulty()); }, []);
  return [diff, (d: Difficulty) => { setDifficulty(d); setDiff(d); }] as const;
}

// Streak
function updateStreak() {
  if (typeof window === "undefined") return;
  const today = new Date().toDateString();
  const last = localStorage.getItem(LAST_PLAY_KEY);
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const current = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
  const next = last === yesterday ? current + 1 : 1;
  localStorage.setItem(STREAK_KEY, String(next));
  localStorage.setItem(LAST_PLAY_KEY, today);
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toDateString();
  const last = localStorage.getItem(LAST_PLAY_KEY);
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (last !== today && last !== yesterday) return 0;
  return parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
}

export function useStreak() {
  const [streak, setStreak] = useState(0);
  useEffect(() => { setStreak(getStreak()); }, []);
  return streak;
}

// Levels — unlocked by stars
export const LEVELS = [
  { level: 1, name: "Beginner",   starsNeeded: 0,   emoji: "🌱" },
  { level: 2, name: "Explorer",   starsNeeded: 20,  emoji: "🌟" },
  { level: 3, name: "Learner",    starsNeeded: 50,  emoji: "📚" },
  { level: 4, name: "Smart Kid",  starsNeeded: 100, emoji: "🧠" },
  { level: 5, name: "Champion",   starsNeeded: 200, emoji: "🏆" },
];

export function getCurrentLevel(stars: number) {
  return [...LEVELS].reverse().find((l) => stars >= l.starsNeeded) ?? LEVELS[0];
}

export function getNextLevel(stars: number) {
  return LEVELS.find((l) => stars < l.starsNeeded) ?? null;
}

export const STICKERS = [
  { at: 5,   emoji: "🌟", name: "First Star" },
  { at: 15,  emoji: "🦄", name: "Unicorn" },
  { at: 30,  emoji: "🌈", name: "Rainbow" },
  { at: 50,  emoji: "👑", name: "Royal Reader" },
  { at: 75,  emoji: "🚀", name: "Super Star" },
  { at: 100, emoji: "🏆", name: "Champion" },
];

export function earnedStickers(stars: number) {
  return STICKERS.filter((s) => stars >= s.at);
}
