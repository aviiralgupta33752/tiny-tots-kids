import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/LearnApp";
import { AuthPage } from "@/components/AuthPage";
import { OnboardingPage } from "@/components/OnboardingPage";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Tiny Tots — Learn Letters, Numbers, Colors & More" },
      { name: "description", content: "A fun interactive learning app for kids ages 3-7." },
    ],
  }),
  component: Index,
}));

function Index() {
  const { user, loading, childProfile, saveProfile, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fff5f8, #f0fbf6)" }}>
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🌈</div>
          <p className="font-bold text-xl">Loading Tiny Tots...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={() => {}} />;
  }

  if (!childProfile) {
    return <OnboardingPage onDone={saveProfile} />;
  }

  return <LearnApp childProfile={childProfile} onSignOut={signOut} />;
}
