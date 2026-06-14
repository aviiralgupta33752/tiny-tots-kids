import { useState, useEffect, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { SIGHT_WORDS, BODY_PARTS, EMOTIONS, TONES, toneClass } from "@/lib/learn-data";
import type { Difficulty } from "@/lib/rewards";

// ── Sight Words ───────────────────────────────────────────────────────────────
export function SightWordsGame({ difficulty }: { difficulty: Difficulty }) {
  const pool = difficulty === "easy" ? SIGHT_WORDS.slice(0,15) : difficulty === "medium" ? SIGHT_WORDS.slice(0,30) : SIGHT_WORDS;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const shuffled = useRef([...pool].sort(() => Math.random() - 0.5));
  const word = shuffled.current[index % shuffled.current.length];

  // Make 3 wrong options + correct
  function getOptions() {
    const wrong = pool.filter(w => w !== word).sort(() => Math.random() - 0.5).slice(0, 3);
    return [word, ...wrong].sort(() => Math.random() - 0.5);
  }
  const options = useRef(getOptions());

  useEffect(() => {
    setTimeout(() => speak(`Which one says... ${word}?`), 400);
  }, [index]);

  function pick(w: string) {
    if (picked) return;
    setPicked(w);
    if (w === word) {
      addStars(1); setScore(s => s + 1);
      speak(`Yes! That word says ${word}! Great reading!`);
    } else {
      speak(`The word is ${word}! Try again next time!`);
    }
  }

  function next() {
    setIndex(i => {
      const next = i + 1;
      if (next >= shuffled.current.length) shuffled.current = [...pool].sort(() => Math.random() - 0.5);
      return next;
    });
    setPicked(null);
    options.current = getOptions();
  }

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      <div className="mb-3 text-sm font-bold text-muted-foreground">⭐ {score} correct · Word {(index % pool.length) + 1} of {pool.length}</div>
      <p className="mb-2 text-sm font-semibold">Listen and find the word!</p>
      <button onClick={() => speak(`Which one says... ${word}?`)}
        className="mb-6 rounded-2xl bg-lilac px-6 py-3 font-bold">
        🔊 Hear it again
      </button>
      <div className="grid grid-cols-2 gap-4">
        {options.current.map(w => (
          <button key={w} onClick={() => pick(w)} disabled={!!picked}
            className={`rounded-2xl py-6 font-display text-3xl font-bold transition-all ${
              picked === null ? "bg-butter hover:scale-105 cursor-pointer" :
              w === word ? "bg-mint scale-105 shadow-md" :
              w === picked ? "bg-pink/60" : "bg-muted opacity-50"
            }`}>
            {w}
          </button>
        ))}
      </div>
      {picked && (
        <div className="mt-4">
          <p className="mb-3 text-xl font-bold">{picked === word ? "🎉 You read it!" : `The word was "${word}"`}</p>
          <button onClick={next} className="rounded-2xl bg-sky px-8 py-3 font-bold">Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Phonics ───────────────────────────────────────────────────────────────────
const PHONICS = [
  { letter: "A", sound: "ah",  example: "Apple",  emoji: "🍎" },
  { letter: "B", sound: "buh", example: "Ball",   emoji: "⚽" },
  { letter: "C", sound: "kuh", example: "Cat",    emoji: "🐱" },
  { letter: "D", sound: "duh", example: "Dog",    emoji: "🐶" },
  { letter: "E", sound: "eh",  example: "Egg",    emoji: "🥚" },
  { letter: "F", sound: "fuh", example: "Fish",   emoji: "🐟" },
  { letter: "G", sound: "guh", example: "Grape",  emoji: "🍇" },
  { letter: "H", sound: "huh", example: "Hat",    emoji: "🎩" },
  { letter: "I", sound: "ih",  example: "Igloo",  emoji: "🏔️" },
  { letter: "J", sound: "juh", example: "Jar",    emoji: "🫙" },
  { letter: "K", sound: "kuh", example: "Kite",   emoji: "🪁" },
  { letter: "L", sound: "luh", example: "Lion",   emoji: "🦁" },
  { letter: "M", sound: "muh", example: "Moon",   emoji: "🌙" },
  { letter: "N", sound: "nuh", example: "Nest",   emoji: "🪺" },
  { letter: "O", sound: "oh",  example: "Orange", emoji: "🍊" },
  { letter: "P", sound: "puh", example: "Pig",    emoji: "🐷" },
  { letter: "R", sound: "ruh", example: "Rain",   emoji: "🌧️" },
  { letter: "S", sound: "sss", example: "Sun",    emoji: "☀️" },
  { letter: "T", sound: "tuh", example: "Tree",   emoji: "🌳" },
  { letter: "W", sound: "wuh", example: "Wave",   emoji: "🌊" },
];

export function PhonicsGame({ difficulty }: { difficulty: Difficulty }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const shuffled = useRef([...PHONICS].sort(() => Math.random() - 0.5));
  const current = shuffled.current[index % shuffled.current.length];

  // Make 4 options — the correct sound + 3 wrong
  function getOptions() {
    const wrong = PHONICS.filter(p => p.letter !== current.letter)
      .sort(() => Math.random() - 0.5).slice(0, 3).map(p => p.sound);
    return [current.sound, ...wrong].sort(() => Math.random() - 0.5);
  }
  const options = useRef(getOptions());

  function sayLetter() {
    speak(`The letter ${current.letter} makes the sound... ${current.sound}. Like in ${current.example}!`);
  }

  function pick(sound: string) {
    if (picked) return;
    setPicked(sound);
    if (sound === current.sound) {
      addStars(1); setScore(s => s + 1);
      speak(`Yes! ${current.letter} says ${current.sound}! Like ${current.example}!`);
    } else {
      speak(`Almost! ${current.letter} says ${current.sound}!`);
    }
  }

  function next() {
    setIndex(i => i + 1);
    setPicked(null);
    options.current = getOptions();
  }

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      <div className="mb-3 text-sm font-bold text-muted-foreground">⭐ {score} correct</div>
      <p className="mb-2 text-sm font-semibold">What sound does this letter make?</p>
      <button onClick={sayLetter}
        className="mb-2 rounded-3xl bg-pink px-8 py-6 font-display text-8xl font-bold shadow-md hover:scale-105 transition">
        {current.letter}
      </button>
      <p className="mb-4 text-4xl">{current.emoji}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.current.map(s => (
          <button key={s} onClick={() => pick(s)} disabled={!!picked}
            className={`rounded-2xl py-4 font-display text-2xl font-bold transition ${
              picked === null ? "bg-sky hover:scale-105" :
              s === current.sound ? "bg-mint scale-105" :
              s === picked ? "bg-pink/60" : "bg-muted opacity-50"
            }`}>
            "{s}"
          </button>
        ))}
      </div>
      {picked && (
        <div>
          <p className="mb-3 text-lg font-bold">
            {picked === current.sound
              ? `🎉 Yes! ${current.letter} says "${current.sound}"!`
              : `💡 ${current.letter} says "${current.sound}" — like in ${current.example}!`}
          </p>
          <button onClick={next} className="rounded-2xl bg-lilac px-8 py-3 font-bold">Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Memory Card Game ──────────────────────────────────────────────────────────
const CARD_ITEMS = [
  { id: "cat",    emoji: "🐱" }, { id: "dog",   emoji: "🐶" },
  { id: "star",   emoji: "⭐" }, { id: "sun",   emoji: "☀️" },
  { id: "heart",  emoji: "❤️" }, { id: "moon",  emoji: "🌙" },
  { id: "apple",  emoji: "🍎" }, { id: "cake",  emoji: "🎂" },
];

interface Card { id: string; emoji: string; uid: number; }

function makeCards(difficulty: Difficulty): Card[] {
  const count = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;
  const items = CARD_ITEMS.slice(0, count);
  const pairs = [...items, ...items].map((item, i) => ({ ...item, uid: i }));
  return pairs.sort(() => Math.random() - 0.5);
}

export function MemoryGame({ difficulty }: { difficulty: Difficulty }) {
  const [cards, setCards] = useState<Card[]>(() => makeCards(difficulty));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const checking = useRef(false);

  function flip(uid: number) {
    if (checking.current) return;
    if (flipped.includes(uid)) return;
    if (flipped.length === 2) return;
    const card = cards.find(c => c.uid === uid)!;
    if (matched.includes(card.id)) return;

    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      checking.current = true;
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(id => cards.find(c => c.uid === id)!);
      if (a.id === b.id) {
        const newMatched = [...matched, a.id];
        setMatched(newMatched);
        setFlipped([]);
        checking.current = false;
        speak("Great match!");
        addStars(1);
        if (newMatched.length === cards.length / 2) {
          setWon(true);
          addStars(3);
          speak("Amazing! You matched them all!");
        }
      } else {
        setTimeout(() => { setFlipped([]); checking.current = false; }, 1000);
      }
    }
  }

  function restart() {
    setCards(makeCards(difficulty));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  }

  const cols = difficulty === "easy" ? "grid-cols-4" : difficulty === "medium" ? "grid-cols-4" : "grid-cols-4";

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      <div className="mb-3 flex justify-between text-sm font-bold">
        <span>🔄 Moves: {moves}</span>
        <span>✅ Matched: {matched.length}/{cards.length/2}</span>
      </div>

      {won ? (
        <div className="py-8">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <p className="text-2xl font-bold mb-2">You matched them all!</p>
          <p className="text-muted-foreground mb-6">In {moves} moves!</p>
          <button onClick={restart} className="rounded-2xl bg-mint px-8 py-3 font-bold text-lg">Play again!</button>
        </div>
      ) : (
        <>
          <div className={`grid ${cols} gap-3 mb-4`}>
            {cards.map(card => {
              const isFlipped = flipped.includes(card.uid) || matched.includes(card.id);
              return (
                <button
                  key={card.uid}
                  onClick={() => flip(card.uid)}
                  className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 ${
                    isFlipped
                      ? matched.includes(card.id) ? "bg-mint scale-95" : "bg-butter scale-105"
                      : "bg-sky hover:scale-105 hover:bg-lilac"
                  }`}
                >
                  {isFlipped ? card.emoji : "❓"}
                </button>
              );
            })}
          </div>
          <button onClick={restart} className="rounded-xl bg-muted px-4 py-2 text-sm font-bold">↻ Restart</button>
        </>
      )}
    </div>
  );
}

// ── Body Parts ────────────────────────────────────────────────────────────────
export function BodyPartsGame() {
  const [selected, setSelected] = useState<typeof BODY_PARTS[0] | null>(null);

  function tap(part: typeof BODY_PARTS[0]) {
    setSelected(part);
    speak(`${part.name}! ${part.fact}`);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Tap a body part to learn about it!</p>
      {selected && (
        <div className="mb-6 rounded-3xl bg-mint/40 p-4">
          <div className="text-5xl mb-2">{selected.emoji}</div>
          <p className="font-bold text-xl">{selected.name}</p>
          <p className="text-muted-foreground">{selected.fact}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BODY_PARTS.map((part, i) => (
          <button key={part.name} onClick={() => tap(part)}
            className={`card-soft rounded-2xl p-4 text-center transition hover:scale-105 ${toneClass(TONES[i % TONES.length])}`}>
            <div className="text-4xl mb-1">{part.emoji}</div>
            <div className="font-bold">{part.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Emotions ──────────────────────────────────────────────────────────────────
export function EmotionsGame() {
  const [selected, setSelected] = useState<typeof EMOTIONS[0] | null>(null);
  const [quiz, setQuiz] = useState(false);
  const [quizEmotion] = useState(() => EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);
  const [picked, setPicked] = useState<string | null>(null);

  function tap(emotion: typeof EMOTIONS[0]) {
    setSelected(emotion);
    speak(`${emotion.name}! ${emotion.description}`);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="mb-4 flex justify-center gap-2">
        <button onClick={() => { setQuiz(false); setPicked(null); }}
          className={`rounded-xl px-4 py-2 font-bold text-sm ${!quiz ? "bg-foreground text-background" : "bg-muted"}`}>
          🎭 Learn
        </button>
        <button onClick={() => setQuiz(true)}
          className={`rounded-xl px-4 py-2 font-bold text-sm ${quiz ? "bg-foreground text-background" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>

      {!quiz ? (
        <>
          <p className="mb-4 text-sm font-semibold text-muted-foreground">Tap a face to learn about feelings!</p>
          {selected && (
            <div className="mb-4 rounded-3xl p-4" style={{ background: selected.color }}>
              <div className="text-5xl mb-1">{selected.emoji}</div>
              <p className="font-bold text-xl">{selected.name}</p>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>
          )}
          <div className="grid grid-cols-4 gap-3">
            {EMOTIONS.map(e => (
              <button key={e.name} onClick={() => tap(e)}
                className="rounded-2xl p-3 transition hover:scale-110"
                style={{ background: e.color }}>
                <div className="text-4xl">{e.emoji}</div>
                <div className="text-xs font-bold mt-1">{e.name}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <p className="mb-2 font-semibold">How does this face feel?</p>
          <div className="mb-6 text-8xl">{quizEmotion.emoji}</div>
          <div className="grid grid-cols-2 gap-3">
            {[quizEmotion, ...EMOTIONS.filter(e => e.name !== quizEmotion.name).sort(() => Math.random() - 0.5).slice(0,3)]
              .sort(() => Math.random() - 0.5)
              .map(e => (
                <button key={e.name} onClick={() => { setPicked(e.name); if (e.name === quizEmotion.name) { addStars(1); speak(`Yes! That face is ${e.name}!`); } else speak(`That face is ${quizEmotion.name}!`); }}
                  disabled={!!picked}
                  className={`rounded-2xl py-3 font-bold transition ${
                    picked === null ? "bg-butter hover:scale-105" :
                    e.name === quizEmotion.name ? "bg-mint scale-105" :
                    e.name === picked ? "bg-pink/60" : "bg-muted opacity-50"
                  }`}>
                  {e.name}
                </button>
              ))}
          </div>
          {picked && (
            <button onClick={() => { setPicked(null); window.location.reload(); }}
              className="mt-4 rounded-2xl bg-sky px-6 py-3 font-bold">
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Weather & Calendar ────────────────────────────────────────────────────────
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEATHER = [
  { name: "Sunny",  emoji: "☀️",  desc: "It is warm and bright!" },
  { name: "Cloudy", emoji: "☁️",  desc: "The sky is full of clouds!" },
  { name: "Rainy",  emoji: "🌧️", desc: "Don't forget your umbrella!" },
  { name: "Snowy",  emoji: "❄️",  desc: "Time to build a snowman!" },
  { name: "Windy",  emoji: "🌬️", desc: "Hold onto your hat!" },
  { name: "Stormy", emoji: "⛈️", desc: "Stay inside and stay safe!" },
];

export function WeatherCalendar() {
  const now = new Date();
  const [pickedWeather, setPickedWeather] = useState<typeof WEATHER[0] | null>(null);
  useEffect(() => {
    const day = DAYS[now.getDay()]; const month = MONTHS[now.getMonth()];
    setTimeout(() => speak(`Today is ${day}, ${month} ${now.getDate()}! What is the weather like today?`), 400);
  }, []);

  const day = DAYS[now.getDay()];
  const month = MONTHS[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  function sayDate() {
    speak(`Today is ${day}, ${month} ${date}, ${year}.`);
  }

  function pickWeather(w: typeof WEATHER[0]) {
    setPickedWeather(w);
    speak(`The weather is ${w.name}! ${w.desc}`);
  }

  return (
    <div className="card-soft mx-auto max-w-lg p-6 text-center">
      {/* Calendar */}
      <div className="mb-6 rounded-3xl bg-sky/40 p-6">
        <p className="text-sm font-semibold text-muted-foreground mb-2">📅 Today is...</p>
        <button onClick={sayDate} className="hover:scale-105 transition">
          <div className="font-display text-3xl font-bold">{day}</div>
          <div className="text-xl text-muted-foreground">{month} {date}, {year}</div>
          <div className="mt-1 text-xs text-muted-foreground">Tap to hear 🔊</div>
        </button>
      </div>

      {/* Weather picker */}
      <p className="mb-3 font-semibold">What's the weather like today?</p>
      {pickedWeather && (
        <div className="mb-4 rounded-2xl bg-butter/40 p-3">
          <div className="text-4xl">{pickedWeather.emoji}</div>
          <p className="font-bold">{pickedWeather.name}</p>
          <p className="text-sm text-muted-foreground">{pickedWeather.desc}</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {WEATHER.map(w => (
          <button key={w.name} onClick={() => pickWeather(w)}
            className={`rounded-2xl p-3 transition hover:scale-110 ${pickedWeather?.name === w.name ? "ring-4 ring-foreground" : "bg-muted"}`}>
            <div className="text-3xl">{w.emoji}</div>
            <div className="text-xs font-bold mt-1">{w.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
