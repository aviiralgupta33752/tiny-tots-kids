import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface SentenceBank {
  topic: string;
  emoji: string;
  intro: string;
  middleOptions: string[];
  endOptions: string[];
}

const TOPICS: SentenceBank[] = [
  {
    topic: "My Pet", emoji: "🐶",
    intro: "I have a pet that I love very much.",
    middleOptions: [
      "My pet likes to play outside every day.",
      "My pet is very soft and fluffy.",
      "My pet always makes me laugh.",
    ],
    endOptions: [
      "I am so happy to have a pet like this!",
      "My pet is my best friend.",
      "I take good care of my pet every day.",
    ],
  },
  {
    topic: "My Favorite Day", emoji: "☀️",
    intro: "My favorite day was full of fun and happy moments.",
    middleOptions: [
      "First, I woke up and ate a yummy breakfast.",
      "Then, I played outside with my friends.",
      "We went on a fun adventure together.",
    ],
    endOptions: [
      "It was the best day ever!",
      "I can't wait to do it again.",
      "I will remember this day forever.",
    ],
  },
  {
    topic: "A Trip to the Zoo", emoji: "🦁",
    intro: "Last weekend, I went to the zoo with my family.",
    middleOptions: [
      "We saw a lion roaring loudly in its cage.",
      "The monkeys were swinging and playing together.",
      "I fed a giraffe with a long, sticky tongue.",
    ],
    endOptions: [
      "It was an amazing day at the zoo!",
      "I learned so much about animals.",
      "I hope to visit the zoo again soon.",
    ],
  },
];

type Stage = "build" | "done";

export function ParagraphWriting() {
  const [topicIndex, setTopicIndex] = useState(0);
  const [middleChoice, setMiddleChoice] = useState<string | null>(null);
  const [endChoice, setEndChoice] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("build");
  const topic = TOPICS[topicIndex];

  function finish() {
    if (!middleChoice || !endChoice) return;
    setStage("done");
    addStars(5);
    const paragraph = `${topic.intro} ${middleChoice} ${endChoice}`;
    speak(paragraph);
  }

  function newTopic() {
    const next = (topicIndex + 1) % TOPICS.length;
    setTopicIndex(next);
    setMiddleChoice(null);
    setEndChoice(null);
    setStage("build");
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="text-5xl mb-2">{topic.emoji}</div>
      <h3 className="font-display text-2xl font-bold mb-4">{topic.topic}</h3>

      {stage === "build" ? (
        <div>
          <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">Beginning</p>
          <div className="rounded-2xl bg-butter/30 p-3 mb-4 font-semibold">{topic.intro}</div>

          <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">Middle — pick one</p>
          <div className="grid gap-2 mb-4">
            {topic.middleOptions.map(opt => (
              <button key={opt} onClick={() => setMiddleChoice(opt)}
                className={`rounded-2xl p-3 text-sm font-semibold transition text-left ${middleChoice === opt ? "bg-pink text-white" : "bg-sky/30 hover:scale-[1.02]"}`}>
                {opt}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">Ending — pick one</p>
          <div className="grid gap-2 mb-6">
            {topic.endOptions.map(opt => (
              <button key={opt} onClick={() => setEndChoice(opt)}
                className={`rounded-2xl p-3 text-sm font-semibold transition text-left ${endChoice === opt ? "bg-pink text-white" : "bg-mint/30 hover:scale-[1.02]"}`}>
                {opt}
              </button>
            ))}
          </div>

          <button onClick={finish} disabled={!middleChoice || !endChoice}
            className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white disabled:opacity-40">
            Finish My Paragraph →
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">Your Paragraph</p>
          <div className="rounded-2xl bg-lilac/20 p-5 mb-4 text-left leading-relaxed">
            {topic.intro} {middleChoice} {endChoice}
          </div>
          <p className="mb-4 text-lg font-bold">🎉 You wrote a 3-sentence paragraph!</p>
          <button onClick={() => speak(`${topic.intro} ${middleChoice} ${endChoice}`)}
            className="mb-3 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
            🔊 Read it aloud
          </button>
          <br />
          <button onClick={newTopic} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">
            Write Another →
          </button>
        </div>
      )}
    </div>
  );
}
