import { useState } from "react";
import { speak } from "@/lib/speak";
import type { ChildProfile } from "@/hooks/useAuth";

const AGES = [
  { age: 3, emoji: "🐣", label: "3 years old", grade: "Pre-K" },
  { age: 4, emoji: "🌱", label: "4 years old", grade: "Pre-K" },
  { age: 5, emoji: "⭐", label: "5 years old", grade: "Kindergarten" },
  { age: 6, emoji: "📚", label: "6 years old", grade: "Grade 1" },
  { age: 7, emoji: "🏆", label: "7 years old", grade: "Grade 1" },
];

export function OnboardingPage({ onDone }: { onDone: (profile: ChildProfile) => void }) {
  const [step, setStep] = useState<"name" | "age">("name");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);

  function submitName() {
    if (!name.trim()) return;
    setStep("age");
    setTimeout(() => speak(`Hi ${name}! How old are you?`), 300);
  }

  function submitAge(a: number) {
    setAge(a);
    const label = AGES.find(x => x.age === a)!;
    setTimeout(() => {
      speak(`${a} years old! Let's start learning ${name}!`);
      setTimeout(() => onDone({ name: name.trim(), age: a }), 1500);
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #fff5f8 0%, #f0fbf6 50%, #f5f0ff 100%)" }}>
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-4 animate-bounce">🌈</div>

        {step === "name" ? (
          <div className="card-soft rounded-3xl p-8">
            <h2 className="font-display text-3xl font-bold mb-2">What's your child's name?</h2>
            <p className="text-muted-foreground mb-6">We'll personalize their learning experience!</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitName()}
              placeholder="Child's name"
              className="w-full rounded-2xl border-2 border-muted px-4 py-4 mb-4 font-display text-2xl text-center outline-none focus:border-pink transition"
            />
            <button onClick={submitName} disabled={!name.trim()}
              className="w-full rounded-2xl bg-pink py-4 font-bold text-white text-xl disabled:opacity-50 hover:scale-105 transition">
              Next →
            </button>
          </div>
        ) : (
          <div className="card-soft rounded-3xl p-8">
            <h2 className="font-display text-3xl font-bold mb-2">How old is {name}?</h2>
            <p className="text-muted-foreground mb-6">This helps us show the right activities!</p>
            <div className="grid grid-cols-1 gap-3">
              {AGES.map(a => (
                <button key={a.age} onClick={() => submitAge(a.age)}
                  className={`rounded-2xl p-4 font-bold text-xl transition hover:scale-105 flex items-center gap-4 ${age === a.age ? "bg-pink text-white scale-105" : "bg-muted hover:bg-pink/20"}`}>
                  <span className="text-3xl">{a.emoji}</span>
                  <div className="text-left">
                    <div>{a.label}</div>
                    <div className="text-sm font-normal opacity-70">{a.grade}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Grade content mapping
export function getTabsForAge(age: number): string[] {
  if (age === 3) {
    // Early Preschool: colors, shapes, counting 1-10, alphabet recognition,
    // animals, body parts, opposites, basic emotions
    return ["abc","123","colors","shapes","animals","body","opposites","emotions","trace","color","rewards"];
  }
  if (age === 4) {
    // Preschool: letter sounds, writing letters, sorting/patterns,
    // days of week / weather, community helpers, simple puzzles (memory)
    return ["abc","123","colors","shapes","animals","story","phonics","trace","numtrace","memory","body","opposites","sorting","days","helpers","emotions","weather","color","rewards"];
  }
  if (age === 5) {
    // Kindergarten: add letters, sight words, simple math, simple games
    return ["abc","123","colors","shapes","animals","story","spell","count","math","rhyme","phonics","sight","trace","numtrace","sentence","songs","sorting","days","helpers","count100","time","money","plants","maps","match","body","emotions","weather","memory","color","rewards"];
  }
  // Grade 1+ (6-7): everything
  return ["abc","123","colors","shapes","animals","story","spell","count","math","rhyme","phonics","sight","memory","body","emotions","weather","trace","numtrace","sentence","songs","sorting","days","helpers","count100","time","money","plants","maps","placevalue","measure","readcomp","match","quiz","color","rewards"];
}
