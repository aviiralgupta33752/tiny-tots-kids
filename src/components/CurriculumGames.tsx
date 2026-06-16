import { useState, useEffect, useRef } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { TONES, toneClass } from "@/lib/learn-data";

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function Card({ children, tone, onClick, big }: { children: React.ReactNode; tone?: number; onClick?: () => void; big?: boolean }) {
  const t = TONES[(tone ?? 0) % TONES.length];
  return (
    <button onClick={onClick}
      className={`tile-pop tile-pop-hover card-soft ${toneClass(t)} flex flex-col items-center justify-center gap-2 p-4 text-foreground/90 ${big ? "aspect-square" : "aspect-[4/5]"}`}>
      {children}
    </button>
  );
}

/* ===================== AGE 3 ===================== */

const OPPOSITES = [
  { a: "Big", ea: "🐘", b: "Small", eb: "🐭" },
  { a: "Hot", ea: "🔥", b: "Cold", eb: "❄️" },
  { a: "Day", ea: "☀️", b: "Night", eb: "🌙" },
  { a: "Up", ea: "⬆️", b: "Down", eb: "⬇️" },
  { a: "Fast", ea: "🐇", b: "Slow", eb: "🐢" },
  { a: "Happy", ea: "😊", b: "Sad", eb: "😢" },
  { a: "Open", ea: "🚪", b: "Closed", eb: "🔒" },
  { a: "Full", ea: "🥛", b: "Empty", eb: "🥃" },
];
export function OppositesGame() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {OPPOSITES.map((o, i) => (
        <button key={o.a} onClick={() => speak(`${o.a}. ${o.b}. Opposites!`)}
          className="card-soft tile-pop tile-pop-hover flex items-center justify-around p-5 bg-butter/60">
          <div className="text-center"><div className="text-5xl">{o.ea}</div><div className="mt-2 font-bold text-lg">{o.a}</div></div>
          <div className="text-3xl">↔️</div>
          <div className="text-center"><div className="text-5xl">{o.eb}</div><div className="mt-2 font-bold text-lg">{o.b}</div></div>
          <span className="sr-only">{i}</span>
        </button>
      ))}
    </div>
  );
}

const INSTRUCTIONS = [
  "Touch your nose! 👃", "Clap your hands! 👏", "Stomp your feet! 🦶",
  "Jump up high! 🦘", "Spin around! 🌀", "Wave hello! 👋",
  "Pat your head! 🙌", "Wiggle your fingers! 🖐️", "Smile big! 😁",
];
export function InstructionsGame() {
  const [i, setI] = useState(0);
  const cmd = INSTRUCTIONS[i % INSTRUCTIONS.length];
  function next() {
    addStars(1);
    setI(x => x + 1);
    setTimeout(() => speak(INSTRUCTIONS[(i + 1) % INSTRUCTIONS.length].replace(/[^a-zA-Z !]/g, "")), 200);
  }
  useEffect(() => { speak(cmd.replace(/[^a-zA-Z !]/g, "")); }, []);
  return (
    <div className="card-soft mx-auto max-w-xl p-8 text-center bg-mint/40">
      <div className="text-8xl mb-4">{cmd.match(/[\p{Emoji}]/u)?.[0] ?? "🎯"}</div>
      <div className="text-3xl font-bold font-display mb-6">{cmd}</div>
      <button onClick={() => speak(cmd.replace(/[^a-zA-Z !]/g, ""))} className="rounded-xl bg-lilac px-4 py-2 font-bold mr-2">🔊 Hear it</button>
      <button onClick={next} className="rounded-xl bg-pink px-6 py-3 font-bold text-white">I did it! ⭐</button>
    </div>
  );
}

/* ===================== AGE 4 ===================== */

const PATTERN_SETS = [
  { seq: ["🔴","🔵","🔴","🔵","🔴"], next: "🔵", choices: ["🔵","🟢","🟡"] },
  { seq: ["⭐","🌙","⭐","🌙","⭐"], next: "🌙", choices: ["☀️","🌙","⭐"] },
  { seq: ["🍎","🍌","🍎","🍌"], next: "🍎", choices: ["🍇","🍎","🍓"] },
  { seq: ["🐶","🐱","🐶","🐱","🐶"], next: "🐱", choices: ["🐭","🐱","🐰"] },
  { seq: ["🔺","🟦","🔺","🟦"], next: "🔺", choices: ["🟢","🔺","🟡"] },
];
export function PatternsGame() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const p = PATTERN_SETS[i % PATTERN_SETS.length];
  function pick(c: string) {
    if (picked) return;
    setPicked(c);
    if (c === p.next) { addStars(1); speak("Yes! You found the pattern!"); }
    else speak("Not quite. Try again next time!");
  }
  function next() { setI(x => x + 1); setPicked(null); }
  return (
    <div className="card-soft mx-auto max-w-xl p-6 text-center">
      <p className="mb-4 font-bold">What comes next?</p>
      <div className="mb-6 flex justify-center gap-2 text-5xl">
        {p.seq.map((s, k) => <span key={k}>{s}</span>)}
        <span className="text-foreground/30">❓</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {p.choices.map(c => (
          <button key={c} onClick={() => pick(c)}
            className={`card-soft tile-pop tile-pop-hover aspect-square text-5xl ${picked===c ? (c===p.next ? "bg-mint" : "bg-destructive/40") : "bg-butter"}`}>
            {c}
          </button>
        ))}
      </div>
      {picked && <button onClick={next} className="mt-4 rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>}
    </div>
  );
}

const DAYS = [
  { name: "Monday",    emoji: "🌞", short: "Mon" },
  { name: "Tuesday",   emoji: "🌷", short: "Tue" },
  { name: "Wednesday", emoji: "🌈", short: "Wed" },
  { name: "Thursday",  emoji: "⚡", short: "Thu" },
  { name: "Friday",    emoji: "🎉", short: "Fri" },
  { name: "Saturday",  emoji: "🛝", short: "Sat" },
  { name: "Sunday",    emoji: "⛪", short: "Sun" },
];
export function DaysGame() {
  const today = DAYS[(new Date().getDay() + 6) % 7]; // Mon=0
  return (
    <div>
      <div className="card-soft mb-4 bg-sky/40 p-4 text-center">
        <p className="text-sm font-bold">Today is</p>
        <p className="font-display text-3xl font-bold">{today.emoji} {today.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DAYS.map((d, i) => (
          <Card key={d.name} tone={i} big onClick={() => speak(`${d.name}. Day ${i+1} of the week.`)}>
            <span className="text-5xl">{d.emoji}</span>
            <span className="font-bold">{d.name}</span>
            <span className="text-xs opacity-70">{d.short}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

const HELPERS = [
  { name: "Doctor",      emoji: "👩‍⚕️", what: "Helps you feel better when you're sick." },
  { name: "Firefighter", emoji: "👨‍🚒", what: "Puts out fires and keeps us safe." },
  { name: "Teacher",     emoji: "👩‍🏫", what: "Helps you learn new things every day!" },
  { name: "Police",      emoji: "👮",   what: "Keeps the community safe." },
  { name: "Chef",        emoji: "👨‍🍳", what: "Cooks yummy food for everyone." },
  { name: "Farmer",      emoji: "👨‍🌾", what: "Grows food for us to eat." },
  { name: "Vet",         emoji: "🐾",   what: "Takes care of sick animals." },
  { name: "Mail Carrier",emoji: "📬",   what: "Delivers letters and packages." },
];
export function HelpersGame() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {HELPERS.map((h, i) => (
        <Card key={h.name} tone={i} big onClick={() => speak(`${h.name}. ${h.what}`)}>
          <span className="text-6xl">{h.emoji}</span>
          <span className="font-bold">{h.name}</span>
        </Card>
      ))}
    </div>
  );
}

const SHARING_STORIES = [
  { q: "Your friend has no crayons. What do you do?", good: "Share yours! 🤝", bad: "Keep them all 🙅" },
  { q: "Two kids want the same toy. What's fair?", good: "Take turns! 🔄", bad: "Grab it first 😠" },
  { q: "Your team is building a tower. What helps?", good: "Work together! 👫", bad: "Knock it down 💥" },
  { q: "A new kid is alone. What do you do?", good: "Say hi & play! 👋", bad: "Ignore them 🙈" },
];
export function SharingGame() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const s = SHARING_STORIES[i % SHARING_STORIES.length];
  function pick(c: string) {
    setPicked(c);
    if (c === s.good) { addStars(1); speak("Great choice! Sharing makes everyone happy!"); }
    else speak("Hmm, try the kind choice!");
  }
  return (
    <div className="card-soft mx-auto max-w-xl p-6 text-center bg-lilac/30">
      <p className="text-2xl font-bold font-display mb-6">{s.q}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shuffle([s.good, s.bad]).map(c => (
          <button key={c} onClick={() => pick(c)}
            className={`card-soft p-5 font-bold text-lg ${picked===c ? (c===s.good ? "bg-mint" : "bg-destructive/40") : "bg-butter"}`}>
            {c}
          </button>
        ))}
      </div>
      {picked && <button onClick={() => { setI(x=>x+1); setPicked(null); }} className="mt-4 rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>}
    </div>
  );
}

/* ===================== AGE 5 ===================== */

export function BigCountGame() {
  const [n, setN] = useState(1);
  return (
    <div className="card-soft mx-auto max-w-xl p-6 text-center">
      <div className="text-9xl font-display font-bold text-pink mb-4">{n}</div>
      <button onClick={() => speak(String(n))} className="rounded-xl bg-lilac px-4 py-2 font-bold mr-2">🔊 Say it</button>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setN(Math.max(1, n-1))} className="rounded-xl bg-muted px-5 py-3 font-bold">−1</button>
        <button onClick={() => setN(Math.min(100, n+1))} className="rounded-xl bg-mint px-5 py-3 font-bold">+1</button>
        <button onClick={() => setN(Math.min(100, n+10))} className="rounded-xl bg-sky px-5 py-3 font-bold">+10</button>
      </div>
      <div className="mt-6 grid grid-cols-10 gap-1">
        {Array.from({length:100}).map((_,i)=>(
          <button key={i} onClick={()=>{setN(i+1); speak(String(i+1));}}
            className={`aspect-square rounded text-xs font-bold ${n===i+1 ? "bg-pink text-white" : (i+1)%10===0 ? "bg-butter" : "bg-muted"}`}>
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TimeGame() {
  const [h, setH] = useState(3);
  function pick(hour: number) { setH(hour); speak(`${hour} o'clock`); addStars(1); }
  const rot = (h % 12) * 30;
  return (
    <div className="card-soft mx-auto max-w-md p-6 text-center">
      <div className="relative mx-auto mb-4 grid h-64 w-64 place-items-center rounded-full bg-butter/40 border-4 border-foreground/20">
        {Array.from({length:12}).map((_,i)=>{
          const a = (i+1)*30 - 90; const r = 105;
          const x = Math.cos(a*Math.PI/180)*r; const y = Math.sin(a*Math.PI/180)*r;
          return <span key={i} className="absolute font-bold" style={{transform:`translate(${x}px,${y}px)`}}>{i+1}</span>;
        })}
        <div className="absolute h-20 w-1.5 origin-bottom bg-pink rounded" style={{transform:`rotate(${rot}deg) translateY(-40px)`}} />
        <div className="absolute h-2 w-2 rounded-full bg-foreground"/>
      </div>
      <p className="text-2xl font-bold mb-3">{h} o'clock</p>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({length:12}).map((_,i)=>(
          <button key={i} onClick={()=>pick(i+1)} className={`rounded-lg py-2 font-bold ${h===i+1?"bg-pink text-white":"bg-muted"}`}>{i+1}</button>
        ))}
      </div>
    </div>
  );
}

const COINS = [
  { name: "Penny",   emoji: "🟫", cents: 1 },
  { name: "Nickel",  emoji: "⚪", cents: 5 },
  { name: "Dime",    emoji: "⚪", cents: 10 },
  { name: "Quarter", emoji: "⚪", cents: 25 },
  { name: "Dollar",  emoji: "💵", cents: 100 },
];
export function MoneyGame() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {COINS.map((c,i)=>(
        <Card key={c.name} tone={i} big onClick={()=>speak(`${c.name}. ${c.cents} cents.`)}>
          <span className="text-6xl">{c.emoji}</span>
          <span className="font-bold">{c.name}</span>
          <span className="text-sm font-bold">{c.cents}¢</span>
        </Card>
      ))}
    </div>
  );
}

const PLANTS = [
  { name: "Tree",   emoji: "🌳", fact: "Trees give us shade and clean air!" },
  { name: "Flower", emoji: "🌻", fact: "Flowers turn into fruit and seeds." },
  { name: "Grass",  emoji: "🌿", fact: "Grass covers the ground and feeds animals." },
  { name: "Cactus", emoji: "🌵", fact: "Cactus stores water and lives in deserts." },
  { name: "Seed",   emoji: "🌱", fact: "A seed grows into a new plant!" },
  { name: "Leaf",   emoji: "🍃", fact: "Leaves drink sunlight to make food." },
];
export function PlantsGame() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PLANTS.map((p,i)=>(
        <Card key={p.name} tone={i} big onClick={()=>speak(`${p.name}. ${p.fact}`)}>
          <span className="text-6xl">{p.emoji}</span>
          <span className="font-bold">{p.name}</span>
        </Card>
      ))}
    </div>
  );
}

const SEASONS = [
  { name: "Spring", emoji: "🌷", fact: "Flowers bloom and baby animals are born!" },
  { name: "Summer", emoji: "☀️", fact: "Hot and sunny — time to swim!" },
  { name: "Fall",   emoji: "🍂", fact: "Leaves change color and fall down." },
  { name: "Winter", emoji: "❄️", fact: "Cold and snowy — bundle up!" },
];
export function SeasonsGame() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {SEASONS.map((s,i)=>(
        <Card key={s.name} tone={i} big onClick={()=>speak(`${s.name}. ${s.fact}`)}>
          <span className="text-7xl">{s.emoji}</span>
          <span className="font-bold text-xl">{s.name}</span>
        </Card>
      ))}
    </div>
  );
}

const DIRECTIONS = [
  { name: "North", emoji: "⬆️" }, { name: "South", emoji: "⬇️" },
  { name: "East",  emoji: "➡️" }, { name: "West",  emoji: "⬅️" },
];
export function MapsGame() {
  return (
    <div>
      <div className="card-soft mb-4 mx-auto max-w-xs p-6 text-center bg-mint/30">
        <div className="text-2xl font-bold mb-2">🧭 Compass</div>
        <div className="text-5xl">🗺️</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DIRECTIONS.map((d,i)=>(
          <Card key={d.name} tone={i} big onClick={()=>speak(`${d.name}. Go ${d.name}!`)}>
            <span className="text-6xl">{d.emoji}</span>
            <span className="font-bold">{d.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ===================== AGE 6 ===================== */

const COMPREHENSION = [
  {
    story: "Sam the cat loves to nap in the sun. One day, a butterfly landed on his nose. Sam sneezed!",
    q: "What landed on Sam's nose?",
    choices: ["A bird", "A butterfly", "A bee"], answer: "A butterfly",
  },
  {
    story: "Mia planted a seed. She watered it every day. Soon, a sunflower grew tall and bright.",
    q: "What did Mia's seed grow into?",
    choices: ["A tree", "A sunflower", "A rose"], answer: "A sunflower",
  },
  {
    story: "The puppy chased his tail in a circle. He spun and spun until he got dizzy and sat down.",
    q: "Why did the puppy sit down?",
    choices: ["He was hungry", "He got dizzy", "He saw a cat"], answer: "He got dizzy",
  },
];
export function ComprehensionGame() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const s = COMPREHENSION[i % COMPREHENSION.length];
  function pick(c: string) {
    setPicked(c);
    if (c === s.answer) { addStars(2); speak("Yes! Great reading!"); }
    else speak("Read again carefully!");
  }
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <button onClick={()=>speak(s.story)} className="mb-3 rounded-xl bg-lilac px-4 py-2 font-bold">🔊 Read story</button>
      <p className="mb-4 text-lg leading-relaxed">{s.story}</p>
      <p className="font-bold mb-3">{s.q}</p>
      <div className="grid gap-2">
        {s.choices.map(c=>(
          <button key={c} onClick={()=>!picked&&pick(c)}
            className={`rounded-xl p-3 text-left font-bold ${picked===c ? (c===s.answer ? "bg-mint":"bg-destructive/40") : "bg-butter"}`}>
            {c}
          </button>
        ))}
      </div>
      {picked && <button onClick={()=>{setI(x=>x+1);setPicked(null);}} className="mt-4 rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>}
    </div>
  );
}

export function PlaceValueGame() {
  const [n, setN] = useState(247);
  const h = Math.floor(n/100), t = Math.floor((n%100)/10), o = n%10;
  return (
    <div className="card-soft mx-auto max-w-xl p-6 text-center">
      <input type="number" value={n} min={0} max={999} onChange={e=>setN(Math.max(0,Math.min(999,+e.target.value||0)))}
        className="mb-4 w-40 rounded-xl border-2 border-pink px-3 py-2 text-center text-4xl font-bold font-display"/>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card-soft bg-pink/40 p-4"><div className="text-5xl font-bold">{h}</div><div className="font-bold mt-2">Hundreds</div></div>
        <div className="card-soft bg-mint/40 p-4"><div className="text-5xl font-bold">{t}</div><div className="font-bold mt-2">Tens</div></div>
        <div className="card-soft bg-butter/40 p-4"><div className="text-5xl font-bold">{o}</div><div className="font-bold mt-2">Ones</div></div>
      </div>
      <button onClick={()=>speak(`${n}. ${h} hundreds, ${t} tens, ${o} ones.`)} className="rounded-xl bg-lilac px-4 py-2 font-bold">🔊 Hear it</button>
    </div>
  );
}

const MEASURE = [
  { item: "Pencil", emoji: "✏️", size: "Small", unit: "inches" },
  { item: "Desk",   emoji: "🪑", size: "Medium", unit: "feet" },
  { item: "Car",    emoji: "🚗", size: "Big", unit: "feet" },
  { item: "House",  emoji: "🏠", size: "Bigger", unit: "feet" },
  { item: "Tree",   emoji: "🌳", size: "Tall", unit: "feet" },
  { item: "Ant",    emoji: "🐜", size: "Tiny", unit: "mm" },
];
export function MeasureGame() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {MEASURE.map((m,i)=>(
        <Card key={m.item} tone={i} big onClick={()=>speak(`${m.item} is ${m.size}. We measure it in ${m.unit}.`)}>
          <span className="text-6xl">{m.emoji}</span>
          <span className="font-bold">{m.item}</span>
          <span className="text-xs opacity-70">{m.size} • {m.unit}</span>
        </Card>
      ))}
    </div>
  );
}

const LIFECYCLES = [
  { name: "Butterfly", stages: ["🥚 Egg","🐛 Caterpillar","🛡️ Chrysalis","🦋 Butterfly"] },
  { name: "Frog",      stages: ["🥚 Egg","🐟 Tadpole","🐸 Froglet","🐸 Frog"] },
  { name: "Chicken",   stages: ["🥚 Egg","🐣 Chick","🐥 Young","🐔 Hen"] },
  { name: "Plant",     stages: ["🌰 Seed","🌱 Sprout","🌿 Plant","🌳 Tree"] },
];
export function LifeCycleGame() {
  return (
    <div className="space-y-4">
      {LIFECYCLES.map(lc=>(
        <div key={lc.name} className="card-soft p-4 bg-mint/30">
          <p className="font-bold text-lg mb-3">{lc.name} Life Cycle</p>
          <div className="flex flex-wrap items-center justify-around gap-2">
            {lc.stages.map((s,k)=>(
              <div key={k} className="flex items-center gap-2">
                <button onClick={()=>speak(s.replace(/[^a-zA-Z ]/g,""))} className="rounded-xl bg-butter px-4 py-3 text-center">
                  <div className="text-3xl">{s.split(" ")[0]}</div>
                  <div className="text-xs font-bold">{s.split(" ").slice(1).join(" ")}</div>
                </button>
                {k<lc.stages.length-1 && <span>➡️</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const SPACE = [
  { name: "Sun",   emoji: "☀️", fact: "The Sun gives us light and warmth!" },
  { name: "Earth", emoji: "🌍", fact: "Earth is our home planet!" },
  { name: "Moon",  emoji: "🌕", fact: "The Moon goes around Earth." },
  { name: "Stars", emoji: "⭐", fact: "Stars are giant balls of gas, far away!" },
  { name: "Mars",  emoji: "🔴", fact: "Mars is the red planet." },
  { name: "Comet", emoji: "☄️", fact: "Comets zoom through space with tails!" },
];
export function SpaceGame() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SPACE.map((s,i)=>(
        <Card key={s.name} tone={i} big onClick={()=>speak(`${s.name}. ${s.fact}`)}>
          <span className="text-7xl">{s.emoji}</span>
          <span className="font-bold">{s.name}</span>
        </Card>
      ))}
    </div>
  );
}

const CITIZEN = [
  { rule: "Say please and thank you", emoji: "🙏" },
  { rule: "Throw trash in the bin",    emoji: "🗑️" },
  { rule: "Help your friends",         emoji: "🤝" },
  { rule: "Listen when others speak",  emoji: "👂" },
  { rule: "Follow the rules",          emoji: "📜" },
  { rule: "Be kind to animals",        emoji: "🐾" },
];
export function CitizenGame() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CITIZEN.map((c,i)=>(
        <button key={c.rule} onClick={()=>speak(c.rule)}
          className="card-soft tile-pop tile-pop-hover flex items-center gap-4 p-5 bg-sky/40">
          <span className="text-5xl">{c.emoji}</span>
          <span className="font-bold text-lg text-left">{c.rule}</span>
          <span className="sr-only">{i}</span>
        </button>
      ))}
    </div>
  );
}

/* ===================== AGE 7 ===================== */

export function ParagraphGame() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.split(/[.!?]+/).filter(s=>s.trim()).length;
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <p className="mb-3 font-bold">Try this prompt:</p>
      <p className="mb-4 italic bg-butter/40 p-3 rounded-xl">"Write about your favorite animal. What does it look like? What does it eat? Why do you like it?"</p>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8}
        placeholder="Start writing here..." className="w-full rounded-xl border-2 border-muted p-3 text-base"/>
      <div className="mt-3 flex justify-between text-sm font-bold">
        <span>📝 {words} words</span>
        <span>📄 {sentences} sentences</span>
      </div>
      <button onClick={()=>{if(words>=20){addStars(3);speak("Great paragraph!");}else speak("Try writing at least 20 words!");}}
        className="mt-3 rounded-xl bg-mint px-5 py-2 font-bold">✓ Check my work</button>
    </div>
  );
}

export function MultiplyGame() {
  const [q, setQ] = useState(() => roll());
  const [picked, setPicked] = useState<number|null>(null);
  function roll() {
    const a = 1+Math.floor(Math.random()*10), b = 1+Math.floor(Math.random()*10);
    const ans = a*b;
    const choices = shuffle([ans, ans+1, ans+a, Math.max(1, ans-b)]);
    return { a, b, ans, choices };
  }
  function pick(n: number) {
    setPicked(n);
    if (n===q.ans) { addStars(2); speak("Correct!"); }
    else speak(`The answer is ${q.ans}`);
  }
  return (
    <div className="card-soft mx-auto max-w-md p-6 text-center">
      <div className="text-6xl font-bold font-display mb-6">{q.a} × {q.b} = ?</div>
      <div className="grid grid-cols-2 gap-3">
        {q.choices.map(c=>(
          <button key={c} onClick={()=>!picked&&pick(c)}
            className={`card-soft p-5 text-3xl font-bold ${picked===c ? (c===q.ans ? "bg-mint":"bg-destructive/40") : "bg-butter"}`}>
            {c}
          </button>
        ))}
      </div>
      {picked!==null && <button onClick={()=>{setQ(roll());setPicked(null);}} className="mt-4 rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>}
    </div>
  );
}

const FRACTIONS = [
  { name: "One Half",      frac: "½", pct: 50,  emoji: "🍕" },
  { name: "One Quarter",   frac: "¼", pct: 25,  emoji: "🍕" },
  { name: "Three Quarters",frac: "¾", pct: 75,  emoji: "🍕" },
  { name: "One Third",     frac: "⅓", pct: 33,  emoji: "🥧" },
  { name: "Two Thirds",    frac: "⅔", pct: 66,  emoji: "🥧" },
  { name: "Whole",         frac: "1", pct: 100, emoji: "🍰" },
];
export function FractionsGame() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {FRACTIONS.map((f,i)=>(
        <button key={f.name} onClick={()=>speak(`${f.name}. ${f.pct} percent.`)}
          className={`card-soft tile-pop tile-pop-hover flex flex-col items-center gap-2 p-5 ${toneClass(TONES[i%TONES.length])}`}>
          <div className="relative h-24 w-24 rounded-full bg-white shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-pink" style={{clipPath:`inset(${100-f.pct}% 0 0 0)`}}/>
            <div className="absolute inset-0 grid place-items-center text-4xl">{f.emoji}</div>
          </div>
          <span className="font-bold text-2xl">{f.frac}</span>
          <span className="text-sm">{f.name}</span>
        </button>
      ))}
    </div>
  );
}

const GEOGRAPHY = [
  { name: "USA", emoji: "🇺🇸", fact: "United States — capital Washington D.C." },
  { name: "Canada", emoji: "🇨🇦", fact: "Canada is north of the USA." },
  { name: "Mexico", emoji: "🇲🇽", fact: "Mexico is south of the USA." },
  { name: "UK", emoji: "🇬🇧", fact: "United Kingdom — capital London." },
  { name: "Japan", emoji: "🇯🇵", fact: "Japan is an island country in Asia." },
  { name: "India", emoji: "🇮🇳", fact: "India is in South Asia." },
  { name: "Brazil", emoji: "🇧🇷", fact: "Brazil is the biggest country in South America." },
  { name: "Egypt", emoji: "🇪🇬", fact: "Egypt is in Africa — home of pyramids!" },
];
export function GeographyGame() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {GEOGRAPHY.map((g,i)=>(
        <Card key={g.name} tone={i} big onClick={()=>speak(`${g.name}. ${g.fact}`)}>
          <span className="text-6xl">{g.emoji}</span>
          <span className="font-bold">{g.name}</span>
        </Card>
      ))}
    </div>
  );
}

const ECO = [
  { name: "Forest",  emoji: "🌲", fact: "Trees, deer, birds and bugs live here." },
  { name: "Ocean",   emoji: "🌊", fact: "Fish, whales, and coral live in the sea." },
  { name: "Desert",  emoji: "🏜️", fact: "Hot and dry — home to cactus and camels." },
  { name: "Arctic",  emoji: "🧊", fact: "Cold and icy — polar bears live here." },
  { name: "Jungle",  emoji: "🌴", fact: "Wet and warm — monkeys swing in trees." },
  { name: "Pond",    emoji: "🪷", fact: "Frogs, ducks, and lily pads share the water." },
];
export function EcosystemsGame() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ECO.map((e,i)=>(
        <Card key={e.name} tone={i} big onClick={()=>speak(`${e.name}. ${e.fact}`)}>
          <span className="text-6xl">{e.emoji}</span>
          <span className="font-bold">{e.name}</span>
        </Card>
      ))}
    </div>
  );
}

const MATTER = [
  { state: "Solid",  emoji: "🧊", example: "Ice, rocks, and wood are solid.", color: "bg-sky/40" },
  { state: "Liquid", emoji: "💧", example: "Water, milk, and juice are liquid.", color: "bg-mint/40" },
  { state: "Gas",    emoji: "💨", example: "Air, steam, and wind are gas.", color: "bg-lilac/40" },
];
export function MatterGame() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {MATTER.map(m=>(
        <button key={m.state} onClick={()=>speak(`${m.state}. ${m.example}`)}
          className={`card-soft tile-pop tile-pop-hover p-6 text-center ${m.color}`}>
          <div className="text-7xl mb-3">{m.emoji}</div>
          <div className="font-display font-bold text-2xl mb-2">{m.state}</div>
          <div className="text-sm">{m.example}</div>
        </button>
      ))}
    </div>
  );
}

// Tiny robot reaches the star via sequence
export function CodingGame() {
  const GOAL_X = 3, GOAL_Y = 0;
  const [pos, setPos] = useState({x:0,y:3});
  const [steps, setSteps] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  function add(s: string) { if(!running) setSteps([...steps, s]); }
  function reset() { setPos({x:0,y:3}); setSteps([]); setRunning(false); }
  async function run() {
    setRunning(true);
    let p = {x:0,y:3};
    for (const s of steps) {
      await new Promise(r=>setTimeout(r,400));
      if (s==="⬆️") p = {...p, y: Math.max(0, p.y-1)};
      if (s==="⬇️") p = {...p, y: Math.min(3, p.y+1)};
      if (s==="⬅️") p = {...p, x: Math.max(0, p.x-1)};
      if (s==="➡️") p = {...p, x: Math.min(3, p.x+1)};
      setPos({...p});
    }
    if (p.x===GOAL_X && p.y===GOAL_Y) { addStars(3); speak("You coded it! Amazing!"); }
    else speak("Almost! Try a different sequence.");
    setRunning(false);
  }
  return (
    <div className="card-soft mx-auto max-w-xl p-6 text-center">
      <p className="mb-3 font-bold">Build a sequence to move the 🤖 to the ⭐!</p>
      <div className="mx-auto mb-4 grid w-72 grid-cols-4 gap-1 bg-muted p-2 rounded-xl">
        {Array.from({length:16}).map((_,i)=>{
          const x=i%4, y=Math.floor(i/4);
          const isBot = x===pos.x && y===pos.y;
          const isGoal = x===GOAL_X && y===GOAL_Y;
          return <div key={i} className="aspect-square bg-white rounded grid place-items-center text-2xl">{isBot ? "🤖" : isGoal ? "⭐" : ""}</div>;
        })}
      </div>
      <div className="mb-3 min-h-[3rem] flex flex-wrap justify-center gap-1 p-2 bg-butter/40 rounded-xl">
        {steps.length===0 ? <span className="text-sm text-muted-foreground self-center">Tap arrows below ↓</span>
          : steps.map((s,i)=><span key={i} className="text-2xl">{s}</span>)}
      </div>
      <div className="mb-3 flex justify-center gap-2">
        {["⬆️","⬇️","⬅️","➡️"].map(s=>(
          <button key={s} onClick={()=>add(s)} className="rounded-xl bg-sky px-4 py-3 text-2xl font-bold">{s}</button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={run} disabled={running||steps.length===0} className="rounded-xl bg-mint px-5 py-2 font-bold disabled:opacity-50">▶ Run</button>
        <button onClick={reset} className="rounded-xl bg-muted px-5 py-2 font-bold">↻ Reset</button>
      </div>
    </div>
  );
}
