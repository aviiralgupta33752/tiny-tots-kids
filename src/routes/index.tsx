import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/LearnApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tiny Tots ABC — Learn Letters, Numbers, Colors & More" },
      { name: "description", content: "A soft, playful kids' learning app: alphabet, numbers, colors, shapes, animal sounds, tracing, matching and quiz." },
      { property: "og:title", content: "Tiny Tots ABC" },
      { property: "og:description", content: "Learn ABCs, 123s, colors, shapes and animal sounds with soft pastel fun." },
    ],
  }),
  component: Index,
});

function Index() {
  return <LearnApp childProfile={{ name: "Friend", age: 4 }} onSignOut={() => {}} />;
}
