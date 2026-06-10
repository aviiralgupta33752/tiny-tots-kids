import { useEffect, useRef, useState } from "react";
import { ALPHABET, ANIMALS, COLORS, NUMBERS, SHAPES, TONES, speak, toneClass, type Tone } from "@/lib/learn-data";
import { StoryTime } from "@/components/StoryTime";
import { addStars, earnedStickers, useStars, useStreak, useDifficulty, getCurrentLevel, getNextLevel, LEVELS } from "@/lib/rewards";
import { prewarm } from "@/lib/speak";
import { SpellItGame } from "@/components/SpellItGame";
import { CountingGame, RhymeTimeGame } from "@/components/CountingAndRhymeGames";
import { Mascot, ProgressBar } from "@/components/GameUtils";
import { AvatarDisplay, AvatarPicker, loadAvatar, type AvatarState } from "@/components/AvatarPicker";
import { playAnimalSound } from "@/lib/animalSounds";

type TabKey = "abc"|"123"|"colors"|"shapes"|"animals"|"story"|"spell"|"count"|"rhyme"|"trace"|"match"|"quiz"|"rewards";

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key:"abc",     label:"ABCs",       emoji:"🔤" },
  { key:"123",     label:"123s",       emoji:"🔢" },
  { key:"colors",  label:"Colors",     emoji:"🎨" },
  { key:"shapes",  label:"Shapes",     emoji:"⭐" },
  { key:"animals", label:"Animals",    emoji:"🐾" },
  { key:"story",   label:"Stories",    emoji:"📖" },
  { key:"spell",   label:"Spell It",   emoji:"✍️" },
  { key:"count",   label:"Counting",   emoji:"🔢" },
  { key:"rhyme",   label:"Rhyme Time", emoji:"🎵" },
  { key:"trace",   label:"Trace",      emoji:"✏️" },
  { key:"match",   label:"Match",      emoji:"🧩" },
  { key:"quiz",    label:"Quiz",       emoji:"❓" },
  { key:"rewards", label:"Rewards",    emoji:"🏆" },
];

// Curriculum rotation every 30 minutes
const CURRICULUM: TabKey[] = ["abc","123","colors","animals","shapes","story","spell","count","rhyme"];
function getCurriculumTab(): TabKey {
  const slot = Math.floor(Date.now() / (30 * 60 * 1000));
  return CURRICULUM[slot % CURRICULUM.length];
}

export function LearnApp() {
  const [tab, setTab] = useState<TabKey>("abc");
  const stars = useStars();
  const streak = useStreak();
  const [difficulty, setDifficulty] = useDifficulty();
  const level = getCurrentLevel(stars);
  const nextLevel = getNextLevel(stars);
  const [avatar, setAvatar] = useState<AvatarState>(loadAvatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currTab, setCurrTab] = useState<TabKey>(getCurriculumTab());

  // Update curriculum tab every 30 min
  useEffect(() => {
    const id = setInterval(() => setCurrTab(getCurriculumTab()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const warm = () => {
      prewarm([
        ...ALPHABET.map((a) => `${a.letter}. ${a.letter} is for ${a.word}.`),
        ...NUMBERS.map((n) => n.n === 1 ? "One. One star." : `${n.word}. ${n.n} stars.`),
        ...COLORS.map((c) => c.phrase),
      ]);
    };
    const req = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
    const cancel = (window as any).cancelIdleCallback ?? clearTimeout;
    const id = req(warm);
    return () => cancel(id);
  }, []);

  return (
    <div className="min-h-screen px-4 pb-16 pt-6 sm:px-8">
      {showAvatarPicker && (
        <AvatarPicker onClose={() => { setAvatar(loadAvatar()); setShowAvatarPicker(false); }} />
      )}

      {/* Header */}
      <header className="mx-auto mb-4 flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink text-2xl shadow-md">🌈</div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Tiny Tots</h1>
            <p className="text-xs text-muted-foreground">Tap, listen, learn — together.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="card-soft flex items-center gap-1 rounded-full bg-peach px-3 py-2 text-sm font-bold">
              🔥 {streak} day{streak !== 1 ? "s" : ""}
            </div>
          )}
          {/* Avatar button */}
          <button onClick={() => setShowAvatarPicker(true)} className="transition hover:scale-110">
            <AvatarDisplay avatar={avatar} size="sm" />
          </button>
          <button onClick={() => setTab("rewards")}
            className="card-soft flex items-center gap-2 rounded-full bg-butter px-4 py-2 text-sm font-bold shadow-sm transition hover:scale-105">
            <span className="text-xl">⭐</span><span>{stars}</span>
          </button>
        </div>
      </header>

      {/* Curriculum suggestion banner */}
      <div className="mx-auto mb-3 max-w-6xl">
        <button onClick={() => setTab(currTab)}
          className="w-full rounded-2xl bg-mint/60 px-4 py-2 text-sm font-bold text-left hover:bg-mint transition">
          📚 Now learning: <span className="underline">{TABS.find(t=>t.key===currTab)?.label}</span> — tap to jump there!
        </button>
      </div>

      {/* Level + progress */}
      <div className="mx-auto mb-4 max-w-6xl">
        <div className="card-soft flex items-center gap-4 p-3">
          <div className="text-2xl">{level.emoji}</div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs font-bold">
              <span>{level.name}</span>
              {nextLevel && <span className="text-muted-foreground">{nextLevel.starsNeeded - stars} ⭐ to {nextLevel.name}</span>}
            </div>
            {nextLevel && <ProgressBar current={stars - level.starsNeeded} total={nextLevel.starsNeeded - level.starsNeeded} color="bg-butter" />}
          </div>
          <div className="flex gap-1">
            {(["easy","medium","hard"] as const).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`rounded-lg px-2 py-1 text-xs font-bold transition ${difficulty === d ? "bg-foreground text-background" : "bg-muted text-foreground/70"}`}>
                {d === "easy" ? "🌱" : d === "medium" ? "⭐" : "🔥"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mx-auto mb-8 max-w-6xl">
        <div className="card-soft flex flex-wrap gap-2 p-2">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 min-w-[80px] rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                tab === t.key ? "bg-foreground text-background shadow-md scale-[1.02]" : "hover:bg-muted text-foreground/80"
              }`}>
              <span className="mr-1">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl">
        {tab === "abc"     && <AlphabetGrid />}
        {tab === "123"     && <NumberGrid />}
        {tab === "colors"  && <ColorGrid />}
        {tab === "shapes"  && <ShapeGrid />}
        {tab === "animals" && <AnimalGrid />}
        {tab === "story"   && <StoryTime />}
        {tab === "spell"   && <Section title="Spell It ✍️" subtitle="Hear the word, tap the letters!"><SpellItGame difficulty={difficulty} /></Section>}
        {tab === "count"   && <Section title="Counting 🔢" subtitle="Count and pick the right number!"><CountingGame difficulty={difficulty} /></Section>}
        {tab === "rhyme"   && <Section title="Rhyme Time 🎵" subtitle="Find the word that rhymes!"><RhymeTimeGame difficulty={difficulty} /></Section>}
        {tab === "trace"   && <TracePanel />}
        {tab === "match"   && <MatchGame />}
        {tab === "quiz"    && <QuizGame />}
        {tab === "rewards" && <RewardsPanel stars={stars} streak={streak} avatar={avatar} onEditAvatar={() => setShowAvatarPicker(true)} />}
      </main>
    </div>
  );
}

// ── Rewards Panel ─────────────────────────────────────────────────────────────
function RewardsPanel({ stars, streak, avatar, onEditAvatar }: { stars: number; streak: number; avatar: AvatarState; onEditAvatar: () => void }) {
  const stickers = earnedStickers(stars);
  const level = getCurrentLevel(stars);
  const nextLevel = getNextLevel(stars);
  return (
    <Section title="Your Rewards 🏆" subtitle="Earn stars by playing games!">
      <div className="card-soft mx-auto max-w-2xl p-8 text-center">
        {streak > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-peach px-5 py-2 text-lg font-bold">
            🔥 {streak} day streak!
          </div>
        )}
        <div className="mb-4 flex justify-center">
          <button onClick={onEditAvatar} className="group relative">
            <AvatarDisplay avatar={avatar} size="lg" />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-pink p-1 text-xs shadow group-hover:scale-110 transition">✏️</span>
          </button>
        </div>
        <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-butter px-6 py-3 text-2xl font-bold">⭐ {stars} stars</div>
        <div className="mb-6">
          <p className="mb-2 text-lg font-bold">{level.emoji} Level {level.level}: {level.name}</p>
          {nextLevel && (
            <div className="mx-auto max-w-xs">
              <ProgressBar current={stars - level.starsNeeded} total={nextLevel.starsNeeded - level.starsNeeded} color="bg-mint" />
              <p className="mt-1 text-xs text-muted-foreground">{nextLevel.starsNeeded - stars} more stars to {nextLevel.name}!</p>
            </div>
          )}
        </div>
        <h3 className="mb-3 font-display text-xl font-bold">Level Journey</h3>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {LEVELS.map((l) => (
            <div key={l.level} className={`rounded-2xl px-4 py-2 text-sm font-bold ${stars >= l.starsNeeded ? "bg-mint shadow-md" : "bg-muted opacity-50"}`}>
              {l.emoji} {l.name}<div className="text-xs opacity-70">{l.starsNeeded}⭐</div>
            </div>
          ))}
        </div>
        <h3 className="mb-4 font-display text-2xl font-bold">Sticker Book</h3>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {[5,15,30,50,75,100].map((at, idx) => {
            const got = stars >= at;
            const emojis = ["🌟","🦄","🌈","👑","🚀","🏆"];
            return (
              <div key={at} className={`aspect-square rounded-2xl p-3 transition ${got ? "bg-mint shadow-md scale-105" : "bg-muted opacity-40 grayscale"}`}>
                <div className="text-4xl">{emojis[idx]}</div>
                <div className="mt-1 text-xs font-bold">{at}⭐</div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{stickers.length} of 6 stickers collected</p>
      </div>
    </Section>
  );
}

// ── Alphabet Grid ─────────────────────────────────────────────────────────────
function AlphabetGrid() {
  return (
    <Section title="The Alphabet" subtitle="Tap a letter to hear it!">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {ALPHABET.map((a, i) => (
          <Tile key={a.letter} tone={TONES[i % TONES.length]} onClick={() => speak(`${a.letter}. ${a.letter} is for ${a.word}.`)}>
            <span className="text-5xl font-bold font-display sm:text-6xl">{a.letter}</span>
            <span className="text-3xl">{a.emoji}</span>
            <span className="text-xs font-semibold sm:text-sm">{a.word}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

// ── Number Grid ───────────────────────────────────────────────────────────────
function NumberGrid() {
  return (
    <Section title="Numbers 1 to 10" subtitle="Count along out loud!">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {NUMBERS.map((n, i) => (
          <Tile key={n.n} tone={TONES[i % TONES.length]} onClick={() => speak(n.n === 1 ? "One. One star." : `${n.word}. ${n.n} stars.`)} big>
            <span className="text-6xl font-bold font-display sm:text-7xl">{n.n}</span>
            <span className="text-lg">{n.emoji}</span>
            <span className="text-sm font-semibold capitalize">{n.word}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

// ── Color Grid ────────────────────────────────────────────────────────────────
function ColorGrid() {
  return (
    <Section title="Colors" subtitle="Tap a color to hear its name!">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {COLORS.map((c) => (
          <button key={c.name} onClick={() => speak(c.phrase)} className="card-soft tile-pop tile-pop-hover flex flex-col items-center gap-3 p-5">
            <div className="grid h-28 w-28 place-items-center rounded-full text-5xl shadow-inner" style={{ backgroundColor: c.hex }}>{c.emoji}</div>
            <span className="text-lg font-bold font-display">{c.name}</span>
          </button>
        ))}
      </div>
    </Section>
  );
}

// ── Shape Grid ────────────────────────────────────────────────────────────────
function ShapeGrid() {
  return (
    <Section title="Shapes" subtitle="Tap a shape to hear its name!">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SHAPES.map((s, i) => (
          <Tile key={s.name} tone={TONES[i % TONES.length]} onClick={() => speak(s.name)} big>
            <svg viewBox="0 0 100 100" className="h-28 w-28 fill-foreground/85">{s.svg}</svg>
            <span className="text-xl font-bold font-display">{s.name}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

// ── Animal Grid ───────────────────────────────────────────────────────────────
function AnimalGrid() {
  return (
    <Section title="Animal Sounds" subtitle="Tap an animal to hear it!">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {ANIMALS.map((a, i) => (
          <Tile key={a.name} tone={TONES[i % TONES.length]} onClick={() => playAnimalSound(a.name)} big>
            <span className="text-7xl">{a.emoji}</span>
            <span className="text-lg font-bold font-display">{a.name}</span>
            <span className="text-xs text-foreground/70">🔊 Tap to hear!</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

// ── Trace Panel ───────────────────────────────────────────────────────────────
function TracePanel() {
  const [letter, setLetter] = useState("A");
  const [earned, setEarned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const strokes = useRef(0);

  useEffect(() => { clear(); setEarned(false); strokes.current = 0; }, [letter]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  }
  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    strokes.current++;
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y); ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.strokeStyle = "#ff6fa0"; ctx.stroke();
  }
  function end() {
    drawing.current = false;
    // Award a star after they've drawn enough strokes
    if (strokes.current >= 3 && !earned) {
      setEarned(true);
      addStars(1);
      speak("Great tracing! You earned a star!");
    }
  }
  function clear() {
    const c = canvasRef.current; if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    strokes.current = 0; setEarned(false);
  }

  return (
    <Section title="Trace a Letter" subtitle="Use your finger or mouse to trace!">
      <div className="card-soft grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl bg-butter/40">
          <div className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[18rem] font-bold leading-none text-foreground/15 select-none">{letter}</div>
          <canvas ref={canvasRef} width={600} height={600}
            onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}
            className="absolute inset-0 h-full w-full touch-none rounded-2xl" />
          {earned && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="animate-bounce rounded-full bg-mint/90 px-6 py-3 text-2xl font-bold shadow-xl">⭐ Great job!</div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Choose a letter</p>
          <div className="grid max-h-[28rem] w-full grid-cols-6 gap-1.5 overflow-auto md:w-56 md:grid-cols-4">
            {ALPHABET.map((a) => (
              <button key={a.letter} onClick={() => { setLetter(a.letter); speak(a.letter); }}
                className={`rounded-lg py-2 font-display text-lg font-bold transition ${letter === a.letter ? "bg-pink shadow-md scale-105" : "bg-muted hover:bg-accent"}`}>
                {a.letter}
              </button>
            ))}
          </div>
          <button onClick={clear} className="card-soft mt-2 rounded-xl bg-sky px-4 py-3 font-bold">↻ Clear</button>
        </div>
      </div>
    </Section>
  );
}

// ── Match Game ────────────────────────────────────────────────────────────────
function MatchGame() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const set = useRef(rollSet());
  function rollSet() { const items = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 4); const answer = items[Math.floor(Math.random() * items.length)]; return { items, answer }; }
  function sayPrompt() { speak(`Find the letter ${set.current.answer.letter}`); }
  function next() { set.current = rollSet(); setPicked(null); setCorrect(false); setRound((r) => r + 1); }
  function pick(letter: string) { setPicked(letter); const ok = letter === set.current.answer.letter; setCorrect(ok); if (ok) addStars(1); speak(ok ? "Yay! That's right!" : `Try again. Find ${set.current.answer.letter}.`); }
  return (
    <Section title="Matching Game" subtitle="Tap the letter you hear!">
      <div className="card-soft mx-auto max-w-3xl p-6 text-center">
        <button onClick={sayPrompt} className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-lilac px-6 py-4 font-display text-2xl font-bold shadow-md">🔊 Listen again</button>
        <div key={round} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {set.current.items.map((a, i) => { const isPicked = picked === a.letter; const isAnswer = a.letter === set.current.answer.letter; const state = picked ? isAnswer ? "bg-mint" : isPicked ? "bg-destructive/40" : "bg-card opacity-60" : toneClass(TONES[i % TONES.length]); return (<button key={a.letter} onClick={() => !picked && pick(a.letter)} className={`tile-pop tile-pop-hover card-soft aspect-square ${state}`}><span className="font-display text-6xl font-bold">{a.letter}</span></button>); })}
        </div>
        {picked && (<div className="mt-6"><p className="mb-3 text-xl font-bold">{correct ? "🎉 Great job!" : "💪 Almost!"}</p><button onClick={next} className="card-soft rounded-xl bg-pink px-6 py-3 font-bold">Next →</button></div>)}
      </div>
    </Section>
  );
}

// ── Quiz Game ─────────────────────────────────────────────────────────────────
function QuizGame() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = useRef(rollQ());
  function rollQ() { const items = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 4); const answer = items[Math.floor(Math.random() * items.length)]; return { items, answer }; }
  function pick(word: string) { if (picked) return; setPicked(word); const ok = word === q.current.answer.word; if (ok) { setScore((s) => s + 1); addStars(1); } speak(ok ? "Correct!" : `The answer is ${q.current.answer.word}`); }
  function next() { q.current = rollQ(); setPicked(null); setRound((r) => r + 1); }
  return (
    <Section title="Letter Quiz" subtitle="Which word starts with this letter?">
      <div className="card-soft mx-auto max-w-3xl p-6 text-center">
        <div className="mb-4 flex items-center justify-between text-sm font-semibold"><span className="rounded-full bg-mint px-3 py-1">Round {round + 1}</span><span className="rounded-full bg-butter px-3 py-1">⭐ {score}</span></div>
        <div className="mb-6 grid place-items-center"><div className="grid h-36 w-36 place-items-center rounded-3xl bg-pink shadow-md"><span className="font-display text-8xl font-bold">{q.current.answer.letter}</span></div></div>
        <div key={round} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {q.current.items.map((a, i) => { const isPicked = picked === a.word; const isAnswer = a.word === q.current.answer.word; const state = picked ? isAnswer ? "bg-mint" : isPicked ? "bg-destructive/40" : "bg-card opacity-60" : toneClass(TONES[i % TONES.length]); return (<button key={a.word} onClick={() => pick(a.word)} className={`tile-pop tile-pop-hover card-soft flex flex-col items-center gap-1 p-4 ${state}`}><span className="text-4xl">{a.emoji}</span><span className="text-sm font-bold">{a.word}</span></button>); })}
        </div>
        {picked && <button onClick={next} className="card-soft mt-6 rounded-xl bg-sky px-6 py-3 font-bold">Next →</button>}
      </div>
    </Section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Tile({ tone, onClick, children, big }: { tone: Tone; onClick: () => void; children: React.ReactNode; big?: boolean }) {
  return (
    <button onClick={onClick} className={`tile-pop tile-pop-hover card-soft ${toneClass(tone)} relative flex flex-col items-center justify-center gap-2 p-4 text-foreground/90 ${big ? "aspect-square" : "aspect-[4/5]"}`}>
      {children}
    </button>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="animate-pop">
      <div className="mb-5 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
