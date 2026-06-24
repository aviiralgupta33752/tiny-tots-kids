import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "states" | "countries" | "quiz";

interface Place { name: string; emoji: string; fact: string; }

const FAMOUS_STATES: Place[] = [
  { name: "California", emoji: "🌴", fact: "California is on the west coast and has Hollywood and the Golden Gate Bridge!" },
  { name: "Texas",       emoji: "🤠", fact: "Texas is the second largest state and known for cowboys and BBQ!" },
  { name: "New York",    emoji: "🗽", fact: "New York has the Statue of Liberty and a huge city with tall buildings!" },
  { name: "Florida",     emoji: "🐊", fact: "Florida is shaped like a boot and has sunny beaches and alligators!" },
  { name: "Arizona",     emoji: "🌵", fact: "Arizona has the Grand Canyon and lots of desert with cactus plants!" },
  { name: "Hawaii",      emoji: "🌺", fact: "Hawaii is a group of islands in the ocean with volcanoes and beaches!" },
];

const COUNTRIES: Place[] = [
  { name: "United States", emoji: "🇺🇸", fact: "The United States has 50 states and the bald eagle is its symbol!" },
  { name: "Mexico",        emoji: "🇲🇽", fact: "Mexico is south of the United States and famous for tacos and pyramids!" },
  { name: "Canada",        emoji: "🇨🇦", fact: "Canada is north of the United States and has maple syrup and moose!" },
  { name: "France",        emoji: "🇫🇷", fact: "France is in Europe and home to the Eiffel Tower!" },
  { name: "Japan",         emoji: "🇯🇵", fact: "Japan is an island country in Asia known for sushi and cherry blossoms!" },
  { name: "Egypt",         emoji: "🇪🇬", fact: "Egypt is in Africa and famous for ancient pyramids and the Nile River!" },
];

export function StatesCountries() {
  const [mode, setMode] = useState<Mode>("states");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("states")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "states" ? "bg-pink text-white" : "bg-muted"}`}>
          🗽 States
        </button>
        <button onClick={() => setMode("countries")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "countries" ? "bg-pink text-white" : "bg-muted"}`}>
          🌍 Countries
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>
      {mode === "states" && <PlaceExplorer places={FAMOUS_STATES} title="U.S. States" />}
      {mode === "countries" && <PlaceExplorer places={COUNTRIES} title="World Countries" />}
      {mode === "quiz" && <PlaceQuiz />}
    </div>
  );
}

function PlaceExplorer({ places, title }: { places: Place[]; title: string }) {
  const [index, setIndex] = useState(0);
  const place = places[index];

  return (
    <div className="text-center">
      <p className="mb-2 text-sm font-semibold text-muted-foreground">{title}</p>
      <div className="rounded-3xl bg-sky/20 p-8 mb-4">
        <div className="text-6xl mb-3">{place.emoji}</div>
        <div className="font-display text-2xl font-bold mb-2">{place.name}</div>
        <div className="text-sm text-muted-foreground">{place.fact}</div>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => { const i = (index - 1 + places.length) % places.length; setIndex(i); speak(places[i].fact); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
        <button onClick={() => speak(place.fact)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
        <button onClick={() => { const i = (index + 1) % places.length; setIndex(i); speak(places[i].fact); }}
          className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {places.map((p, i) => (
          <button key={p.name} onClick={() => { setIndex(i); speak(p.fact); }}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
            {p.emoji} {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlaceQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const ALL = [...FAMOUS_STATES, ...COUNTRIES];
  const place = ALL[round % ALL.length];
  const options = (() => {
    const others = ALL.filter(p => p.name !== place.name).map(p => p.emoji).sort(() => Math.random() - 0.5).slice(0, 2);
    return [place.emoji, ...others].sort(() => Math.random() - 0.5);
  })();

  function pick(emoji: string) {
    if (selected) return;
    setSelected(emoji);
    if (emoji === place.emoji) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! That's ${place.name}!`);
    } else {
      speak(`That's ${place.name}.`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <p className="mb-4 text-lg font-bold">Which flag/symbol matches <span className="text-pink">{place.name}</span>?</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {options.map(emoji => {
          const showState = selected !== null;
          const isCorrect = emoji === place.emoji;
          return (
            <button key={emoji} onClick={() => pick(emoji)} disabled={!!selected}
              className={`text-4xl rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === emoji ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {emoji}
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
