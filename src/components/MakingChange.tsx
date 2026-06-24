import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface ShopItem { name: string; emoji: string; price: number; }
const SHOP_ITEMS: ShopItem[] = [
  { name: "Apple",   emoji: "🍎", price: 35 },
  { name: "Cookie",  emoji: "🍪", price: 60 },
  { name: "Sticker", emoji: "⭐", price: 20 },
  { name: "Toy Car", emoji: "🚗", price: 75 },
  { name: "Yo-yo",   emoji: "🪀", price: 45 },
];

const PAY_AMOUNTS = [50, 100];

export function MakingChange() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    let item = SHOP_ITEMS[r % SHOP_ITEMS.length];
    let paid = PAY_AMOUNTS[Math.floor(Math.random() * PAY_AMOUNTS.length)];
    // Make sure paid amount is always more than the price
    while (paid <= item.price) {
      paid = 100;
    }
    const change = paid - item.price;
    const others = new Set<number>();
    while (others.size < 2) {
      const c = change + (Math.floor(Math.random() * 21) - 10);
      if (c !== change && c >= 0) others.add(c);
    }
    const options = [change, ...others].sort(() => Math.random() - 0.5);
    return { item, paid, change, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.change) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! You get ${data.change} cents back!`);
    } else {
      speak(`You paid ${data.paid} cents for a ${data.item.price} cent item, so you get ${data.change} cents back.`);
    }
  }

  function next() {
    const newRound = round + 1;
    setRound(newRound);
    setData(buildRound(newRound));
    setSelected(null);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">How much change do you get back?</p>

      <div className="rounded-3xl bg-butter/30 p-6 mb-4 inline-block">
        <div className="text-5xl mb-2">{data.item.emoji}</div>
        <div className="font-display text-lg font-bold">{data.item.name}</div>
        <div className="text-sm text-muted-foreground">Costs {data.item.price}¢</div>
      </div>

      <p className="mb-4 font-bold">
        You pay <span className="text-pink">{data.paid}¢</span>. How much change?
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === data.change;
          return (
            <button key={n} onClick={() => pick(n)} disabled={selected !== null}
              className={`font-display text-lg font-bold rounded-2xl p-4 transition ${
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
