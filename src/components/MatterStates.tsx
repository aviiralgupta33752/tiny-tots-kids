import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface MatterState { name: string; emoji: string; fact: string; examples: { name: string; emoji: string }[]; }

const STATES_OF_MATTER: MatterState[] = [
  {
    name: "Solid", emoji: "🧊",
    fact: "A solid keeps its shape. It does not flow or spread out.",
    examples: [{ name: "Ice", emoji: "🧊" }, { name: "Rock", emoji: "🪨" }, { name: "Wood", emoji: "🪵" }, { name: "Book", emoji: "📕" }],
  },
  {
    name: "Liquid", emoji: "💧",
    fact: "A liquid flows and takes the shape of its container.",
    examples: [{ name: "Water", emoji: "💧" }, { name: "Juice", emoji: "🧃" }, { name: "Milk", emoji: "🥛" }, { name: "Soup", emoji: "🍲" }],
  },
  {
    name: "Gas", emoji: "💨",
    fact: "A gas spreads out to fill any space. We can't always see it!",
    examples: [{ name: "Air", emoji: "💨" }, { name: "Steam", emoji: "♨️" }, { name: "Bubbles", emoji: "🫧" }, { name: "Smoke", emoji: "🌫️" }],
  },
];

type Mode = "learn" | "sort" | "quiz";

export function MatterStates() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 Learn
        </button>
        <button onClick={() => setMode("sort")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "sort" ? "bg-pink text-white" : "bg-muted"}`}>
          🗂️ Sort It
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>
      {mode === "learn" && <LearnMatter />}
      {mode === "sort" && <SortMatter />}
      {mode === "quiz" && <MatterQuiz />}
    </div>
  );
}

function LearnMatter() {
  const [index, setIndex] = useState(0);
  const state = STATES_OF_MATTER[index];

  return (
    <div className="text-center">
      <div className="rounded-3xl bg-sky/20 p-8 mb-4">
        <div className="text-6xl mb-3">{state.emoji}</div>
        <div className="font-display text-2xl font-bold mb-2">{state.name}</div>
        <div className="text-sm text-muted-foreground mb-4">{state.fact}</div>
        <div className="flex justify-center gap-3">
          {state.examples.map(ex => (
            <div key={ex.name} className="text-center">
              <div className="text-2xl">{ex.emoji}</div>
              <div className="text-[10px] font-bold">{ex.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => { const i = (index - 1 + 3) % 3; setIndex(i); speak(STATES_OF_MATTER[i].fact); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
        <button onClick={() => speak(state.fact)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
        <button onClick={() => { const i = (index + 1) % 3; setIndex(i); speak(STATES_OF_MATTER[i].fact); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
      </div>
    </div>
  );
}

function SortMatter() {
  const allExamples = STATES_OF_MATTER.flatMap(s => s.examples.map(e => ({ ...e, state: s.name })));
  const [items, setItems] = useState(() => [...allExamples].sort(() => Math.random() - 0.5).slice(0, 6));
  const [placed, setPlaced] = useState<Record<string, string[]>>({ Solid: [], Liquid: [], Gas: [] });
  const [score, setScore] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  function dropInto(item: typeof allExamples[0], stateName: string) {
    if (item.state === stateName) {
      setPlaced(prev => ({ ...prev, [stateName]: [...prev[stateName], item.emoji] }));
      setItems(prev => prev.filter(i => i !== item));
      addStars(1);
      setScore(s => s + 1);
      speak("Yes! Great sorting!");
    } else {
      setWrongFlash(item.emoji);
      speak("Try a different box!");
      setTimeout(() => setWrongFlash(null), 600);
    }
  }

  function reset() {
    setItems([...allExamples].sort(() => Math.random() - 0.5).slice(0, 6));
    setPlaced({ Solid: [], Liquid: [], Gas: [] });
  }

  const allSorted = items.length === 0;

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} sorted</div>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Tap an item, then tap solid, liquid, or gas!</p>

      <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-16">
        {items.map((item, i) => (
          <ItemPicker key={i} item={item} onChoose={(s) => dropInto(item, s)} flashWrong={wrongFlash === item.emoji} />
        ))}
        {allSorted && <p className="text-xl font-bold">🎉 All sorted! Great job!</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATES_OF_MATTER.map(s => (
          <div key={s.name} className="rounded-2xl bg-mint/30 p-4 min-h-24">
            <div className="font-bold text-sm mb-2">{s.emoji} {s.name}</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {placed[s.name].map((e, i) => <span key={i} className="text-2xl">{e}</span>)}
            </div>
          </div>
        ))}
      </div>

      {allSorted && (
        <button onClick={reset} className="mt-4 rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Play Again →</button>
      )}
    </div>
  );
}

function ItemPicker({ item, onChoose, flashWrong }: { item: { name: string; emoji: string }; onChoose: (s: string) => void; flashWrong: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`text-3xl rounded-xl p-2 transition ${flashWrong ? "bg-red-200" : "bg-butter/40 hover:scale-110"}`}>
        {item.emoji}
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-xl shadow-lg p-2 z-10">
          {STATES_OF_MATTER.map(s => (
            <button key={s.name} onClick={() => { onChoose(s.name); setOpen(false); }}
              className="rounded-lg bg-lilac/30 px-2 py-1 text-xs font-bold whitespace-nowrap">
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MatterQuiz() {
  const allExamples = STATES_OF_MATTER.flatMap(s => s.examples.map(e => ({ ...e, state: s.name })));
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const item = allExamples[round % allExamples.length];
  const options = (() => {
    const others = STATES_OF_MATTER.map(s => s.name).filter(n => n !== item.state);
    return [item.state, ...others].sort(() => Math.random() - 0.5);
  })();

  function pick(name: string) {
    if (selected) return;
    setSelected(name);
    if (name === item.state) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! ${item.name} is a ${item.state}!`);
    } else {
      speak(`${item.name} is a ${item.state}.`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <div className="text-5xl mb-2">{item.emoji}</div>
      <p className="mb-4 text-lg font-bold">Is {item.name} a solid, liquid, or gas?</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {options.map(name => {
          const showState = selected !== null;
          const isCorrect = name === item.state;
          const stateInfo = STATES_OF_MATTER.find(s => s.name === name)!;
          return (
            <button key={name} onClick={() => pick(name)} disabled={!!selected}
              className={`rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === name ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              <div className="text-2xl mb-1">{stateInfo.emoji}</div>
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
