import { useState, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import type { Difficulty } from "@/lib/rewards";

interface SentenceItem {
  words: string[];
  emoji: string;
}

const EASY_SENTENCES: SentenceItem[] = [
  { words: ["The", "cat", "is", "big"],     emoji: "🐱" },
  { words: ["The", "dog", "can", "run"],    emoji: "🐶" },
  { words: ["I", "see", "a", "star"],       emoji: "⭐" },
  { words: ["The", "sun", "is", "hot"],     emoji: "☀️" },
  { words: ["The", "fish", "can", "swim"],  emoji: "🐟" },
  { words: ["I", "like", "my", "mom"],      emoji: "👩" },
  { words: ["The", "bird", "can", "fly"],   emoji: "🐦" },
  { words: ["The", "ball", "is", "red"],    emoji: "🔴" },
];

const MEDIUM_SENTENCES: SentenceItem[] = [
  { words: ["The", "big", "dog", "runs", "fast"],     emoji: "🐶" },
  { words: ["I", "have", "a", "red", "ball"],          emoji: "🔴" },
  { words: ["The", "cat", "sleeps", "on", "the", "bed"], emoji: "🐱" },
  { words: ["My", "mom", "makes", "good", "food"],    emoji: "👩‍🍳" },
  { words: ["The", "sun", "is", "very", "hot"],        emoji: "☀️" },
  { words: ["We", "play", "in", "the", "park"],        emoji: "🏞️" },
];

const HARD_SENTENCES: SentenceItem[] = [
  { words: ["The", "happy", "dog", "ran", "in", "the", "park"],     emoji: "🐶" },
  { words: ["My", "little", "sister", "likes", "to", "draw"],       emoji: "🎨" },
  { words: ["We", "saw", "a", "bright", "rainbow", "today"],        emoji: "🌈" },
  { words: ["The", "tall", "giraffe", "eats", "green", "leaves"],   emoji: "🦒" },
];

function getPool(difficulty: Difficulty): SentenceItem[] {
  if (difficulty === "easy") return EASY_SENTENCES;
  if (difficulty === "medium") return MEDIUM_SENTENCES;
  return HARD_SENTENCES;
}

export function SentenceGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = getPool(difficulty);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>(() => shuffle(pool[0].words));
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const sentence = pool[index % pool.length];

  function shuffle(words: string[]) {
    return [...words].sort(() => Math.random() - 0.5);
  }

  function pick(word: string, fromOptions: boolean) {
    if (done) return;
    if (fromOptions) {
      const idx = options.indexOf(word);
      const newOptions = [...options]; newOptions.splice(idx, 1);
      const newPlaced = [...placed, word];
      setOptions(newOptions);
      setPlaced(newPlaced);
      if (newPlaced.length === sentence.words.length) {
        checkSentence(newPlaced);
      }
    } else {
      const idx = placed.indexOf(word);
      const newPlaced = [...placed]; newPlaced.splice(idx, 1);
      setPlaced(newPlaced);
      setOptions([...options, word]);
    }
  }

  function checkSentence(attempt: string[]) {
    const correct = attempt.join(" ").toLowerCase() === sentence.words.join(" ").toLowerCase();
    setDone(true);
    if (correct) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! "${sentence.words.join(" ")}" That's correct!`);
    } else {
      speak(`Good try! The sentence is "${sentence.words.join(" ")}"`);
    }
  }

  function next() {
    const newIndex = index + 1;
    setIndex(newIndex);
    const newSentence = pool[newIndex % pool.length];
    setPlaced([]);
    setOptions(shuffle(newSentence.words));
    setDone(false);
  }

  function speakSentence() {
    speak(sentence.words.join(" "));
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="mb-3 flex justify-between text-sm font-bold">
        <span>⭐ {score} sentences built</span>
        <span>{difficulty === "easy" ? "🌱" : difficulty === "medium" ? "⭐" : "🔥"}</span>
      </div>

      <div className="text-5xl mb-3">{sentence.emoji}</div>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Tap the words in order to build the sentence!</p>

      {/* Sentence build area */}
      <div className="min-h-16 rounded-2xl bg-butter/30 p-3 mb-4 flex flex-wrap gap-2 justify-center items-center">
        {placed.length === 0 && <span className="text-muted-foreground text-sm">Tap words below to start...</span>}
        {placed.map((w, i) => (
          <button key={i} onClick={() => pick(w, false)} disabled={done}
            className="rounded-xl bg-pink px-4 py-2 font-display text-lg font-bold text-white">
            {w}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {options.map((w, i) => (
          <button key={i} onClick={() => pick(w, true)} disabled={done}
            className="rounded-xl bg-sky px-4 py-2 font-display text-lg font-bold hover:scale-105 transition">
            {w}
          </button>
        ))}
      </div>

      <button onClick={speakSentence} className="rounded-xl bg-lilac px-5 py-2 font-bold text-sm mb-4">
        🔊 Hear the sentence
      </button>

      {done && (
        <div>
          <p className="mb-3 text-xl font-bold">
            {placed.join(" ").toLowerCase() === sentence.words.join(" ").toLowerCase() ? "🎉 Great sentence!" : `The sentence is: "${sentence.words.join(" ")}"`}
          </p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
        </div>
      )}
    </div>
  );
}
