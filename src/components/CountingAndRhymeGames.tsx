import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import type { Difficulty } from "@/lib/rewards";

// ── Teacher Helper ────────────────────────────────────────────────────────────
function TeacherHelper({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-bounce-in">
        <div className="flex items-start gap-4">
          <div className="text-6xl flex-shrink-0">👩‍🏫</div>
          <div className="flex-1">
            <p className="font-bold text-lg mb-1">Teacher says:</p>
            <p className="text-base leading-relaxed text-gray-700">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-mint py-3 font-bold text-lg"
        >
          Got it! Let me try again 💪
        </button>
      </div>
    </div>
  );
}

// ── Counting Game ─────────────────────────────────────────────────────────────
const OBJECT_SETS = [
  { emoji: "🍎", name: "apples" },
  { emoji: "⭐", name: "stars" },
  { emoji: "🐶", name: "dogs" },
  { emoji: "🌸", name: "flowers" },
  { emoji: "🦋", name: "butterflies" },
  { emoji: "🍪", name: "cookies" },
  { emoji: "🚂", name: "trains" },
  { emoji: "🎈", name: "balloons" },
  { emoji: "🐱", name: "cats" },
  { emoji: "🦄", name: "unicorns" },
  { emoji: "🍕", name: "pizzas" },
  { emoji: "🏀", name: "basketballs" },
  { emoji: "🐠", name: "fish" },
  { emoji: "🍦", name: "ice creams" },
  { emoji: "🚀", name: "rockets" },
];

const BG_COLORS = ["#fff5f8","#f0fbf6","#f5f0ff","#fffbf0","#f0f8ff","#fff0f8"];

function getCount(difficulty: Difficulty): number {
  if (difficulty === "easy") return Math.floor(Math.random() * 5) + 1;
  if (difficulty === "medium") return Math.floor(Math.random() * 6) + 3;
  return Math.floor(Math.random() * 8) + 3;
}

function getOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    const n = Math.floor(Math.random() * 12) + 1;
    if (n !== correct) opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

export function CountingGame({ difficulty }: { difficulty: Difficulty }) {
  const [objIndex, setObjIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [count, setCount] = useState(() => getCount(difficulty));
  const [options, setOptions] = useState(() => getOptions(getCount(difficulty)));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showTeacher, setShowTeacher] = useState(false);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const obj = OBJECT_SETS[objIndex % OBJECT_SETS.length];

  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === count) {
      addStars(1);
      setScore(s => s + 1);
      setCelebrate(true);
      speak(`Yes! ${count}! Great counting!`);
      setTimeout(() => setCelebrate(false), 1500);
    } else {
      setShake(true);
      setTimeout(() => { setShake(false); setShowTeacher(true); }, 600);
      speak(`Oops! Let me help you!`);
    }
  }

  function next() {
    const newCount = getCount(difficulty);
    setObjIndex(i => (i + 1) % OBJECT_SETS.length);
    setBgIndex(i => (i + 1) % BG_COLORS.length);
    setCount(newCount);
    setOptions(getOptions(newCount));
    setPicked(null);
    setCelebrate(false);
  }

  const teacherMessage = `Let's count together! We have ${obj.emoji} ${obj.emoji} ${obj.emoji}... 
Count each one: ${Array.from({ length: count }, (_, i) => i + 1).join(", ")}. 
So there are ${count} ${obj.name}! The answer is ${count}. You've got this! 🌟`;

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center relative overflow-hidden">
      {showTeacher && (
        <TeacherHelper
          message={teacherMessage}
          onClose={() => { setShowTeacher(false); setPicked(null); }}
        />
      )}

      {/* Score + streak */}
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-full bg-butter px-4 py-1 text-sm font-bold">⭐ {score} pts</div>
        <div className="rounded-full bg-mint px-4 py-1 text-sm font-bold">
          {difficulty === "easy" ? "🌱 Easy" : difficulty === "medium" ? "⭐ Medium" : "🔥 Hard"}
        </div>
      </div>

      <p className="mb-4 text-xl font-bold">
        How many <span className="text-2xl">{obj.emoji}</span> {obj.name} do you see?
      </p>

      {/* Objects display */}
      <div
        className={`mb-6 flex flex-wrap justify-center gap-2 rounded-3xl p-4 transition-all ${shake ? "animate-pulse" : ""} ${celebrate ? "ring-4 ring-mint" : ""}`}
        style={{ background: BG_COLORS[bgIndex], minHeight: 90 }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="text-4xl transition-all"
            style={{
              animationDelay: `${i * 0.05}s`,
              transform: celebrate ? "scale(1.2)" : "scale(1)",
              transition: `transform 0.3s ease ${i * 0.05}s`,
            }}
          >
            {obj.emoji}
          </span>
        ))}
      </div>

      {celebrate && (
        <div className="mb-3 text-3xl animate-bounce">🎉 Amazing! 🎉</div>
      )}

      {/* Number options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(n => (
          <button
            key={n}
            onClick={() => pick(n)}
            disabled={picked !== null}
            className={`rounded-2xl py-4 text-3xl font-bold transition-all duration-200 ${
              picked === null
                ? "bg-sky hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"
                : n === count
                ? "bg-mint scale-105 shadow-md"
                : n === picked
                ? "bg-pink/60"
                : "bg-muted opacity-40"
            }`}
          >
            {n}
            {picked !== null && n === count && " ✓"}
          </button>
        ))}
      </div>

      {picked !== null && !showTeacher && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {picked === count ? "🌟 Perfect!" : `The answer was ${count} ${obj.emoji}`}
          </p>
          <button
            onClick={next}
            className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white hover:scale-105 transition shadow-md"
          >
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
  // hard
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  if (op === "×") {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, op, answer: a * b };
  }
  const a = Math.floor(Math.random() * 20) + 1;
  const b = op === "-" ? Math.floor(Math.random() * a) + 1 : Math.floor(Math.random() * 20) + 1;
  return { a, b, op, answer: op === "+" ? a + b : a - b };
}

function getMathOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    const n = Math.max(0, correct + Math.floor(Math.random() * 7) - 3);
    if (n !== correct) opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

function getMathTeacherMessage(a: number, b: number, op: Op, answer: number): string {
  if (op === "+") {
    return `Let's add ${a} + ${b} together! 
Start with ${a}, then count up ${b} more: ${Array.from({ length: b }, (_, i) => a + i + 1).join(", ")}.
So ${a} + ${b} = ${answer}! Great job trying! 🌟`;
  }
  if (op === "-") {
    return `Let's subtract! Start with ${a}, then take away ${b}.
Count down: ${Array.from({ length: b }, (_, i) => a - i - 1).join(", ")}.
So ${a} - ${b} = ${answer}! You're doing amazing! ⭐`;
  }
  return `Let's multiply! ${a} × ${b} means adding ${a} groups of ${b}.
${Array.from({ length: a }, (_, i) => `${i + 1} × ${b} = ${(i + 1) * b}`).slice(0, 5).join(", ")}...
So ${a} × ${b} = ${answer}! Keep it up! 🚀`;
}

const MATH_BGS = ["#fff5f8","#f0fbf6","#f5f0ff","#fffbf0"];

export function MathGame({ difficulty }: { difficulty: Difficulty }) {
  const [problem, setProblem] = useState(() => getMathProblem(difficulty));
  const [options, setOptions] = useState(() => getMathOptions(getMathProblem(difficulty).answer));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showTeacher, setShowTeacher] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // sync options with problem on mount
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
      setCelebrate(true);
      speak(`Correct! ${problem.a} ${problem.op} ${problem.b} equals ${problem.answer}!`);
      setTimeout(() => setCelebrate(false), 1500);
    } else {
      speak("Oops! Let me help you!");
      setTimeout(() => setShowTeacher(true), 400);
    }
  }

  function next() {
    const p = getMathProblem(difficulty);
    setProblem(p);
    setOptions(getMathOptions(p.answer));
    setPicked(null);
    setCelebrate(false);
    setBgIndex(i => (i + 1) % MATH_BGS.length);
  }

  const opSymbol = problem.op;

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      {showTeacher && (
        <TeacherHelper
          message={getMathTeacherMessage(problem.a, problem.b, problem.op, problem.answer)}
          onClose={() => { setShowTeacher(false); setPicked(null); }}
        />
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-full bg-butter px-4 py-1 text-sm font-bold">⭐ {score} pts</div>
        <div className="rounded-full bg-lilac px-4 py-1 text-sm font-bold">
          {difficulty === "easy" ? "🌱 Easy" : difficulty === "medium" ? "⭐ Medium" : "🔥 Hard"}
        </div>
      </div>

      {/* Problem display */}
      <div
        className="mb-6 rounded-3xl p-6 transition-all"
        style={{ background: MATH_BGS[bgIndex] }}
      >
        <div className={`font-display text-7xl font-bold tracking-wide ${celebrate ? "animate-bounce" : ""}`}>
          {problem.a} {opSymbol} {problem.b}
        </div>
        <div className="mt-2 text-4xl font-bold text-muted-foreground">= ?</div>
      </div>

      {celebrate && <div className="mb-3 text-3xl animate-bounce">🎉 Brilliant! 🎉</div>}

      {/* Hint for easy mode */}
      {difficulty === "easy" && problem.op === "+" && (
        <div className="mb-4 flex justify-center gap-1">
          {Array.from({ length: problem.a }).map((_, i) => <span key={`a${i}`} className="text-2xl">🔵</span>)}
          <span className="text-2xl mx-1">+</span>
          {Array.from({ length: problem.b }).map((_, i) => <span key={`b${i}`} className="text-2xl">🔴</span>)}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map(n => (
          <button
            key={n}
            onClick={() => pick(n)}
            disabled={picked !== null}
            className={`rounded-2xl py-4 text-3xl font-bold transition-all duration-200 ${
              picked === null
                ? "bg-sky hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"
                : n === problem.answer
                ? "bg-mint scale-105 shadow-md"
                : n === picked
                ? "bg-pink/60"
                : "bg-muted opacity-40"
            }`}
          >
            {n}
            {picked !== null && n === problem.answer && " ✓"}
          </button>
        ))}
      </div>

      {picked !== null && !showTeacher && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {picked === problem.answer
              ? "🌟 You got it!"
              : `${problem.a} ${opSymbol} ${problem.b} = ${problem.answer}`}
          </p>
          <button
            onClick={next}
            className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white hover:scale-105 transition shadow-md"
          >
            Next →
          </button>
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
      addStars(1);
      setScore(s => s + 1);
      speak(`Yes! ${entry.word.toLowerCase()} and ${word.toLowerCase()} rhyme!`);
    } else {
      speak("Oops! Let me help!");
      setTimeout(() => setShowTeacher(true), 400);
    }
  }

  function next() {
    setRound(getNext(entry.word));
    setPicked(null);
  }

  const rhymeTeacherMsg = `Words that rhyme sound the same at the end! 
"${entry.word}" ends with "${entry.word.slice(-2)}".
These words also end the same way: ${entry.rhymes.join(", ")}.
They all rhyme with ${entry.word}! 🎵`;

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      {showTeacher && (
        <TeacherHelper
          message={rhymeTeacherMsg}
          onClose={() => { setShowTeacher(false); setPicked(null); }}
        />
      )}
      <div className="mb-3 text-right text-sm font-bold">⭐ {score} pts</div>
      <p className="mb-2 text-sm font-semibold">Which word rhymes with:</p>
      <button
        onClick={() => speak(`Which word rhymes with ${entry.word.toLowerCase()}?`)}
        className="mb-6 rounded-2xl bg-pink px-6 py-4 text-3xl font-bold shadow-md hover:scale-105 transition"
      >
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
              picked === opt.word ? "bg-pink/60" : "bg-muted opacity-50"
            }`}
          >
            {opt.word}
          </button>
        ))}
      </div>
      {picked && !showTeacher && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {opts.find(o => o.word === picked)?.correct ? "🎉 Great!" : "Keep trying!"}
          </p>
          <button onClick={next} className="rounded-2xl bg-sky px-8 py-3 text-lg font-bold">Next →</button>
        </div>
      )}
    </div>
  );
}
