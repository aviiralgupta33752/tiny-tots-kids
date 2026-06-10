import { useState, useRef } from "react";
import { ALPHABET, TONES, toneClass } from "@/lib/learn-data";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { Mascot, ProgressBar, useConfetti, Confetti } from "@/components/GameUtils";
import type { Difficulty } from "@/lib/rewards";

const WORD_POOLS: Record<Difficulty, { letter: string; word: string; emoji: string }[]> = {
  easy: ALPHABET.filter((a) => a.word.length <= 3),
  medium: ALPHABET.filter((a) => a.word.length <= 5),
  hard: ALPHABET,
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function SpellItGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = WORD_POOLS[difficulty].length > 0 ? WORD_POOLS[difficulty] : ALPHABET;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const target = useRef(pool[Math.floor(Math.random() * pool.length)]);
  const { active: confetti, fire } = useConfetti();

  const word = target.current.word.toUpperCase().replace(/\s/g, "");
  const choices = useRef(makeChoices());

  function makeChoices() {
    const letters = new Set(word.split(""));
    const extras = shuffle(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => !letters.has(l))
    ).slice(0, difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6);
    return shuffle([...word.split(""), ...extras]);
  }

  function playWord() {
    speak(`Spell the word: ${target.current.word}`);
  }

  function tap(letter: string) {
    if (result) return;
    const next = [...typed, letter];
    setTyped(next);

    if (next.length === word.length) {
      const correct = next.join("") === word;
      setResult(correct ? "correct" : "wrong");
      if (correct) {
        fire();
        addStars(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
        setScore((s) => s + 1);
        speak("Amazing! You spelled it!");
      } else {
        speak(`Not quite! The word is ${target.current.word}`);
      }
    }
  }

  function next() {
    target.current = pool[Math.floor(Math.random() * pool.length)];
    choices.current = makeChoices();
    setTyped([]);
    setResult(null);
    setRound((r) => r + 1);
    setTimeout(playWord, 300);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <Confetti active={confetti} />
      <div className="mb-4 flex items-center justify-between">
        <ProgressBar current={score} total={10} color="bg-sky" />
      </div>

      <div className="mb-4 flex justify-center">
        <Mascot mood={result === "correct" ? "cheer" : result === "wrong" ? "sad" : "thinking"} />
      </div>

      <div className="mb-2 text-6xl">{target.current.emoji}</div>

      <button
        onClick={playWord}
        className="mb-4 rounded-2xl bg-lilac px-6 py-3 font-bold text-lg shadow"
      >
        🔊 Hear the word
      </button>

      {/* Typed so far */}
      <div className="mb-4 flex justify-center gap-2">
        {word.split("").map((_, i) => (
          <div
            key={i}
            className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all ${
              typed[i]
                ? result === "correct"
                  ? "border-mint bg-mint"
                  : result === "wrong"
                  ? "border-destructive/50 bg-destructive/20"
                  : "border-pink bg-pink"
                : "border-muted bg-muted/40"
            }`}
          >
            {typed[i] ?? ""}
          </div>
        ))}
      </div>

      {/* Letter choices */}
      {!result && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" key={round}>
          {choices.current.map((l, i) => (
            <button
              key={`${l}-${i}`}
              onClick={() => tap(l)}
              className={`card-soft rounded-xl py-3 font-display text-xl font-bold transition hover:scale-105 ${toneClass(TONES[i % TONES.length])}`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {typed.length > 0 && !result && (
        <button
          onClick={() => setTyped(typed.slice(0, -1))}
          className="mt-3 rounded-xl bg-muted px-4 py-2 text-sm font-bold"
        >
          ← Undo
        </button>
      )}

      {result && (
        <div className="mt-4 animate-bounce">
          <p className="mb-3 text-2xl font-bold">
            {result === "correct" ? "🎉 Perfect!" : `The word was: ${word}`}
          </p>
          <button onClick={next} className="card-soft rounded-xl bg-pink px-6 py-3 font-bold">
            Next Word →
          </button>
        </div>
      )}
    </div>
  );
}
