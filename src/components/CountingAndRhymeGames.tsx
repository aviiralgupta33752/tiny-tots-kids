import { useState, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import type { Difficulty } from "@/lib/rewards";

// ── Interactive Teacher ───────────────────────────────────────────────────────
function TeacherHelper({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-5xl">👩‍🏫</div>
          <div>
            <p className="font-bold text-lg">Let me show you!</p>
            <p className="text-sm text-muted-foreground">Watch the board 👇</p>
          </div>
        </div>
        {children}
        <button onClick={onClose} className="mt-4 w-full rounded-2xl bg-mint py-3 font-bold text-lg">
          Got it! Let me try again 💪
        </button>
      </div>
    </div>
  );
}

// ── Counting Game ─────────────────────────────────────────────────────────────
const OBJECT_SETS = [
  { emoji: "🍎", name: "apples" }, { emoji: "⭐", name: "stars" },
  { emoji: "🐶", name: "dogs" },  { emoji: "🌸", name: "flowers" },
  { emoji: "🦋", name: "butterflies" }, { emoji: "🍪", name: "cookies" },
  { emoji: "🎈", name: "balloons" }, { emoji: "🐱", name: "cats" },
  { emoji: "🦄", name: "unicorns" }, { emoji: "🍕", name: "pizzas" },
  { emoji: "🏀", name: "balls" }, { emoji: "🍦", name: "ice creams" },
  { emoji: "🚀", name: "rockets" }, { emoji: "🌈", name: "rainbows" },
];

function getCount(difficulty: Difficulty): number {
  if (difficulty === "easy") return Math.floor(Math.random() * 5) + 1;
  if (difficulty === "medium") return Math.floor(Math.random() * 6) + 3;
  return Math.floor(Math.random() * 8) + 3;
}

// FIXED: always include correct answer
function getOptions(correct: number): number[] {
  const pool = Array.from({ length: 15 }, (_, i) => i + 1).filter(n => n !== correct);
  const wrong = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  return [correct, ...wrong].sort(() => Math.random() - 0.5);
}

export function CountingGame({ difficulty }: { difficulty: Difficulty }) {
  const objIndex = useRef(0);
  const [obj, setObj] = useState(OBJECT_SETS[0]);
  const [count, setCount] = useState(() => getCount(difficulty));
  const [options, setOptions] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showTeacher, setShowTeacher] = useState(false);

  // init options properly
  useState(() => {
    const c = getCount(difficulty);
    setCount(c);
    setOptions(getOptions(c));
  });

  if (options.length === 0) return null;

  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === count) {
      addStars(1); setScore(s => s + 1);
      speak(`Yes! ${count}! You're so smart!`);
    } else {
      speak(`Oops! Let me help you count!`);
      setTimeout(() => setShowTeacher(true), 500);
    }
  }

  function next() {
    objIndex.current = (objIndex.current + 1) % OBJECT_SETS.length;
    const newCount = getCount(difficulty);
    const newOptions = getOptions(newCount);
    setObj(OBJECT_SETS[objIndex.current]);
    setCount(newCount);
    setOptions(newOptions);
    setPicked(null);
  }

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      {showTeacher && (
        <TeacherHelper onClose={() => { setShowTeacher(false); setPicked(null); }}>
          <div className="rounded-2xl bg-muted/30 p-4 mb-3">
            <p className="font-bold mb-3">Let's count these {obj.name} together!</p>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl">{obj.emoji}</span>
                  <span className="text-xs font-bold bg-pink rounded-full w-6 h-6 flex items-center justify-center">{i+1}</span>
                </div>
              ))}
            </div>
            <p className="text-xl font-bold text-center">
              1... 2... {count > 2 ? `3...` : ""} {count > 3 ? `...${count}` : ""} = {count} {obj.name}!
            </p>
          </div>
        </TeacherHelper>
      )}

      <div className="mb-3 flex justify-between text-sm font-bold">
        <span>⭐ {score} pts</span>
        <span>{difficulty === "easy" ? "🌱" : difficulty === "medium" ? "⭐" : "🔥"}</span>
      </div>

      <p className="mb-3 text-xl font-bold">How many {obj.emoji} {obj.name}?</p>

      <div className="mb-6 flex flex-wrap justify-center gap-2 rounded-3xl bg-muted/20 p-4" style={{ minHeight: 80 }}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-4xl">{obj.emoji}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(n => (
          <button key={n} onClick={() => pick(n)} disabled={picked !== null}
            className={`rounded-2xl py-4 text-3xl font-bold transition-all ${
              picked === null ? "bg-sky hover:scale-105 cursor-pointer" :
              n === count ? "bg-mint scale-110 shadow-md" :
              n === picked ? "bg-pink/60" : "bg-muted opacity-40"
            }`}>
            {n}{picked !== null && n === count ? " ✓" : ""}
          </button>
        ))}
      </div>

      {picked !== null && !showTeacher && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {picked === count ? "🌟 You got it!" : `There were ${count} ${obj.name}!`}
          </p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Math Game ─────────────────────────────────────────────────────────────────
type Op = "+" | "-" | "×";

function getMathProblem(difficulty: Difficulty): { a: number; b: number; op: Op; answer: number } {
  if (difficulty === "easy") {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    return { a, b, op: "+", answer: a + b };
  }
  if (difficulty === "medium") {
    const op: Op = Math.random() > 0.5 ? "+" : "-";
    const a = Math.floor(Math.random() * 10) + 1;
    const b = op === "-" ? Math.floor(Math.random() * a) + 1 : Math.floor(Math.random() * 10) + 1;
    return { a, b, op, answer: op === "+" ? a + b : a - b };
  }
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  if (op === "×") {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    return { a, b, op, answer: a * b };
  }
  const a = Math.floor(Math.random() * 15) + 1;
  const b = op === "-" ? Math.floor(Math.random() * a) + 1 : Math.floor(Math.random() * 15) + 1;
  return { a, b, op, answer: op === "+" ? a + b : a - b };
}

function getMathOptions(correct: number): number[] {
  const pool = Array.from({ length: 30 }, (_, i) => i + 1).filter(n => n !== correct);
  const wrong = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  return [correct, ...wrong].sort(() => Math.random() - 0.5);
}

export function MathGame({ difficulty }: { difficulty: Difficulty }) {
  const [problem, setProblem] = useState(() => getMathProblem(difficulty));
  const [options, setOptions] = useState(() => getMathOptions(getMathProblem(difficulty).answer));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showTeacher, setShowTeacher] = useState(false);

  useState(() => {
    const p = getMathProblem(difficulty);
    setProblem(p);
    setOptions(getMathOptions(p.answer));
  });

  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === problem.answer) {
      addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      setScore(s => s + 1);
      speak(`Correct! You are so smart!`);
    } else {
      speak(`Oops! Let me show you!`);
      setTimeout(() => setShowTeacher(true), 500);
    }
  }

  function next() {
    const p = getMathProblem(difficulty);
    setProblem(p);
    setOptions(getMathOptions(p.answer));
    setPicked(null);
  }

  const showDots = difficulty === "easy" && problem.op === "+";

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      {showTeacher && (
        <TeacherHelper onClose={() => { setShowTeacher(false); setPicked(null); }}>
          <div className="rounded-2xl bg-muted/30 p-4">
            {problem.op === "+" && (
              <div>
                <p className="font-bold mb-2">Let's add! {problem.a} + {problem.b}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {Array.from({ length: problem.a }).map((_, i) => <span key={i} className="text-2xl">🔵</span>)}
                  <span className="text-2xl mx-2 font-bold">+</span>
                  {Array.from({ length: problem.b }).map((_, i) => <span key={i} className="text-2xl">🔴</span>)}
                </div>
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {Array.from({ length: problem.answer }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-2xl">{i < problem.a ? "🔵" : "🔴"}</span>
                      <span className="text-xs font-bold">{i+1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-bold">{problem.a} + {problem.b} = {problem.answer}! 🎉</p>
              </div>
            )}
            {problem.op === "-" && (
              <div>
                <p className="font-bold mb-2">Let's subtract! {problem.a} - {problem.b}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {Array.from({ length: problem.a }).map((_, i) => (
                    <span key={i} className={`text-2xl ${i >= problem.answer ? "opacity-30 line-through" : ""}`}>⭐</span>
                  ))}
                </div>
                <p className="text-sm mb-1">Take away {problem.b} ⭐</p>
                <p className="text-xl font-bold">{problem.a} - {problem.b} = {problem.answer}! 🎉</p>
              </div>
            )}
            {problem.op === "×" && (
              <div>
                <p className="font-bold mb-2">{problem.a} × {problem.b} means {problem.a} groups of {problem.b}!</p>
                <div className="space-y-1 mb-2">
                  {Array.from({ length: problem.a }).map((_, i) => (
                    <div key={i} className="flex justify-center gap-1">
                      {Array.from({ length: problem.b }).map((_, j) => (
                        <span key={j} className="text-xl">⭐</span>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="text-xl font-bold">{problem.a} × {problem.b} = {problem.answer}! 🎉</p>
              </div>
            )}
          </div>
        </TeacherHelper>
      )}

      <div className="mb-3 flex justify-between text-sm font-bold">
        <span>⭐ {score} pts</span>
        <span>{difficulty === "easy" ? "🌱 Easy" : difficulty === "medium" ? "⭐ Medium" : "🔥 Hard"}</span>
      </div>

      <div className="mb-4 rounded-3xl bg-butter/40 p-6">
        <div className="font-display text-6xl font-bold">{problem.a} {problem.op} {problem.b} = ?</div>
      </div>

      {showDots && (
        <div className="mb-4 flex flex-wrap justify-center gap-1">
          {Array.from({ length: problem.a }).map((_, i) => <span key={`a${i}`} className="text-2xl">🔵</span>)}
          <span className="text-2xl mx-1">+</span>
          {Array.from({ length: problem.b }).map((_, i) => <span key={`b${i}`} className="text-2xl">🔴</span>)}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(n => (
          <button key={n} onClick={() => pick(n)} disabled={picked !== null}
            className={`rounded-2xl py-4 text-3xl font-bold transition-all ${
              picked === null ? "bg-sky hover:scale-105 cursor-pointer" :
              n === problem.answer ? "bg-mint scale-110 shadow-md" :
              n === picked ? "bg-pink/60" : "bg-muted opacity-40"
            }`}>
            {n}{picked !== null && n === problem.answer ? " ✓" : ""}
          </button>
        ))}
      </div>

      {picked !== null && !showTeacher && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {picked === problem.answer ? "🌟 Amazing!" : `${problem.a} ${problem.op} ${problem.b} = ${problem.answer}`}
          </p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Rhyme Time ────────────────────────────────────────────────────────────────
const RHYMES = [
  { word: "CAT",  emoji: "🐱", rhymes: ["HAT","BAT","RAT"],    fakes: ["DOG","SUN","FISH"] },
  { word: "DOG",  emoji: "🐶", rhymes: ["LOG","FOG","HOG"],    fakes: ["CAT","BIRD","CAKE"] },
  { word: "SUN",  emoji: "☀️", rhymes: ["FUN","RUN","BUN"],    fakes: ["MOON","STAR","RAIN"] },
  { word: "CAKE", emoji: "🎂", rhymes: ["LAKE","MAKE","RAKE"], fakes: ["PIE","BREAD","MILK"] },
  { word: "FISH", emoji: "🐟", rhymes: ["DISH","WISH"],        fakes: ["BIRD","FROG","BEAR"] },
  { word: "BEAR", emoji: "🐻", rhymes: ["PEAR","HAIR","FAIR"], fakes: ["LION","DUCK","WOLF"] },
  { word: "MOON", emoji: "🌙", rhymes: ["SOON","TUNE","JUNE"], fakes: ["STAR","SUN","CLOUD"] },
  { word: "STAR", emoji: "⭐", rhymes: ["CAR","FAR","JAR"],    fakes: ["MOON","CLOUD","RAIN"] },
  { word: "BALL", emoji: "⚽", rhymes: ["TALL","FALL","WALL"], fakes: ["FISH","CAKE","TREE"] },
  { word: "TREE", emoji: "🌲", rhymes: ["BEE","SEE","FREE"],   fakes: ["BALL","FROG","STAR"] },
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
  const [showTeacher, setShowTeacher] = useState(false);

  function pick(word: string, correct: boolean) {
    if (picked) return;
    setPicked(word);
    if (correct) {
      addStars(1); setScore(s => s + 1);
      speak(`Yes! ${entry.word.toLowerCase()} and ${word.toLowerCase()} rhyme! They both end the same way!`);
    } else {
      speak(`Almost! Let me show you!`);
      setTimeout(() => setShowTeacher(true), 500);
    }
  }

  function next() {
    setRound(getNext(entry.word));
    setPicked(null);
  }

  const ending = entry.word.slice(-2).toLowerCase();

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      {showTeacher && (
        <TeacherHelper onClose={() => { setShowTeacher(false); setPicked(null); }}>
          <div className="rounded-2xl bg-muted/30 p-4 text-center">
            <p className="font-bold mb-3">Words that RHYME sound the same at the end!</p>
            <div className="flex justify-center gap-4 mb-3">
              {[entry.word, ...entry.rhymes].map(w => (
                <div key={w} className="rounded-xl bg-mint p-2 text-center">
                  <div className="text-xl font-bold">{w}</div>
                  <div className="text-sm text-pink font-bold">ends in "{w.slice(-2).toLowerCase()}"</div>
                </div>
              ))}
            </div>
            <p className="text-sm">They all end in <span className="font-bold text-pink">"{ending}"</span> — that's what makes them rhyme! 🎵</p>
          </div>
        </TeacherHelper>
      )}

      <div className="mb-3 text-right text-sm font-bold">⭐ {score} pts</div>
      <p className="mb-2 text-sm font-semibold">Which word rhymes with:</p>
      <button onClick={() => speak(`Which word rhymes with ${entry.word.toLowerCase()}?`)}
        className="mb-6 rounded-2xl bg-pink px-6 py-4 text-3xl font-bold shadow-md hover:scale-105 transition">
        {entry.emoji} {entry.word} 🔊
      </button>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {opts.map(opt => (
          <button key={opt.word} onClick={() => pick(opt.word, opt.correct)} disabled={!!picked}
            className={`rounded-2xl py-5 text-2xl font-bold transition-all ${
              picked === null ? "bg-butter hover:scale-105 cursor-pointer" :
              opt.correct ? "bg-mint scale-105" :
              picked === opt.word ? "bg-pink/60" : "bg-muted opacity-50"
            }`}>
            {opt.word}
          </button>
        ))}
      </div>
      {picked && !showTeacher && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {opts.find(o => o.word === picked)?.correct ? "🎉 You're a rhyming star!" : "Keep going, you're doing great!"}
          </p>
          <button onClick={next} className="rounded-2xl bg-sky px-8 py-3 font-bold">Next →</button>
        </div>
      )}
    </div>
  );
}
