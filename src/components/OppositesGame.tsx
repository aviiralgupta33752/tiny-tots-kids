import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface OppositePair {
  a: { word: string; emoji: string };
  b: { word: string; emoji: string };
}

const PAIRS: OppositePair[] = [
  { a: { word: "Big",   emoji: "🐘" }, b: { word: "Small", emoji: "🐭" } },
  { a: { word: "Hot",   emoji: "🔥" }, b: { word: "Cold",  emoji: "❄️" } },
  { a: { word: "Up",    emoji: "⬆️" }, b: { word: "Down",  emoji: "⬇️" } },
  { a: { word: "Fast",  emoji: "🐆" }, b: { word: "Slow",  emoji: "🐢" } },
  { a: { word: "Happy", emoji: "😄" }, b: { word: "Sad",   emoji: "😢" } },
  { a: { word: "Day",   emoji: "☀️" }, b: { word: "Night", emoji: "🌙" } },
  { a: { word: "Open",  emoji: "🚪" }, b: { word: "Closed",emoji: "🔒" } },
  { a: { word: "Wet",   emoji: "💧" }, b: { word: "Dry",   emoji: "🏜️" } },
  { a: { word: "Full",  emoji: "🥤" }, b: { word: "Empty", emoji: "🫙" } },
  { a: { word: "Old",   emoji: "👴" }, b: { word: "New",   emoji: "✨" } },
];

export function OppositesGame() {
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<string[]>(() => buildOptions(0));
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const pair = PAIRS[round % PAIRS.length];

  function buildOptions(roundIdx: number): string[] {
    const correctPair = PAIRS[roundIdx % PAIRS.length];
    const others = PAIRS.filter((_, i) => i !== roundIdx % PAIRS.length)
      .map(p => p.b.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [correctPair.b.word, ...others].sort(() => Math.random() - 0.5);
  }

  function sayPrompt() {
    speak(`What is the opposite of ${pair.a.word}?`);
  }

  function pick(word: string) {
    if (selected) return;
    setSelected(word);
    const isCorrect = word === pair.b.word;
    setCorrect(isCorrect);
    if (isCorrect) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! The opposite of ${pair.a.word} is ${pair.b.word}!`);
    } else {
      speak(`Good try! The opposite of ${pair.a.word} is ${pair.b.word}.`);
    }
  }

  function next() {
    const newRound = round + 1;
    setRound(newRound);
    setOptions(buildOptions(newRound));
    setSelected(null);
    setCorrect(null);
  }

  return (
    <div className="card-soft mx-auto max-w-xl p-6 text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} matched</div>

      <p className="mb-4 text-lg font-bold">What's the opposite?</p>

      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="rounded-3xl bg-butter/40 p-6">
          <div className="text-5xl mb-2">{pair.a.emoji}</div>
          <div className="font-display text-xl font-bold">{pair.a.word}</div>
        </div>
        <div className="text-3xl">↔️</div>
        <div className="rounded-3xl bg-muted p-6">
          <div className="text-5xl mb-2">❓</div>
          <div className="font-display text-xl font-bold text-muted-foreground">?</div>
        </div>
      </div>

      <button onClick={sayPrompt} className="mb-4 rounded-xl bg-sky px-5 py-2 font-bold text-sm">
        🔊 Hear it again
      </button>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {options.map(word => {
          const opt = PAIRS.flatMap(p => [p.a, p.b]).find(o => o.word === word);
          const isThisCorrect = word === pair.b.word;
          const showState = selected !== null;
          return (
            <button key={word} onClick={() => pick(word)} disabled={!!selected}
              className={`rounded-2xl p-4 transition ${
                showState && isThisCorrect ? "bg-green-200 scale-105" :
                showState && selected === word ? "bg-red-200" :
                "bg-lilac/30 hover:scale-105"
              }`}>
              <div className="text-3xl mb-1">{opt?.emoji}</div>
              <div className="font-display text-sm font-bold">{word}</div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div>
          <p className="mb-3 text-xl font-bold">{correct ? "🎉 Great job!" : "Nice try!"}</p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
        </div>
      )}
    </div>
  );
}
