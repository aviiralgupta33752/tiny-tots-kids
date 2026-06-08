export type Tone = "pink" | "mint" | "butter" | "sky" | "lilac" | "peach";

export const TONES: Tone[] = ["pink", "mint", "butter", "sky", "lilac", "peach"];

export const toneClass = (t: Tone) =>
  ({
    pink: "bg-pink",
    mint: "bg-mint",
    butter: "bg-butter",
    sky: "bg-sky",
    lilac: "bg-lilac",
    peach: "bg-peach",
  })[t];

export const ALPHABET: { letter: string; word: string; emoji: string }[] = [
  { letter: "A", word: "Apple", emoji: "🍎" },
  { letter: "B", word: "Bear", emoji: "🐻" },
  { letter: "C", word: "Cat", emoji: "🐱" },
  { letter: "D", word: "Duck", emoji: "🦆" },
  { letter: "E", word: "Elephant", emoji: "🐘" },
  { letter: "F", word: "Fish", emoji: "🐟" },
  { letter: "G", word: "Giraffe", emoji: "🦒" },
  { letter: "H", word: "Hat", emoji: "🎩" },
  { letter: "I", word: "Ice cream", emoji: "🍦" },
  { letter: "J", word: "Jellyfish", emoji: "🪼" },
  { letter: "K", word: "Kite", emoji: "🪁" },
  { letter: "L", word: "Lion", emoji: "🦁" },
  { letter: "M", word: "Moon", emoji: "🌙" },
  { letter: "N", word: "Nest", emoji: "🪺" },
  { letter: "O", word: "Octopus", emoji: "🐙" },
  { letter: "P", word: "Penguin", emoji: "🐧" },
  { letter: "Q", word: "Queen", emoji: "👑" },
  { letter: "R", word: "Rainbow", emoji: "🌈" },
  { letter: "S", word: "Sun", emoji: "☀️" },
  { letter: "T", word: "Tree", emoji: "🌳" },
  { letter: "U", word: "Umbrella", emoji: "☂️" },
  { letter: "V", word: "Violin", emoji: "🎻" },
  { letter: "W", word: "Whale", emoji: "🐳" },
  { letter: "X", word: "Xylophone", emoji: "🎹" },
  { letter: "Y", word: "Yo-yo", emoji: "🪀" },
  { letter: "Z", word: "Zebra", emoji: "🦓" },
];

export const NUMBERS = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  const words = ["one","two","three","four","five","six","seven","eight","nine","ten"];
  return { n, word: words[i], emoji: "⭐".repeat(n > 5 ? 5 : n) };
});

export const COLORS = [
  { name: "Red", hex: "#ff8a8a", emoji: "🍓" },
  { name: "Orange", hex: "#ffb480", emoji: "🥕" },
  { name: "Yellow", hex: "#ffe680", emoji: "🌼" },
  { name: "Green", hex: "#a8e6a3", emoji: "🌿" },
  { name: "Blue", hex: "#a0c4ff", emoji: "🫐" },
  { name: "Purple", hex: "#c8a8ff", emoji: "🍇" },
  { name: "Pink", hex: "#ffc1d8", emoji: "🌸" },
  { name: "Brown", hex: "#caa472", emoji: "🍪" },
];

export const SHAPES = [
  { name: "Circle", svg: <circle cx="50" cy="50" r="36" /> },
  { name: "Square", svg: <rect x="16" y="16" width="68" height="68" rx="6" /> },
  { name: "Triangle", svg: <polygon points="50,14 88,82 12,82" /> },
  { name: "Star", svg: <polygon points="50,10 61,38 92,40 67,60 76,90 50,73 24,90 33,60 8,40 39,38" /> },
  { name: "Heart", svg: <path d="M50 84 C18 64 14 36 36 28 C46 24 50 34 50 38 C50 34 54 24 64 28 C86 36 82 64 50 84 Z" /> },
  { name: "Diamond", svg: <polygon points="50,12 88,50 50,88 12,50" /> },
];

export const ANIMALS = [
  { name: "Cow", emoji: "🐄", sound: "Moo" },
  { name: "Dog", emoji: "🐶", sound: "Woof" },
  { name: "Cat", emoji: "🐱", sound: "Meow" },
  { name: "Duck", emoji: "🦆", sound: "Quack" },
  { name: "Sheep", emoji: "🐑", sound: "Baa" },
  { name: "Pig", emoji: "🐷", sound: "Oink" },
  { name: "Horse", emoji: "🐴", sound: "Neigh" },
  { name: "Lion", emoji: "🦁", sound: "Roar" },
  { name: "Bee", emoji: "🐝", sound: "Buzz" },
  { name: "Owl", emoji: "🦉", sound: "Hoot" },
  { name: "Frog", emoji: "🐸", sound: "Ribbit" },
  { name: "Rooster", emoji: "🐔", sound: "Cock-a-doodle-doo" },
];

export function speak(text: string, rate = 0.9) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = 1.2;
  const voices = synth.getVoices();
  const preferred = voices.find(v => /female|samantha|karen|google uk english female|kid/i.test(v.name))
    || voices.find(v => v.lang.startsWith("en"));
  if (preferred) u.voice = preferred;
  synth.speak(u);
}
