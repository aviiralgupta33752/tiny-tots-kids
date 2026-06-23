import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "plants" | "seasons";

const PLANT_STAGES = [
  { name: "Seed",     emoji: "🌰", note: "It all starts with a tiny seed!" },
  { name: "Sprout",   emoji: "🌱", note: "The seed grows roots and a little sprout." },
  { name: "Seedling", emoji: "🌿", note: "Leaves grow bigger to catch sunlight." },
  { name: "Flower",   emoji: "🌷", note: "A flower blooms to attract bees!" },
  { name: "Fruit",    emoji: "🍎", note: "Fruit grows, with new seeds inside!" },
];

const PLANT_NEEDS = [
  { name: "Sunlight", emoji: "☀️" },
  { name: "Water",    emoji: "💧" },
  { name: "Soil",     emoji: "🟤" },
  { name: "Air",      emoji: "💨" },
];

const SEASONS = [
  { name: "Spring", emoji: "🌸", note: "Flowers bloom and baby animals are born!" },
  { name: "Summer", emoji: "☀️", note: "Hot days, swimming, and long sunny evenings!" },
  { name: "Fall",   emoji: "🍂", note: "Leaves change color and fall from the trees." },
  { name: "Winter", emoji: "❄️", note: "Cold weather, snow, and cozy sweaters!" },
];

export function PlantsAndSeasons() {
  const [mode, setMode] = useState<Mode>("plants");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("plants")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "plants" ? "bg-pink text-white" : "bg-muted"}`}>
          🌱 Plants
        </button>
        <button onClick={() => setMode("seasons")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "seasons" ? "bg-pink text-white" : "bg-muted"}`}>
          🍂 Seasons
        </button>
      </div>
      {mode === "plants" ? <PlantsMode /> : <SeasonsMode />}
    </div>
  );
}

function PlantsMode() {
  const [stage, setStage] = useState(0);
  const current = PLANT_STAGES[stage];

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">How a plant grows, step by step!</p>
      <div className="rounded-3xl bg-mint/30 p-8 mb-4">
        <div className="text-6xl mb-3">{current.emoji}</div>
        <div className="font-display text-2xl font-bold mb-1">{current.name}</div>
        <div className="text-sm text-muted-foreground">{current.note}</div>
      </div>
      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => { const i = Math.max(0, stage - 1); setStage(i); speak(PLANT_STAGES[i].note); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
        <button onClick={() => speak(current.note)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
        <button onClick={() => { const i = Math.min(PLANT_STAGES.length - 1, stage + 1); setStage(i); speak(PLANT_STAGES[i].note); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {PLANT_STAGES.map((s, i) => (
          <button key={s.name} onClick={() => { setStage(i); speak(s.note); }}
            className={`text-2xl rounded-xl p-2 transition ${i === stage ? "bg-pink/30 scale-110" : "bg-muted/40"}`}>
            {s.emoji}
          </button>
        ))}
      </div>
      <p className="mb-3 font-bold text-sm">What do plants need to grow?</p>
      <div className="flex justify-center gap-3">
        {PLANT_NEEDS.map(n => (
          <button key={n.name} onClick={() => speak(`Plants need ${n.name.toLowerCase()} to grow!`)}
            className="rounded-2xl bg-butter/40 p-3 hover:scale-105 transition">
            <div className="text-2xl">{n.emoji}</div>
            <div className="text-xs font-bold">{n.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SeasonsMode() {
  const [index, setIndex] = useState(0);
  const season = SEASONS[index];
  return (
    <div className="text-center">
      <div className="rounded-3xl bg-sky/20 p-8 mb-4">
        <div className="text-6xl mb-3">{season.emoji}</div>
        <div className="font-display text-2xl font-bold mb-1">{season.name}</div>
        <div className="text-sm text-muted-foreground">{season.note}</div>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => { const i = (index - 1 + 4) % 4; setIndex(i); speak(SEASONS[i].note); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
        <button onClick={() => speak(season.note)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
        <button onClick={() => { const i = (index + 1) % 4; setIndex(i); speak(SEASONS[i].note); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
      </div>
      <div className="flex justify-center gap-2">
        {SEASONS.map((s, i) => (
          <button key={s.name} onClick={() => { setIndex(i); speak(s.note); }}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
