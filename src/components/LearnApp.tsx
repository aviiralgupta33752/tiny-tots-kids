import { useEffect, useRef, useState } from "react";
import { ALPHABET, ANIMALS, COLORS, NUMBERS, SHAPES, TONES, speak, toneClass, type Tone } from "@/lib/learn-data";
import { StoryTime } from "@/components/StoryTime";
import { addStars, earnedStickers, useStars } from "@/lib/rewards";

type TabKey = "abc" | "123" | "colors" | "shapes" | "animals" | "story" | "trace" | "match" | "quiz" | "rewards";

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: "abc", label: "ABCs", emoji: "🔤" },
  { key: "123", label: "123s", emoji: "🔢" },
  { key: "colors", label: "Colors", emoji: "🎨" },
  { key: "shapes", label: "Shapes", emoji: "⭐" },
  { key: "animals", label: "Animals", emoji: "🐾" },
  { key: "story", label: "Stories", emoji: "📖" },
  { key: "trace", label: "Trace", emoji: "✏️" },
  { key: "match", label: "Match", emoji: "🧩" },
  { key: "quiz", label: "Quiz", emoji: "❓" },
  { key: "rewards", label: "Rewards", emoji: "🏆" },
];

export function LearnApp() {
  const [tab, setTab] = useState<TabKey>("abc");

  return (
    <div className="min-h-screen px-4 pb-16 pt-6 sm:px-8">
      <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink text-2xl shadow-md">🌈</div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Tiny Tots</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Tap, listen, learn — together.</p>
          </div>
        </div>
        <div className="hidden rounded-full bg-card px-4 py-2 text-sm shadow-sm sm:block">
          Made with 💛 for little learners
        </div>
      </header>

      <nav className="mx-auto mb-8 max-w-6xl">
        <div className="card-soft flex flex-wrap gap-2 p-2">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 min-w-[100px] rounded-xl px-3 py-3 text-sm font-semibold transition-all sm:text-base ${
                  active
                    ? "bg-foreground text-background shadow-md scale-[1.02]"
                    : "hover:bg-muted text-foreground/80"
                }`}
              >
                <span className="mr-1.5">{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl">
        {tab === "abc" && <AlphabetGrid />}
        {tab === "123" && <NumberGrid />}
        {tab === "colors" && <ColorGrid />}
        {tab === "shapes" && <ShapeGrid />}
        {tab === "animals" && <AnimalGrid />}
        {tab === "trace" && <TracePanel />}
        {tab === "match" && <MatchGame />}
        {tab === "quiz" && <QuizGame />}
      </main>
    </div>
  );
}

function Tile({
  tone,
  onClick,
  children,
  big,
}: {
  tone: Tone;
  onClick: () => void;
  children: React.ReactNode;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`tile-pop tile-pop-hover card-soft ${toneClass(tone)} relative flex flex-col items-center justify-center gap-2 p-4 text-foreground/90 ${
        big ? "aspect-square" : "aspect-[4/5]"
      }`}
    >
      {children}
    </button>
  );
}

function AlphabetGrid() {
  return (
    <Section title="The Alphabet" subtitle="Tap a letter to hear it and the word.">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {ALPHABET.map((a, i) => (
          <Tile
            key={a.letter}
            tone={TONES[i % TONES.length]}
            onClick={() => speak(`${a.letter}. ${a.word}.`)}
          >
            <span className="text-5xl font-bold font-display sm:text-6xl">{a.letter}</span>
            <span className="text-3xl">{a.emoji}</span>
            <span className="text-xs font-semibold sm:text-sm">{a.word}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

function NumberGrid() {
  return (
    <Section title="Numbers 1 to 10" subtitle="Count along out loud.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {NUMBERS.map((n, i) => (
          <Tile
            key={n.n}
            tone={TONES[i % TONES.length]}
            onClick={() => speak(`${n.n}. ${n.word}.`)}
            big
          >
            <span className="text-6xl font-bold font-display sm:text-7xl">{n.n}</span>
            <span className="text-lg">{n.emoji}</span>
            <span className="text-sm font-semibold capitalize">{n.word}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

function ColorGrid() {
  return (
    <Section title="Colors" subtitle="Tap a color to hear its name.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => speak(c.name)}
            className="card-soft tile-pop tile-pop-hover flex flex-col items-center gap-3 p-5"
          >
            <div
              className="grid h-28 w-28 place-items-center rounded-full text-5xl shadow-inner"
              style={{ backgroundColor: c.hex }}
            >
              {c.emoji}
            </div>
            <span className="text-lg font-bold font-display">{c.name}</span>
          </button>
        ))}
      </div>
    </Section>
  );
}

function ShapeGrid() {
  return (
    <Section title="Shapes" subtitle="Tap a shape to hear its name.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
        {SHAPES.map((s, i) => (
          <Tile key={s.name} tone={TONES[i % TONES.length]} onClick={() => speak(s.name)} big>
            <svg viewBox="0 0 100 100" className="h-28 w-28 fill-foreground/85">
              {s.svg}
            </svg>
            <span className="text-xl font-bold font-display">{s.name}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

function AnimalGrid() {
  return (
    <Section title="Animal Sounds" subtitle="Tap an animal to hear what it says.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {ANIMALS.map((a, i) => (
          <Tile
            key={a.name}
            tone={TONES[i % TONES.length]}
            onClick={() => speak(`${a.name} says ${a.sound}!`)}
            big
          >
            <span className="text-7xl">{a.emoji}</span>
            <span className="text-lg font-bold font-display">{a.name}</span>
            <span className="text-xs text-foreground/70">says “{a.sound}”</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Tracing ---------- */
function TracePanel() {
  const [letter, setLetter] = useState("A");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  useEffect(() => { clear(); }, [letter]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  }
  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ff6fa0";
    ctx.stroke();
  }
  function end() { drawing.current = false; }
  function clear() {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
  }

  return (
    <Section title="Trace a Letter" subtitle="Use your finger or mouse to trace the letter.">
      <div className="card-soft grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl bg-butter/40">
          <div className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[18rem] font-bold leading-none text-foreground/15 select-none">
            {letter}
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="absolute inset-0 h-full w-full touch-none rounded-2xl"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Choose a letter</p>
          <div className="grid max-h-[28rem] w-full grid-cols-6 gap-1.5 overflow-auto md:w-56 md:grid-cols-4">
            {ALPHABET.map((a) => (
              <button
                key={a.letter}
                onClick={() => { setLetter(a.letter); speak(a.letter); }}
                className={`rounded-lg py-2 font-display text-lg font-bold transition ${
                  letter === a.letter ? "bg-pink shadow-md scale-105" : "bg-muted hover:bg-accent"
                }`}
              >
                {a.letter}
              </button>
            ))}
          </div>
          <button onClick={clear} className="card-soft mt-2 rounded-xl bg-sky px-4 py-3 font-bold">
            ↻ Clear
          </button>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Match ---------- */
function MatchGame() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);

  const pool = ALPHABET;
  const set = useRef(rollSet());
  function rollSet() {
    const items = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);
    const answer = items[Math.floor(Math.random() * items.length)];
    return { items, answer };
  }

  function next() {
    set.current = rollSet();
    setPicked(null);
    setCorrect(false);
    setRound((r) => r + 1);
    setTimeout(() => speak(`Find the letter ${set.current.answer.letter}`), 200);
  }

  useEffect(() => { speak(`Find the letter ${set.current.answer.letter}`); }, []);

  function pick(letter: string) {
    setPicked(letter);
    const ok = letter === set.current.answer.letter;
    setCorrect(ok);
    speak(ok ? "Yay! That's right!" : `Try again. Find ${set.current.answer.letter}.`);
  }

  return (
    <Section title="Matching Game" subtitle="Tap the letter you hear.">
      <div className="card-soft mx-auto max-w-3xl p-6 text-center">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Find this letter:</p>
        <button
          onClick={() => speak(`Find the letter ${set.current.answer.letter}`)}
          className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-lilac px-6 py-4 font-display text-2xl font-bold shadow-md"
        >
          🔊 Listen again
        </button>
        <div key={round} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {set.current.items.map((a, i) => {
            const isPicked = picked === a.letter;
            const isAnswer = a.letter === set.current.answer.letter;
            const state = picked
              ? isAnswer ? "bg-mint" : isPicked ? "bg-destructive/40" : "bg-card opacity-60"
              : toneClass(TONES[i % TONES.length]);
            return (
              <button
                key={a.letter}
                onClick={() => !picked && pick(a.letter)}
                className={`tile-pop tile-pop-hover card-soft aspect-square ${state}`}
              >
                <span className="font-display text-6xl font-bold">{a.letter}</span>
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-6 animate-pop">
            <p className="mb-3 text-xl font-bold font-display">
              {correct ? "🎉 Great job!" : "💪 Almost! Try again."}
            </p>
            <button onClick={next} className="card-soft rounded-xl bg-pink px-6 py-3 font-bold">
              Next →
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ---------- Quiz ---------- */
function QuizGame() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = useRef(rollQ());

  function rollQ() {
    const items = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 4);
    const answer = items[Math.floor(Math.random() * items.length)];
    return { items, answer };
  }

  function pick(word: string) {
    if (picked) return;
    setPicked(word);
    const ok = word === q.current.answer.word;
    if (ok) setScore((s) => s + 1);
    speak(ok ? "Correct!" : `The answer is ${q.current.answer.word}`);
  }
  function next() {
    q.current = rollQ();
    setPicked(null);
    setRound((r) => r + 1);
  }

  const current = q.current;

  return (
    <Section title="Letter Quiz" subtitle="Which word starts with this letter?">
      <div className="card-soft mx-auto max-w-3xl p-6 text-center">
        <div className="mb-4 flex items-center justify-between text-sm font-semibold">
          <span className="rounded-full bg-mint px-3 py-1">Round {round + 1}</span>
          <span className="rounded-full bg-butter px-3 py-1">⭐ Score: {score}</span>
        </div>
        <div className="mb-6 grid place-items-center">
          <div className="grid h-36 w-36 place-items-center rounded-3xl bg-pink shadow-md">
            <span className="font-display text-8xl font-bold">{current.answer.letter}</span>
          </div>
        </div>
        <div key={round} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {current.items.map((a, i) => {
            const isPicked = picked === a.word;
            const isAnswer = a.word === current.answer.word;
            const state = picked
              ? isAnswer ? "bg-mint" : isPicked ? "bg-destructive/40" : "bg-card opacity-60"
              : toneClass(TONES[i % TONES.length]);
            return (
              <button
                key={a.word}
                onClick={() => pick(a.word)}
                className={`tile-pop tile-pop-hover card-soft flex flex-col items-center gap-1 p-4 ${state}`}
              >
                <span className="text-4xl">{a.emoji}</span>
                <span className="text-sm font-bold">{a.word}</span>
              </button>
            );
          })}
        </div>
        {picked && (
          <button onClick={next} className="card-soft mt-6 rounded-xl bg-sky px-6 py-3 font-bold animate-pop">
            Next question →
          </button>
        )}
      </div>
    </Section>
  );
}

/* ---------- Shared ---------- */
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="animate-pop">
      <div className="mb-5 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
