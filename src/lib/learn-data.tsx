import React from "react";

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
  { letter: "A", word: "Apple",     emoji: "🍎" },
  { letter: "B", word: "Bear",      emoji: "🐻" },
  { letter: "C", word: "Cat",       emoji: "🐱" },
  { letter: "D", word: "Duck",      emoji: "🦆" },
  { letter: "E", word: "Elephant",  emoji: "🐘" },
  { letter: "F", word: "Fish",      emoji: "🐟" },
  { letter: "G", word: "Giraffe",   emoji: "🦒" },
  { letter: "H", word: "Hat",       emoji: "🎩" },
  { letter: "I", word: "Ice cream", emoji: "🍦" },
  { letter: "J", word: "Jellyfish", emoji: "🪼" },
  { letter: "K", word: "Kite",      emoji: "🪁" },
  { letter: "L", word: "Lion",      emoji: "🦁" },
  { letter: "M", word: "Moon",      emoji: "🌙" },
  { letter: "N", word: "Nest",      emoji: "🪺" },
  { letter: "O", word: "Octopus",   emoji: "🐙" },
  { letter: "P", word: "Penguin",   emoji: "🐧" },
  { letter: "Q", word: "Queen",     emoji: "👑" },
  { letter: "R", word: "Rainbow",   emoji: "🌈" },
  { letter: "S", word: "Sun",       emoji: "☀️" },
  { letter: "T", word: "Tree",      emoji: "🌳" },
  { letter: "U", word: "Umbrella",  emoji: "☂️" },
  { letter: "V", word: "Violin",    emoji: "🎻" },
  { letter: "W", word: "Whale",     emoji: "🐳" },
  { letter: "X", word: "Xylophone", emoji: "🎹" },
  { letter: "Y", word: "Yo-yo",     emoji: "🪀" },
  { letter: "Z", word: "Zebra",     emoji: "🦓" },
];

export const NUMBERS = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  const words = ["one","two","three","four","five","six","seven","eight","nine","ten"];
  const emojis = ["⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐","🌟🌟🌟🌟🌟🌟","🌟🌟🌟🌟🌟🌟🌟","🌟🌟🌟🌟🌟🌟🌟🌟","🌟🌟🌟🌟🌟🌟🌟🌟🌟","🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆"];
  return { n, word: words[i], emoji: emojis[i] };
});

export const COLORS = [
  { name: "Red",    hex: "#ff8a8a", emoji: "🍓", phrase: "Red. A red strawberry." },
  { name: "Orange", hex: "#ffb480", emoji: "🥕", phrase: "Orange. An orange carrot." },
  { name: "Yellow", hex: "#ffe680", emoji: "🌼", phrase: "Yellow. A yellow flower." },
  { name: "Green",  hex: "#a8e6a3", emoji: "🌿", phrase: "Green. A green leaf." },
  { name: "Blue",   hex: "#a0c4ff", emoji: "🫐", phrase: "Blue. A blue berry." },
  { name: "Purple", hex: "#c8a8ff", emoji: "🍇", phrase: "Purple. Purple grapes." },
  { name: "Pink",   hex: "#ffc1d8", emoji: "🌸", phrase: "Pink. A pink blossom." },
  { name: "Brown",  hex: "#caa472", emoji: "🍪", phrase: "Brown. A brown cookie." },
];

export const SHAPES = [
  { name: "Circle",   svg: <circle cx="50" cy="50" r="36" /> },
  { name: "Square",   svg: <rect x="16" y="16" width="68" height="68" rx="6" /> },
  { name: "Triangle", svg: <polygon points="50,14 88,82 12,82" /> },
  { name: "Star",     svg: <polygon points="50,10 61,38 92,40 67,60 76,90 50,73 24,90 33,60 8,40 39,38" /> },
  { name: "Heart",    svg: <path d="M50 84 C18 64 14 36 36 28 C46 24 50 34 50 38 C50 34 54 24 64 28 C86 36 82 64 50 84 Z" /> },
  { name: "Diamond",  svg: <polygon points="50,12 88,50 50,88 12,50" /> },
];

export const ANIMALS = [
  { name: "Cow",     emoji: "🐄", sound: "Moo" },
  { name: "Dog",     emoji: "🐶", sound: "Woof" },
  { name: "Cat",     emoji: "🐱", sound: "Meow" },
  { name: "Duck",    emoji: "🦆", sound: "Quack" },
  { name: "Sheep",   emoji: "🐑", sound: "Baa" },
  { name: "Pig",     emoji: "🐷", sound: "Oink" },
  { name: "Horse",   emoji: "🐴", sound: "Neigh" },
  { name: "Lion",    emoji: "🦁", sound: "Roar" },
  { name: "Monkey",  emoji: "🐒", sound: "Ooh ooh" },
  { name: "Owl",     emoji: "🦉", sound: "Hoot" },
  { name: "Frog",    emoji: "🐸", sound: "Ribbit" },
  { name: "Rooster", emoji: "🐔", sound: "Cock-a-doodle-doo" },
];

// Sight words for early readers
export const SIGHT_WORDS = [
  "the","and","a","to","said","in","he","I","of","it",
  "was","you","they","on","she","is","his","at","be","my",
  "we","that","with","all","can","her","there","were","do","an",
  "your","are","up","had","have","but","not","what","out","go",
  "so","get","like","one","this","day","time","no","come","its",
];

// Body parts
export const BODY_PARTS = [
  { name: "Head",    emoji: "🗣️",  fact: "Your head holds your brain!" },
  { name: "Eyes",    emoji: "👀",  fact: "Eyes help you see!" },
  { name: "Ears",    emoji: "👂",  fact: "Ears help you hear!" },
  { name: "Nose",    emoji: "👃",  fact: "Nose helps you smell!" },
  { name: "Mouth",   emoji: "👄",  fact: "Mouth helps you eat and talk!" },
  { name: "Hands",   emoji: "👐",  fact: "Hands help you touch and hold!" },
  { name: "Feet",    emoji: "🦶",  fact: "Feet help you walk and run!" },
  { name: "Heart",   emoji: "❤️",  fact: "Heart pumps blood all around!" },
  { name: "Tummy",   emoji: "🫃",  fact: "Tummy digests your food!" },
  { name: "Legs",    emoji: "🦵",  fact: "Legs help you stand and jump!" },
];

// Emotions
export const EMOTIONS = [
  { name: "Happy",    emoji: "😊", color: "#ffe680", description: "When something good happens!" },
  { name: "Sad",      emoji: "😢", color: "#a0c4ff", description: "When something makes you feel bad." },
  { name: "Angry",    emoji: "😠", color: "#ff8a8a", description: "When something is not fair!" },
  { name: "Scared",   emoji: "😨", color: "#c8a8ff", description: "When something feels dangerous." },
  { name: "Excited",  emoji: "🤩", color: "#ffb480", description: "When something amazing is happening!" },
  { name: "Surprised",emoji: "😲", color: "#b5ead7", description: "When something unexpected happens!" },
  { name: "Tired",    emoji: "😴", color: "#dfe6e9", description: "When you need rest." },
  { name: "Silly",    emoji: "🤪", color: "#ffc6ff", description: "When you want to make people laugh!" },
];

export { speak } from "./speak";
