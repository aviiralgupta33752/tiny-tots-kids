import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Ecosystem { name: string; emoji: string; fact: string; animals: string[]; }

const ECOSYSTEMS: Ecosystem[] = [
  { name: "Forest", emoji: "🌳", fact: "Forests are full of tall trees and provide homes for many animals.", animals: ["🦌", "🐿️", "🦉", "🐻"] },
  { name: "Ocean",   emoji: "🌊", fact: "The ocean is full of saltwater and home to fish, whales, and coral.", animals: ["🐠", "🐳", "🐙", "🦀"] },
  { name: "Desert",  emoji: "🏜️", fact: "Deserts are hot and dry with very little rain or water.", animals: ["🐍", "🦂", "🦎", "🐫"] },
  { name: "Rainforest", emoji: "🌴", fact: "Rainforests are warm, wet, and home to more animals than any other place!", animals: ["🐒", "🦜", "🐸", "🦋"] },
  { name: "Arctic",  emoji: "❄️", fact: "The Arctic is very cold and icy, with animals that have thick fur.", animals: ["🐻‍❄️", "🐧", "🦭", "🐺"] },
];

type Mode = "learn" | "quiz";

export function Ecosystems() {
  const [mode, setMode] = useState<Mode>("learn");
  const [index, setIndex] = useState(0);
  const eco = ECOSYSTEMS[index];

  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 Learn
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>

      {mode === "learn" ? (
        <div className="text-center">
          <div className="rounded-3xl bg-mint/30 p-8 mb-4">
            <div className="text-6xl mb-3">{eco.emoji}</div>
            <div className="font-display text-2xl font-bold mb-2">{eco.name}</div>
            <div className="text-sm text-muted-foreground mb-4">{eco.fact}</div>
            <div className="flex justify-center gap-2">
              {eco.animals.map((a, i) => <span key={i} className="text-3xl">{a}</span>)}
            </div>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <button onClick={() => { const i = (index - 1 + ECOSYSTEMS.length) % ECOSYSTEMS.length; setIndex(i); speak(ECOSYSTEMS[i].fact); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
            <button onClick={() => speak(eco.fact)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
            <button onClick={() => { const i = (index + 1) % ECOSYSTEMS.length; setIndex(i); speak(ECOSYSTEMS[i].fact); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {ECOSYSTEMS.map((e, i) => (
              <button key={e.name} onClick={() => { setIndex(i); speak(e.fact); }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
                {e.emoji} {e.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <EcosystemQuiz />
      )}
    </div>
  );
}

function EcosystemQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const eco = ECOSYSTEMS[r % ECOSYSTEMS.length];
    const animal = eco.animals[Math.floor(Math.random() * eco.animals.length)];
    const others = ECOSYSTEMS.filter(e => e.name !== eco.name).map(e => e.name).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [eco.name, ...others].sort(() => Math.random() - 0.5);
    return { eco, animal, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(name: string) {
    if (selected) return;
    setSelected(name);
    if (name === data.eco.name) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! That animal lives in the ${data.eco.name}!`);
    } else {
      speak(`That animal lives in the ${data.eco.name}.`);
    }
  }

  function next() {
    const newRound = round + 1;
    setRound(newRound);
    setData(buildRound(newRound));
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <div className="text-6xl mb-3">{data.animal}</div>
      <p className="mb-4 text-lg font-bold">Where does this animal live?</p>
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
        {data.options.map(name => {
          const showState = selected !== null;
          const isCorrect = name === data.eco.name;
          const eco = ECOSYSTEMS.find(e => e.name === name)!;
          return (
            <button key={name} onClick={() => pick(name)} disabled={!!selected}
              className={`rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === name ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              <div className="text-2xl mb-1">{eco.emoji}</div>
              <div className="font-bold text-xs">{name}</div>
            </button>
          );
        })}
      </div>
      {selected && (
        <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
      )}
    </div>
  );
}
