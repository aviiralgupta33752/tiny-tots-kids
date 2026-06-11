import { useState, useCallback, useRef } from "react";
import { TONES, toneClass } from "@/lib/learn-data";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { Mascot, ProgressBar, useConfetti, Confetti } from "@/components/GameUtils";
import type { Difficulty } from "@/lib/rewards";
 
const ALL_WORDS: { word: string; emoji: string }[] = [
  { word: "CAT",      emoji: "🐱" }, { word: "DOG",      emoji: "🐶" },
  { word: "SUN",      emoji: "☀️" }, { word: "HAT",      emoji: "🎩" },
  { word: "CUP",      emoji: "🥤" }, { word: "BUS",      emoji: "🚌" },
  { word: "ANT",      emoji: "🐜" }, { word: "BEE",      emoji: "🐝" },
  { word: "EGG",      emoji: "🥚" }, { word: "FAN",      emoji: "🌀" },
  { word: "GUM",      emoji: "🍬" }, { word: "HEN",      emoji: "🐔" },
  { word: "JAM",      emoji: "🍓" }, { word: "JET",      emoji: "✈️" },
  { word: "MAP",      emoji: "🗺️" }, { word: "MOP",      emoji: "🧹" },
  { word: "NET",      emoji: "🥅" }, { word: "PEN",      emoji: "🖊️" },
  { word: "PIG",      emoji: "🐷" }, { word: "POT",      emoji: "🍲" },
  { word: "RAT",      emoji: "🐭" }, { word: "RUG",      emoji: "🟫" },
  { word: "SAP",      emoji: "🌿" }, { word: "TUB",      emoji: "🛁" },
  { word: "WEB",      emoji: "🕸️" }, { word: "YAK",      emoji: "🦬" },
  { word: "ZAP",      emoji: "⚡" }, { word: "FISH",     emoji: "🐟" },
  { word: "FROG",     emoji: "🐸" }, { word: "DUCK",     emoji: "🦆" },
  { word: "CAKE",     emoji: "🎂" }, { word: "STAR",     emoji: "⭐" },
  { word: "BIRD",     emoji: "🐦" }, { word: "RAIN",     emoji: "🌧️" },
  { word: "MOON",     emoji: "🌙" }, { word: "TREE",     emoji: "🌲" },
  { word: "BOOK",     emoji: "📚" }, { word: "BALL",     emoji: "⚽" },
  { word: "MILK",     emoji: "🥛" }, { word: "FROG",     emoji: "🐸" },
  { word: "TIGER",    emoji: "🐯" }, { word: "APPLE",    emoji: "🍎" },
  { word: "GRAPE",    emoji: "🍇" }, { word: "CLOUD",    emoji: "☁️" },
  { word: "HEART",    emoji: "❤️" }, { word: "SNAKE",    emoji: "🐍" },
  { word: "TRAIN",    emoji: "🚂" }, { word: "BREAD",    emoji: "🍞" },
  { word: "CLOCK",    emoji: "🕐" }, { word: "DRESS",    emoji: "👗" },
  { word: "FLAME",    emoji: "🔥" }, { word: "GRASS",    emoji: "🌿" },
  { word: "HONEY",    emoji: "🍯" }, { word: "JUICE",    emoji: "🧃" },
  { word: "KNIFE",    emoji: "🔪" }, { word: "LEMON",    emoji: "🍋" },
  { word: "MOUSE",    emoji: "🐭" }, { word: "NIGHT",    emoji: "🌙" },
  { word: "OCEAN",    emoji: "🌊" }, { word: "PIANO",    emoji: "🎹" },
  { word: "QUEEN",    emoji: "👑" }, { word: "ROBOT",    emoji: "🤖" },
];
 
const WORD_POOLS: Record<Difficulty, { word: string; emoji: string }[]> = {
  easy:   ALL_WORDS.filter((w) => w.word.length <= 3),
  medium: ALL_WORDS.filter((w) => w.word.length <= 5),
  hard:   ALL_WORDS,
};
 
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
 
function makeChoices(word: string, difficulty: Difficulty): string[] {
  const letters = new Set(word.split(""));
  const extras = shuffle(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => !letters.has(l))
  ).slice(0, difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6);
  return shuffle([...word.split(""), ...extras]);
}
 
interface RoundState {
  target: { word: string; emoji: string };
  word: string;
  choices: string[];
}
 
export function SpellItGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = useRef(shuffle(WORD_POOLS[difficulty].length > 0 ? WORD_POOLS[difficulty] : ALL_WORDS));
  const indexRef = useRef(0);
 
  function getNextWord(): RoundState {
    // cycle through shuffled pool, reshuffle when exhausted
    if (indexRef.current >= pool.current.length) {
      pool.current = shuffle(pool.current);
      indexRef.current = 0;
    }
    const target = pool.current[indexRef.current++];
    const word = target.word.toUpperCase();
    return { target, word, choices: makeChoices(word, difficulty) };
  }
 
  const [round, setRound] = useState<RoundState>(() => getNextWord());
  const [score, setScore] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const { active: confetti, fire } = useConfetti();
 
  const playWord = useCallback(() => {
    speak(`Spell the word: ${round.target.word.toLowerCase()}`);
  }, [round.target.word]);
 
  function tap(letter: string) {
    if (result) return;
    const next = [...typed, letter];
    setTyped(next);
    if (next.length === round.word.length) {
      const correct = next.join("") === round.word;
      setResult(correct ? "correct" : "wrong");
      if (correct) {
        fire();
        addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
        setScore((s) => s + 1);
        speak("Amazing! You spelled it!");
      } else {
        speak(`Not quite! The word is ${round.target.word.toLowerCase()}`);
      }
    }
  }
 
  function next() {
    const r = getNextWord();
    setRound(r);
    setTyped([]);
    setResult(null);
    setTimeout(() => speak(`Spell the word: ${r.target.word.toLowerCase()}`), 300);
  }
 
  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <Confetti active={confetti} />
      <div className="mb-4"><ProgressBar current={score} total={10} color="bg-sky" /></div>
      <div className="mb-4 flex justify-center">
        <Mascot mood={result === "correct" ? "cheer" : result === "wrong" ? "sad" : "thinking"} />
      </div>
      <div className="mb-2 text-6xl">{round.target.emoji}</div>
      <button onClick={playWord} className="mb-4 rounded-2xl bg-lilac px-6 py-3 font-bold text-lg shadow">
        🔊 Hear the word
      </button>
      <div className="mb-4 flex justify-center gap-2">
        {round.word.split("").map((_, i) => (
          <div key={i} className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all ${
            typed[i] ? result === "correct" ? "border-mint bg-mint" : result === "wrong" ? "border-destructive/50 bg-destructive/20" : "border-pink bg-pink" : "border-muted bg-muted/40"
          }`}>
            {typed[i] ?? ""}
          </div>
        ))}
      </div>
      {!result && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {round.choices.map((l, i) => (
            <button key={`${l}-${i}`} onClick={() => tap(l)}
              className={`card-soft rounded-xl py-3 font-display text-xl font-bold transition hover:scale-105 ${toneClass(TONES[i % TONES.length])}`}>
              {l}
            </button>
          ))}
        </div>
      )}
      {typed.length > 0 && !result && (
        <button onClick={() => setTyped(typed.slice(0, -1))} className="mt-3 rounded-xl bg-muted px-4 py-2 text-sm font-bold">
          ← Undo
        </button>
      )}
      {result && (
        <div className="mt-4">
          <p className="mb-3 text-2xl font-bold">{result === "correct" ? "🎉 Perfect!" : `The word was: ${round.word}`}</p>
          <button onClick={next} className="card-soft rounded-xl bg-pink px-6 py-3 font-bold">Next Word →</button>
        </div>
      )}
    </div>
  );
}
 
