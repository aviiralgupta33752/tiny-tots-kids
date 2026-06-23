import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Helper {
  name: string;
  emoji: string;
  job: string;
  tool: string;
  toolEmoji: string;
}

const HELPERS: Helper[] = [
  { name: "Doctor",     emoji: "👩‍⚕️", job: "helps people feel better when they are sick", tool: "stethoscope", toolEmoji: "🩺" },
  { name: "Firefighter",emoji: "👨‍🚒", job: "puts out fires and keeps us safe", tool: "fire truck", toolEmoji: "🚒" },
  { name: "Teacher",    emoji: "👩‍🏫", job: "helps children learn new things", tool: "book", toolEmoji: "📚" },
  { name: "Police Officer", emoji: "👮", job: "keeps our streets and community safe", tool: "badge", toolEmoji: "🛡️" },
  { name: "Mail Carrier", emoji: "📬", job: "delivers letters and packages to our homes", tool: "mailbag", toolEmoji: "📦" },
  { name: "Farmer",     emoji: "👨‍🌾", job: "grows food for everyone to eat", tool: "tractor", toolEmoji: "🚜" },
  { name: "Chef",       emoji: "👨‍🍳", job: "cooks yummy food at restaurants", tool: "frying pan", toolEmoji: "🍳" },
  { name: "Veterinarian", emoji: "🐾", job: "takes care of sick and hurt animals", tool: "pet carrier", toolEmoji: "🐕" },
];

type Mode = "learn" | "quiz";

export function CommunityHelpers() {
  const [mode, setMode] = useState<Mode>("learn");
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const helper = HELPERS[index];

  function speakHelper(h: Helper) {
    speak(`A ${h.name} ${h.job}.`);
  }

  const quizHelper = HELPERS[round % HELPERS.length];
  const quizOptions = (() => {
    const others = HELPERS.filter(h => h.name !== quizHelper.name).map(h => h.toolEmoji).sort(() => Math.random() - 0.5).slice(0, 2);
    return [quizHelper.toolEmoji, ...others].sort(() => Math.random() - 0.5);
  })();

  function pickAnswer(toolEmoji: string) {
    if (selected) return;
    setSelected(toolEmoji);
    if (toolEmoji === quizHelper.toolEmoji) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! A ${quizHelper.name} uses a ${quizHelper.tool}!`);
    } else {
      speak(`Good try! A ${quizHelper.name} uses a ${quizHelper.tool}.`);
    }
  }

  function nextQuiz() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 Learn
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>

      {mode === "learn" ? (
        <div className="text-center">
          <div className="rounded-3xl bg-butter/30 p-8 mb-4">
            <div className="text-6xl mb-3">{helper.emoji}</div>
            <div className="font-display text-2xl font-bold mb-2">{helper.name}</div>
            <div className="text-sm text-muted-foreground mb-2">A {helper.name.toLowerCase()} {helper.job}.</div>
            <div className="text-3xl">{helper.toolEmoji}</div>
            <div className="text-xs text-muted-foreground">uses a {helper.tool}</div>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <button onClick={() => { const i = (index - 1 + HELPERS.length) % HELPERS.length; setIndex(i); speakHelper(HELPERS[i]); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
            <button onClick={() => speakHelper(helper)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
            <button onClick={() => { const i = (index + 1) % HELPERS.length; setIndex(i); speakHelper(HELPERS[i]); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {HELPERS.map((h, i) => (
              <button key={h.name} onClick={() => { setIndex(i); speakHelper(h); }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
                {h.emoji} {h.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
          <p className="mb-2 text-5xl">{quizHelper.emoji}</p>
          <p className="mb-4 text-lg font-bold">
            What tool does a <span className="text-pink">{quizHelper.name}</span> use?
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
            {quizOptions.map(toolEmoji => {
              const showState = selected !== null;
              const isCorrect = toolEmoji === quizHelper.toolEmoji;
              return (
                <button key={toolEmoji} onClick={() => pickAnswer(toolEmoji)} disabled={!!selected}
                  className={`text-4xl rounded-2xl p-4 transition ${
                    showState && isCorrect ? "bg-green-200 scale-105" :
                    showState && selected === toolEmoji ? "bg-red-200" :
                    "bg-sky/30 hover:scale-105"
                  }`}>
                  {toolEmoji}
                </button>
              );
            })}
          </div>
          {selected && (
            <button onClick={nextQuiz} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
          )}
        </div>
      )}
    </div>
  );
}
