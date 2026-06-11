import { useState, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { Mascot, ProgressBar, useConfetti, Confetti } from "@/components/GameUtils";
import type { Difficulty } from "@/lib/rewards";
 
// ── Counting Game ─────────────────────────────────────────────────────────────
const OBJECTS = ["🍎","⭐","🐶","🌸","🦋","🍪","🚂","🎈","🐱","🦄","🍕","🌈","🎸","🏀","🐠","🌺","🍦","🚀","🦁","🐬"];
 
function randomCount(difficulty: Difficulty): number {
  if (difficulty === "easy") return Math.floor(Math.random() * 5) + 1;
  if (difficulty === "medium") return Math.floor(Math.random() * 8) + 3;
  return Math.floor(Math.random() * 10) + 1;
}
 
function makeOptions(correct: number): number[] {
  const set = new Set<number>([correct]);
  const candidates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].filter(n => n !== correct);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    if (set.size >= 4) break;
    set.add(n);
  }
  return [...set].sort(() => Math.random() - 0.5);
}
 
interface CountRound { obj: string; count: number; options: number[]; }
 
function newCountRound(difficulty: Difficulty, usedObjs: Set<string>): CountRound {
  if (usedObjs.size >= OBJECTS.length) usedObjs.clear();
  const available = OBJECTS.filter(o => !usedObjs.has(o));
  const obj = available[Math.floor(Math.random() * available.length)];
  usedObjs.add(obj);
  const count = randomCount(difficulty);
  return { obj, count, options: makeOptions(count) };
}
 
export function CountingGame({ difficulty }: { difficulty: Difficulty }) {
  const usedObjs = useRef(new Set<string>());
  const [round, setRound] = useState<CountRound>(() => newCountRound(difficulty, usedObjs.current));
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const { active: confetti, fire } = useConfetti();
 
  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === round.count) {
      fire();
      addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      setScore(s => s + 1);
      speak(`Yes! ${round.count}!`);
    } else {
      speak(`The answer is ${round.count}`);
    }
  }
 
  function next() {
    const r = newCountRound(difficulty, usedObjs.current);
    setRound(r);
    setPicked(null);
    setTimeout(() => speak("How many do you see?"), 300);
  }
 
  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <Confetti active={confetti} />
      <div className="mb-4"><ProgressBar current={score} total={10} color="bg-butter" /></div>
      <div className="mb-4 flex justify-center">
        <Mascot mood={picked === null ? "thinking" : picked === round.count ? "cheer" : "sad"} />
      </div>
      <p className="mb-3 text-lg font-bold">How many do you see?</p>
      <div className="mb-6 flex flex-wrap justify-center gap-1 rounded-2xl bg-muted/30 p-4 min-h-[80px]">
        {Array.from({ length: round.count }).map((_, i) => (
          <span key={i} className="text-4xl leading-tight">{round.obj}</span>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {round.options.map((n) => (
          <button key={n} onClick={() => pick(n)} disabled={picked !== null}
            className={`card-soft rounded-2xl py-4 font-display text-3xl font-bold transition-all ${
              picked !== null
                ? n === round.count ? "bg-mint scale-110 shadow-md"
                : n === picked ? "bg-destructive/30"
                : "opacity-50"
                : "bg-sky hover:scale-105 active:scale-95"
            }`}>
            {n}
          </button>
        ))}
      </div>
      {picked !== null && (
        <button onClick={next} className="mt-5 card-soft rounded-xl bg-pink px-6 py-3 font-bold">Next →</button>
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
 
interface RhymeRound { entry: typeof RHYMES[0]; options: { word: string; correct: boolean }[]; }
 
function newRhymeRound(pool: typeof RHYMES, used: Set<string>): RhymeRound {
  if (used.size >= pool.length) used.clear();
  const available = pool.filter(r => !used.has(r.word));
  const entry = available[Math.floor(Math.random() * available.length)];
  used.add(entry.word);
  const correct = shuffle(entry.rhymes).slice(0, 2).map(w => ({ word: w, correct: true }));
  const wrong   = shuffle(entry.fakes).slice(0, 2).map(w => ({ word: w, correct: false }));
  return { entry, options: shuffle([...correct, ...wrong]) };
}
 
export function RhymeTimeGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = difficulty === "easy" ? RHYMES.slice(0, 6) : RHYMES;
  const usedWords = useRef(new Set<string>());
  const [round, setRound] = useState<RhymeRound>(() => newRhymeRound(pool, usedWords.current));
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { active: confetti, fire } = useConfetti();
 
  function sayWord() {
    speak(round.entry.word.toLowerCase());
    setTimeout(() => speak(`Which word rhymes with ${round.entry.word.toLowerCase()}?`), 900);
  }
 
  function pick(word: string, correct: boolean) {
    if (picked) return;
    setPicked(word);
    if (correct) {
      fire();
      addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      setScore(s => s + 1);
      speak(`Yes! ${round.entry.word.toLowerCase()} and ${word.toLowerCase()} rhyme!`);
    } else {
      speak("Not quite! Try again next time.");
    }
  }
 
  function next() {
    const r = newRhymeRound(pool, usedWords.current);
    setRound(r);
    setPicked(null);
    setTimeout(() => {
      speak(r.entry.word.toLowerCase());
      setTimeout(() => speak(`Which word rhymes with ${r.entry.word.toLowerCase()}?`), 900);
    }, 300);
  }
 
  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <Confetti active={confetti} />
      <div className="mb-4"><ProgressBar current={score} total={8} color="bg-lilac" /></div>
      <div className="mb-4 flex justify-center">
        <Mascot mood={picked === null ? "idle" : round.options.find(o => o.word === picked)?.correct ? "cheer" : "sad"} />
      </div>
      <p className="mb-2 text-sm font-semibold text-muted-foreground">Which word rhymes with:</p>
      <button onClick={sayWord}
        className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-pink px-6 py-4 font-display text-3xl font-bold shadow-md hover:scale-105 transition">
        {round.entry.emoji} {round.entry.word} 🔊
      </button>
      <div className="grid grid-cols-2 gap-4">
        {round.options.map((opt) => (
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
 
