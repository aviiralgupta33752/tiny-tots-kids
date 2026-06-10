import { useState, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { Mascot, ProgressBar, useConfetti, Confetti } from "@/components/GameUtils";
import type { Difficulty } from "@/lib/rewards";

const EASY_WORDS = [
  { word: "CAT", emoji: "🐱" }, { word: "DOG", emoji: "🐶" },
  { word: "SUN", emoji: "☀️" }, { word: "HAT", emoji: "🎩" },
  { word: "BEE", emoji: "🐝" }, { word: "CUP", emoji: "🥤" },
  { word: "ANT", emoji: "🐜" }, { word: "BUS", emoji: "🚌" },
];

const MEDIUM_WORDS = [
  { word: "FISH", emoji: "🐟" }, { word: "FROG", emoji: "🐸" },
  { word: "DUCK", emoji: "🦆" }, { word: "CAKE", emoji: "🎂" },
  { word: "STAR", emoji: "⭐" }, { word: "BIRD", emoji: "🐦" },
  { word: "RAIN", emoji: "🌧️" }, { word: "MOON", emoji: "🌙" },
];

const HARD_WORDS = [
  { word: "TIGER", emoji: "🐯" }, { word: "APPLE", emoji: "🍎" },
  { word: "GRAPE", emoji: "🍇" }, { word: "PLANE", emoji: "✈️" },
  { word: "CLOUD", emoji: "☁️" }, { word: "HEART", emoji: "❤️" },
  { word: "SNAKE", emoji: "🐍" }, { word: "TRAIN", emoji: "🚂" },
];

const POOL: Record<string, { word: string; emoji: string }[]> = {
  easy: EASY_WORDS, medium: MEDIUM_WORDS, hard: HARD_WORDS,
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeLetters(word: string): { id: number; letter: string }[] {
  return shuffle(word.split("").map((letter, id) => ({ id, letter })));
}

export function WordBuilderGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = POOL[difficulty];
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [built, setBuilt] = useState<{ id: number; letter: string }[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const target = useRef(pool[Math.floor(Math.random() * pool.length)]);
  const [letters, setLetters] = useState(() => makeLetters(target.current.word));
  const { active: confetti, fire } = useConfetti();

  function tap(item: { id: number; letter: string }) {
    if (result || built.find((b) => b.id === item.id)) return;
    const next = [...built, item];
    setBuilt(next);

    if (next.length === target.current.word.length) {
      const formed = next.map((b) => b.letter).join("");
      const correct = formed === target.current.word;
      setResult(correct ? "correct" : "wrong");
      if (correct) {
        fire();
        addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
        setScore((s) => s + 1);
        speak(`${target.current.word}! Great job!`);
      } else {
        speak(`Not quite! Try again!`);
        setTimeout(() => setBuilt([]), 1000);
        setTimeout(() => setResult(null), 1000);
      }
    }
  }

  function next() {
    const t = pool[Math.floor(Math.random() * pool.length)];
    target.current = t;
    setLetters(makeLetters(t.word));
    setBuilt([]);
    setResult(null);
    setRound((r) => r + 1);
    setTimeout(() => speak(`Build the word for ${t.emoji}`), 300);
  }

  const word = target.current.word;

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <Confetti active={confetti} />
      <div className="mb-4">
        <ProgressBar current={score} total={8} color="bg-mint" />
      </div>

      <div className="mb-4 flex justify-center">
        <Mascot mood={result === "correct" ? "cheer" : result === "wrong" ? "sad" : "idle"} />
      </div>

      <p className="mb-1 text-sm font-semibold text-muted-foreground">Build this word:</p>
      <div className="mb-2 text-7xl">{target.current.emoji}</div>

      {/* Slots */}
      <div className="mb-6 flex justify-center gap-2" key={round}>
        {word.split("").map((_, i) => (
          <div
            key={i}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-4 text-2xl font-bold transition-all ${
              built[i]
                ? result === "correct"
                  ? "border-mint bg-mint scale-110"
                  : "border-pink bg-pink"
                : "border-dashed border-muted bg-muted/30"
            }`}
          >
            {built[i]?.letter ?? ""}
          </div>
        ))}
      </div>

      {/* Letter tiles */}
      {!result && (
        <div className="flex flex-wrap justify-center gap-3">
          {letters.map((item) => {
            const used = built.find((b) => b.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => tap(item)}
                disabled={!!used}
                className={`h-14 w-14 rounded-2xl font-display text-2xl font-bold shadow transition-all ${
                  used
                    ? "scale-90 bg-muted opacity-40"
                    : "bg-butter hover:scale-110 hover:shadow-md"
                }`}
              >
                {item.letter}
              </button>
            );
          })}
        </div>
      )}

      {built.length > 0 && !result && (
        <button
          onClick={() => setBuilt(built.slice(0, -1))}
          className="mt-4 rounded-xl bg-muted px-4 py-2 text-sm font-bold"
        >
          ← Undo
        </button>
      )}

      {result === "correct" && (
        <div className="mt-4">
          <p className="mb-3 text-2xl font-bold">🎉 You built it!</p>
          <button onClick={next} className="card-soft rounded-xl bg-mint px-6 py-3 font-bold">
            Next Word →
          </button>
        </div>
      )}
    </div>
  );
}
