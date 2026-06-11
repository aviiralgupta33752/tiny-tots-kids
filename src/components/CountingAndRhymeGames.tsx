import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import type { Difficulty } from "@/lib/rewards";
 
const OBJECTS = ["🍎","⭐","🐶","🌸","🦋","🍪","🚂","🎈","🐱","🦄","🍕","🌈","🎸","🏀","🐠"];
 
function getCount(difficulty: Difficulty): number {
  if (difficulty === "easy") return Math.floor(Math.random() * 5) + 1;
  if (difficulty === "medium") return Math.floor(Math.random() * 6) + 3;
  return Math.floor(Math.random() * 8) + 3;
}
 
function getOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    const n = Math.floor(Math.random() * 10) + 1;
    if (n !== correct) opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}
 
function getObj(exclude: string): string {
  const available = OBJECTS.filter(o => o !== exclude);
  return available[Math.floor(Math.random() * available.length)];
}
 
export function CountingGame({ difficulty }: { difficulty: Difficulty }) {
  const initCount = getCount(difficulty);
  const [obj, setObj] = useState(OBJECTS[0]);
  const [count, setCount] = useState(initCount);
  const [options, setOptions] = useState(() => getOptions(initCount));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
 
  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === count) {
      addStars(1);
      setScore(s => s + 1);
    }
  }
 
  function next() {
    const newCount = getCount(difficulty);
    const newObj = getObj(obj);
    const newOptions = getOptions(newCount);
    setCount(newCount);
    setObj(newObj);
    setOptions(newOptions);
    setPicked(null);
  }
 
  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      <p className="mb-2 text-sm font-bold text-muted-foreground">Score: {score}</p>
      <p className="mb-4 text-2xl font-bold">How many {obj} do you see?</p>
 
      <div className="mb-6 flex flex-wrap justify-center gap-2 rounded-2xl bg-muted/20 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-4xl">{obj}</span>
        ))}
      </div>
 
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(n => (
          <button
            key={n}
            onClick={() => pick(n)}
            disabled={picked !== null}
            className={`rounded-2xl py-4 text-3xl font-bold transition-all ${
              picked === null ? "bg-sky hover:scale-105 cursor-pointer" :
              n === count ? "bg-mint scale-105" :
              n === picked ? "bg-pink" : "bg-muted opacity-50"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
 
      {picked !== null && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {picked === count ? "🎉 Correct!" : `The answer was ${count}`}
          </p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
 
// ── Rhyme Time ────────────────────────────────────────────────────────────────
const RHYMES = [
  { word: "CAT",  emoji: "🐱", rhymes: ["HAT","BAT","RAT"],   fakes: ["DOG","SUN","FISH"] },
  { word: "DOG",  emoji: "🐶", rhymes: ["LOG","FOG","HOG"],   fakes: ["CAT","BIRD","CAKE"] },
  { word: "SUN",  emoji: "☀️", rhymes: ["FUN","RUN","BUN"],   fakes: ["MOON","STAR","RAIN"] },
  { word: "CAKE", emoji: "🎂", rhymes: ["LAKE","MAKE","RAKE"],fakes: ["PIE","BREAD","MILK"] },
  { word: "FISH", emoji: "🐟", rhymes: ["DISH","WISH"],       fakes: ["BIRD","FROG","BEAR"] },
  { word: "BEAR", emoji: "🐻", rhymes: ["PEAR","HAIR","FAIR"],fakes: ["LION","DUCK","WOLF"] },
  { word: "MOON", emoji: "🌙", rhymes: ["SOON","TUNE","JUNE"],fakes: ["STAR","SUN","CLOUD"] },
  { word: "STAR", emoji: "⭐", rhymes: ["CAR","FAR","JAR"],   fakes: ["MOON","CLOUD","RAIN"] },
  { word: "BALL", emoji: "⚽", rhymes: ["TALL","FALL","WALL"],fakes: ["FISH","CAKE","TREE"] },
  { word: "TREE", emoji: "🌲", rhymes: ["BEE","SEE","FREE"],  fakes: ["BALL","FROG","STAR"] },
];
 
function getNext(exclude: string) {
  const available = RHYMES.filter(r => r.word !== exclude);
  const entry = available[Math.floor(Math.random() * available.length)];
  const correct = entry.rhymes[Math.floor(Math.random() * entry.rhymes.length)];
  const wrong = [...entry.fakes].sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [{ word: correct, correct: true }, ...wrong.map(w => ({ word: w, correct: false }))]
    .sort(() => Math.random() - 0.5);
  return { entry, opts };
}
 
export function RhymeTimeGame({ difficulty }: { difficulty: Difficulty }) {
  const [{ entry, opts }, setRound] = useState(() => getNext(""));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
 
  function pick(word: string, correct: boolean) {
    if (picked) return;
    setPicked(word);
    if (correct) {
      addStars(1);
      setScore(s => s + 1);
      speak(`Yes! ${entry.word.toLowerCase()} and ${word.toLowerCase()} rhyme!`);
    } else {
      speak("Not quite!");
    }
  }
 
  function next() {
    const r = getNext(entry.word);
    setRound(r);
    setPicked(null);
  }
 
  function say() {
    speak(`Which word rhymes with ${entry.word.toLowerCase()}?`);
  }
 
  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      <p className="mb-2 text-sm font-bold text-muted-foreground">Score: {score}</p>
      <p className="mb-2 text-sm font-semibold">Which word rhymes with:</p>
      <button onClick={say} className="mb-6 rounded-2xl bg-pink px-6 py-4 text-3xl font-bold shadow-md">
        {entry.emoji} {entry.word} 🔊
      </button>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {opts.map(opt => (
          <button
            key={opt.word}
            onClick={() => pick(opt.word, opt.correct)}
            disabled={!!picked}
            className={`rounded-2xl py-5 text-2xl font-bold transition-all ${
              picked === null ? "bg-butter hover:scale-105 cursor-pointer" :
              opt.correct ? "bg-mint scale-105" :
              picked === opt.word ? "bg-pink" : "bg-muted opacity-50"
            }`}
          >
            {opt.word}
          </button>
        ))}
      </div>
      {picked && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {opts.find(o => o.word === picked)?.correct ? "🎉 Great!" : "Try again next time!"}
          </p>
          <button onClick={next} className="rounded-2xl bg-sky px-8 py-3 text-lg font-bold">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
 
