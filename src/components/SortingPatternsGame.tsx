import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "sorting" | "patterns";

// --- Sorting: group items by category ---
interface SortItem { emoji: string; category: string; }
const SORT_CATEGORIES = ["Animals", "Fruits", "Shapes"];
const SORT_ITEMS: SortItem[] = [
  { emoji: "🐶", category: "Animals" }, { emoji: "🐱", category: "Animals" }, { emoji: "🐸", category: "Animals" },
  { emoji: "🍎", category: "Fruits" }, { emoji: "🍌", category: "Fruits" }, { emoji: "🍇", category: "Fruits" },
  { emoji: "⭐", category: "Shapes" }, { emoji: "🔺", category: "Shapes" }, { emoji: "⬛", category: "Shapes" },
];

// --- Patterns: what comes next? ---
interface PatternRound { sequence: string[]; answer: string; options: string[]; }
const PATTERN_ROUNDS: PatternRound[] = [
  { sequence: ["🔴","🔵","🔴","🔵","🔴"], answer: "🔵", options: ["🔵","🟢","🟡"] },
  { sequence: ["🐶","🐱","🐶","🐱","🐶"], answer: "🐱", options: ["🐱","🐸","🐦"] },
  { sequence: ["⭐","⭐","🌙","⭐","⭐"], answer: "🌙", options: ["🌙","☀️","⭐"] },
  { sequence: ["🟦","🟦","🟨","🟦","🟦"], answer: "🟨", options: ["🟨","🟥","🟩"] },
  { sequence: ["🍎","🍌","🍎","🍌","🍎"], answer: "🍌", options: ["🍌","🍇","🍓"] },
  { sequence: ["1️⃣","2️⃣","1️⃣","2️⃣","1️⃣"], answer: "2️⃣", options: ["2️⃣","3️⃣","1️⃣"] },
];

function SortingMode() {
  const [items, setItems] = useState(() => [...SORT_ITEMS].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState<Record<string, string[]>>({ Animals: [], Fruits: [], Shapes: [] });
  const [score, setScore] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  function dropInto(item: SortItem, category: string) {
    if (item.category === category) {
      setPlaced(prev => ({ ...prev, [category]: [...prev[category], item.emoji] }));
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
    setItems([...SORT_ITEMS].sort(() => Math.random() - 0.5));
    setPlaced({ Animals: [], Fruits: [], Shapes: [] });
  }

  const allSorted = items.length === 0;

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} sorted</div>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Tap an item, then tap the box it belongs in!</p>

      <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-16">
        {items.map((item, i) => (
          <ItemPicker key={i} item={item} onChoose={(cat) => dropInto(item, cat)} flashWrong={wrongFlash === item.emoji} />
        ))}
        {allSorted && <p className="text-xl font-bold">🎉 All sorted! Great job!</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SORT_CATEGORIES.map(cat => (
          <div key={cat} className="rounded-2xl bg-mint/30 p-4 min-h-24">
            <div className="font-bold text-sm mb-2">{cat}</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {placed[cat].map((e, i) => <span key={i} className="text-2xl">{e}</span>)}
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

function ItemPicker({ item, onChoose, flashWrong }: { item: SortItem; onChoose: (cat: string) => void; flashWrong: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`text-3xl rounded-xl p-2 transition ${flashWrong ? "bg-red-200" : "bg-butter/40 hover:scale-110"}`}>
        {item.emoji}
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-xl shadow-lg p-2 z-10">
          {SORT_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { onChoose(cat); setOpen(false); }}
              className="rounded-lg bg-lilac/30 px-2 py-1 text-xs font-bold whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PatternsMode() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const current = PATTERN_ROUNDS[round % PATTERN_ROUNDS.length];

  function pick(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak("Yes! You found the pattern!");
    } else {
      speak(`Good try! The answer was ${current.answer}`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} patterns found</div>
      <p className="mb-4 text-lg font-bold">What comes next?</p>

      <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
        {current.sequence.map((e, i) => (
          <span key={i} className="text-4xl">{e}</span>
        ))}
        <span className="text-4xl rounded-xl bg-muted px-2">❓</span>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {current.options.map(opt => {
          const showState = selected !== null;
          const isCorrect = opt === current.answer;
          return (
            <button key={opt} onClick={() => pick(opt)} disabled={!!selected}
              className={`text-4xl rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === opt ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {opt}
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

export function SortingPatternsGame() {
  const [mode, setMode] = useState<Mode>("sorting");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("sorting")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "sorting" ? "bg-pink text-white" : "bg-muted"}`}>
          🗂️ Sorting
        </button>
        <button onClick={() => setMode("patterns")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "patterns" ? "bg-pink text-white" : "bg-muted"}`}>
          🔁 Patterns
        </button>
      </div>
      {mode === "sorting" ? <SortingMode /> : <PatternsMode />}
    </div>
  );
}
