import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Question { q: string; options: string[]; answer: string; }
interface Story {
  title: string;
  emoji: string;
  text: string[];
  questions: Question[];
}

const STORIES: Story[] = [
  {
    title: "Max the Dog",
    emoji: "🐶",
    text: [
      "Max was a happy brown dog.",
      "Every morning, Max ran to the park.",
      "At the park, Max played with a red ball.",
      "Max got tired and took a nap under a big tree.",
    ],
    questions: [
      { q: "What color was Max?", options: ["Brown", "Black", "White"], answer: "Brown" },
      { q: "Where did Max go every morning?", options: ["The park", "The beach", "School"], answer: "The park" },
      { q: "What color was the ball?", options: ["Red", "Blue", "Green"], answer: "Red" },
    ],
  },
  {
    title: "The Lost Kitten",
    emoji: "🐱",
    text: [
      "A small kitten named Luna got lost in the garden.",
      "Luna looked behind the flowers, but found nothing.",
      "Then Luna heard her mom calling her name.",
      "Luna ran to her mom and they went home together.",
    ],
    questions: [
      { q: "What was the kitten's name?", options: ["Luna", "Mia", "Bella"], answer: "Luna" },
      { q: "Where did Luna get lost?", options: ["The garden", "The kitchen", "The park"], answer: "The garden" },
      { q: "Who came to find Luna?", options: ["Her mom", "Her dad", "A friend"], answer: "Her mom" },
    ],
  },
  {
    title: "Sam's Sandcastle",
    emoji: "🏖️",
    text: [
      "Sam went to the beach with a yellow bucket.",
      "Sam filled the bucket with wet sand.",
      "Sam built a tall sandcastle with three towers.",
      "A wave came and washed the sandcastle away!",
    ],
    questions: [
      { q: "What color was Sam's bucket?", options: ["Yellow", "Purple", "Orange"], answer: "Yellow" },
      { q: "How many towers did the sandcastle have?", options: ["Three", "Two", "Five"], answer: "Three" },
      { q: "What washed the sandcastle away?", options: ["A wave", "The wind", "A dog"], answer: "A wave" },
    ],
  },
];

type Stage = "reading" | "quiz" | "done";

export function ReadingComprehension() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("reading");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const story = STORIES[storyIndex];

  function readStory() {
    speak(story.text.join(" "));
  }

  function startQuiz() {
    setStage("quiz");
    setQIndex(0);
    setScore(0);
    setSelected(null);
  }

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    const correct = opt === story.questions[qIndex].answer;
    if (correct) {
      addStars(2);
      setScore(s => s + 1);
      speak("Correct! Great reading!");
    } else {
      speak(`Good try! The answer was ${story.questions[qIndex].answer}.`);
    }
  }

  function nextQuestion() {
    if (qIndex + 1 < story.questions.length) {
      setQIndex(qIndex + 1);
      setSelected(null);
    } else {
      setStage("done");
    }
  }

  function newStory() {
    const next = (storyIndex + 1) % STORIES.length;
    setStoryIndex(next);
    setStage("reading");
    setQIndex(0);
    setSelected(null);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="text-5xl mb-2">{story.emoji}</div>
      <h3 className="font-display text-2xl font-bold mb-4">{story.title}</h3>

      {stage === "reading" && (
        <div>
          <div className="rounded-2xl bg-butter/30 p-6 mb-4 text-left">
            {story.text.map((line, i) => (
              <p key={i} className="mb-2 text-lg">{line}</p>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={readStory} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Read aloud</button>
            <button onClick={startQuiz} className="rounded-2xl bg-pink px-5 py-3 font-bold text-white">Answer Questions →</button>
          </div>
        </div>
      )}

      {stage === "quiz" && (
        <div>
          <p className="mb-2 text-sm font-bold text-muted-foreground">Question {qIndex + 1} of {story.questions.length}</p>
          <p className="mb-4 text-lg font-bold">{story.questions[qIndex].q}</p>
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto mb-4">
            {story.questions[qIndex].options.map(opt => {
              const showState = selected !== null;
              const isCorrect = opt === story.questions[qIndex].answer;
              return (
                <button key={opt} onClick={() => pick(opt)} disabled={!!selected}
                  className={`rounded-2xl p-3 font-bold transition ${
                    showState && isCorrect ? "bg-green-200" :
                    showState && selected === opt ? "bg-red-200" :
                    "bg-sky/30 hover:scale-105"
                  }`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {selected && (
            <button onClick={nextQuestion} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">
              {qIndex + 1 < story.questions.length ? "Next Question →" : "See Results →"}
            </button>
          )}
        </div>
      )}

      {stage === "done" && (
        <div>
          <p className="mb-2 text-2xl font-bold">🎉 You got {score} out of {story.questions.length}!</p>
          <p className="mb-4 text-sm text-muted-foreground">Great job reading and remembering the story!</p>
          <button onClick={newStory} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Read Another Story →</button>
        </div>
      )}
    </div>
  );
}
