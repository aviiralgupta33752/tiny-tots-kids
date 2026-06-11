import { useState, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import type { Difficulty } from "@/lib/rewards";
 
// ── Counting Game ─────────────────────────────────────────────────────────────
const OBJECTS = ["🍎","⭐","🐶","🌸","🦋","🍪","🚂","🎈","🐱","🦄","🍕","🌈","🎸","🏀","🐠","🌺","🍦","🚀","🦁","🐬"];
 
function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function getCount(difficulty: Difficulty): number {
  if (difficulty === "easy") return getRandom(1, 5);
  if (difficulty === "medium") return getRandom(3, 10);
  return getRandom(1, 15);
}
 
function getOptions(correct: number): number[] {
  const all = Array.from({ length: 15 }, (_, i) => i + 1).filter(n => n !== correct);
  const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 3);
  return [correct, ...shuffled].sort(() => Math.random() - 0.5);
}
 
export function CountingGame({ difficulty }: { difficulty: Difficulty }) {
  const objIndex = useRef(0);
  const shuffledObjs = useRef([...OBJECTS].sort(() => Math.random() - 0.5));
 
  const [count, setCount] = useState(() => getCount(difficulty));
  const [obj, setObj] = useState(() => shuffledObjs.current[0]);
  const [options, setOptions] = useState(() => getOptions(getCount(difficulty)));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
 
  // fix options to match count on mount
  useRef((() => {
    const c = getCount(difficulty);
    setCount(c);
    setOptions(getOptions(c));
  })());
 
  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    const ok = n === count;
    setCorrect(ok);
    if (ok) {
      addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      setScore(s => s + 1);
      speak(`Yes! ${count}!`);
    } else {
      speak(`The answer is ${count}`);
    }
  }
 
  function next() {
    objIndex.current = (objIndex.current + 1) % shuffledObjs.current.length;
    if (objIndex.current === 0) {
      shuffledObjs.current = [...OBJECTS].sort(() => Math.random() - 0.5);
    }
    const newCount = getCount(difficulty);
    setObj(shuffledObjs.current[objIndex.current]);
    setCount(newCount);
    setOptions(getOptions(newCount));
    setPicked(null);
    setCorrect(null);
    
  }
 
  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="mb-3 text-right text-sm font-bold">⭐ Score: {score}</div>
 
      <p className="mb-3 text-xl font-bold">How many do you see?</p>
 
      <div className="mb-6 flex flex-wrap justify-center gap-1 rounded-2xl bg-muted/30 p-4" style={{ minHeight: 80 }}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} style={{ fontSize: 36 }}>{obj}</span>
        ))}
      </div>
 
      <div className="grid grid-cols-4 gap-3 mb-4">
        {options.map((n) => (
          <button
            key={n}
            onClick={() => pick(n)}
            disabled={picked !== null}
            style={{
              fontSize: 28,
              fontWeight: "bold",
              padding: "1rem",
              borderRadius: 16,
              border: "none",
              cursor: picked !== null ? "default" : "pointer",
              background:
                picked !== null
                  ? n === count ? "#b5ead7"
                  : n === picked ? "#ffb3c1"
                  : "#e5e5e5"
                  : "#a0c4ff",
              opacity: picked !== null && n !== count && n !== picked ? 0.5 : 1,
              transform: picked !== null && n === count ? "scale(1.1)" : "scale(1)",
              transition: "all 0.2s",
            }}
          >
            {n}
          </button>
        ))}
      </div>
 
      {correct !== null && (
        <div>
          <p style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
            {correct ? "🎉 Correct!" : `The answer was ${count}`}
          </p>
          <button
            onClick={next}
            style={{
              background: "#ff8fab", color: "white", border: "none",
              borderRadius: 16, padding: "0.75rem 2rem",
              fontSize: 18, fontWeight: "bold", cursor: "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
 
// ── Rhyme Time ────────────────────────────────────────────────────────────────
const RHYMES: { word: string; emoji: string; rhymes: string[]; fakes: string[] }[] = [
  { word: "CAT",  emoji: "🐱", rhymes: ["HAT","BAT","RAT","MAT"],    fakes: ["DOG","SUN","FISH"] },
  { word: "DOG",  emoji: "🐶", rhymes: ["LOG","FOG","HOG","JOG"],    fakes: ["CAT","BIRD","CAKE"] },
  { word: "SUN",  emoji: "☀️", rhymes: ["FUN","RUN","BUN"],           fakes: ["MOON","STAR","RAIN"] },
  { word: "CAKE", emoji: "🎂", rhymes: ["LAKE","MAKE","RAKE"],        fakes: ["PIE","BREAD","MILK"] },
  { word: "FISH", emoji: "🐟", rhymes: ["DISH","WISH","SWISH"],       fakes: ["BIRD","FROG","BEAR"] },
  { word: "BEAR", emoji: "🐻", rhymes: ["PEAR","HAIR","FAIR","CARE"], fakes: ["LION","DUCK","WOLF"] },
  { word: "MOON", emoji: "🌙", rhymes: ["SOON","TUNE","JUNE"],        fakes: ["STAR","SUN","CLOUD"] },
  { word: "FROG", emoji: "🐸", rhymes: ["LOG","BOG","HOG"],           fakes: ["DUCK","FISH","BIRD"] },
  { word: "STAR", emoji: "⭐", rhymes: ["CAR","FAR","JAR","BAR"],     fakes: ["MOON","CLOUD","RAIN"] },
  { word: "BALL", emoji: "⚽", rhymes: ["TALL","FALL","HALL","WALL"], fakes: ["FISH","CAKE","TREE"] },
  { word: "TREE", emoji: "🌲", rhymes: ["BEE","SEE","FREE","TEA"],    fakes: ["BALL","FROG","STAR"] },
  { word: "KING", emoji: "👑", rhymes: ["RING","SING","WING","DING"], fakes: ["TREE","BEAR","FISH"] },
];
 
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }
 
export function RhymeTimeGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = difficulty === "easy" ? RHYMES.slice(0, 6) : RHYMES;
  const usedWords = useRef(new Set<string>());
 
  function getNext() {
    if (usedWords.current.size >= pool.length) usedWords.current.clear();
    const available = pool.filter(r => !usedWords.current.has(r.word));
    const entry = available[Math.floor(Math.random() * available.length)];
    usedWords.current.add(entry.word);
    const correct = shuffle(entry.rhymes).slice(0, 2).map(w => ({ word: w, correct: true }));
    const wrong   = shuffle(entry.fakes).slice(0, 2).map(w => ({ word: w, correct: false }));
    return { entry, options: shuffle([...correct, ...wrong]) };
  }
 
  const [{ entry, options }, setRound] = useState(() => getNext());
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
 
  function sayWord() {
    speak(entry.word.toLowerCase());
    setTimeout(() => speak(`Which word rhymes with ${entry.word.toLowerCase()}?`), 900);
  }
 
  function pick(word: string, isCorrect: boolean) {
    if (picked) return;
    setPicked(word);
    if (isCorrect) {
      addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      setScore(s => s + 1);
      speak(`Yes! ${entry.word.toLowerCase()} and ${word.toLowerCase()} rhyme!`);
    } else {
      speak("Not quite! Try again next time.");
    }
  }
 
  function next() {
    const r = getNext();
    setRound(r);
    setPicked(null);
    setTimeout(() => {
      speak(r.entry.word.toLowerCase());
      setTimeout(() => speak(`Which word rhymes with ${r.entry.word.toLowerCase()}?`), 900);
    }, 300);
  }
 
  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="mb-3 text-right text-sm font-bold">⭐ Score: {score}</div>
      <p className="mb-2 text-sm font-semibold text-muted-foreground">Which word rhymes with:</p>
      <button onClick={sayWord}
        className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-pink px-6 py-4 font-display text-3xl font-bold shadow-md hover:scale-105 transition">
        {entry.emoji} {entry.word} 🔊
      </button>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button key={opt.word} onClick={() => pick(opt.word, opt.correct)} disabled={!!picked}
            className={`card-soft rounded-2xl py-5 font-display text-2xl font-bold transition-all ${
              picked
                ? opt.correct ? "bg-mint scale-105 shadow-md"
                : picked === opt.word ? "bg-destructive/30"
                : "opacity-50"
                : "bg-butter hover:scale-105 active:scale-95"
            }`}>
            {opt.word}
          </button>
        ))}
      </div>
      {picked && (
        <button onClick={next} className="mt-5 card-soft rounded-xl bg-sky px-6 py-3 font-bold">Next →</button>
      )}
    </div>
  );
}
 
