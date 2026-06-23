import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Coin { name: string; value: number; emoji: string; color: string; }
const COINS: Coin[] = [
  { name: "Penny",   value: 1,  emoji: "🟤", color: "bg-amber-200" },
  { name: "Nickel",  value: 5,  emoji: "⚪", color: "bg-gray-200" },
  { name: "Dime",    value: 10, emoji: "⚪", color: "bg-gray-300" },
  { name: "Quarter", value: 25, emoji: "⚪", color: "bg-gray-400" },
];

type Mode = "learn" | "count" | "shop";

export function MoneyBasics() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          🪙 Learn Coins
        </button>
        <button onClick={() => setMode("count")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "count" ? "bg-pink text-white" : "bg-muted"}`}>
          ➕ Count Money
        </button>
        <button onClick={() => setMode("shop")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "shop" ? "bg-pink text-white" : "bg-muted"}`}>
          🛒 Pretend Shop
        </button>
      </div>
      {mode === "learn" && <LearnCoins />}
      {mode === "count" && <CountMoney />}
      {mode === "shop" && <PretendShop />}
    </div>
  );
}

function LearnCoins() {
  const [index, setIndex] = useState(0);
  const coin = COINS[index];
  return (
    <div className="text-center">
      <div className={`rounded-full ${coin.color} w-32 h-32 mx-auto flex items-center justify-center mb-4 border-4 border-foreground/20`}>
        <span className="text-5xl">{coin.emoji}</span>
      </div>
      <p className="font-display text-2xl font-bold mb-1">{coin.name}</p>
      <p className="text-sm text-muted-foreground mb-4">Worth {coin.value} cent{coin.value > 1 ? "s" : ""}</p>
      <button onClick={() => speak(`A ${coin.name} is worth ${coin.value} cents.`)}
        className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear it
      </button>
      <div className="flex justify-center gap-2">
        {COINS.map((c, i) => (
          <button key={c.name} onClick={() => { setIndex(i); speak(`A ${c.name} is worth ${c.value} cents.`); }}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function CountMoney() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const coinCount = 2 + (r % 3);
    const coins = Array.from({ length: coinCount }, () => COINS[Math.floor(Math.random() * 2)]); // pennies + nickels for simplicity
    const total = coins.reduce((sum, c) => sum + c.value, 0);
    const others = [total + 1, total - 1, total + 5].filter(n => n > 0 && n !== total);
    const options = [total, ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
    return { coins, total, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.total) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! That's ${data.total} cents!`);
    } else {
      speak(`Good try! That's ${data.total} cents.`);
    }
  }

  function next() {
    const newRound = round + 1;
    setRound(newRound);
    setData(buildRound(newRound));
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <p className="mb-4 text-lg font-bold">How many cents in total?</p>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {data.coins.map((c, i) => (
          <div key={i} className={`rounded-full ${c.color} w-16 h-16 flex items-center justify-center border-2 border-foreground/20`}>
            <span className="text-2xl">{c.emoji}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === data.total;
          return (
            <button key={n} onClick={() => pick(n)} disabled={selected !== null}
              className={`font-display text-xl font-bold rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === n ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {n}¢
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
      )}
    </div>
  );
}

interface ShopItem { name: string; emoji: string; price: number; }
const SHOP_ITEMS: ShopItem[] = [
  { name: "Apple",   emoji: "🍎", price: 10 },
  { name: "Cookie",  emoji: "🍪", price: 15 },
  { name: "Sticker", emoji: "⭐", price: 5 },
  { name: "Toy Car", emoji: "🚗", price: 25 },
];

function PretendShop() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const item = SHOP_ITEMS[round % SHOP_ITEMS.length];
  const options = (() => {
    const others = [item.price + 5, item.price - 5, item.price + 10].filter(n => n > 0 && n !== item.price);
    return [item.price, ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
  })();

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === item.price) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! The ${item.name} costs ${item.price} cents!`);
    } else {
      speak(`Good try! The ${item.name} costs ${item.price} cents.`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} purchases</div>
      <div className="rounded-3xl bg-butter/30 p-6 mb-4 inline-block">
        <div className="text-6xl mb-2">{item.emoji}</div>
        <div className="font-display text-xl font-bold">{item.name}</div>
      </div>
      <p className="mb-4 text-lg font-bold">How many cents does it cost?</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === item.price;
          return (
            <button key={n} onClick={() => pick(n)} disabled={selected !== null}
              className={`font-display text-xl font-bold rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === n ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {n}¢
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
      )}
    </div>
  );
}
