import { useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup";

export function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setError(""); setMessage(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        setMessage("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth();
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      onAuth();
    } catch (e: any) {
      setError(e.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #fff5f8 0%, #f0fbf6 50%, #f5f0ff 100%)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🌈</div>
          <h1 className="font-display text-4xl font-bold">Tiny Tots</h1>
          <p className="text-muted-foreground mt-1">Learning is fun!</p>
        </div>

        <div className="card-soft rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold text-center mb-1">
            {mode === "login" ? "Welcome back! 👋" : "Join Tiny Tots! 🌟"}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Sign in to continue your child's learning" : "Create a free parent account"}
          </p>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-muted py-3 font-bold mb-4 hover:border-pink transition">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-muted" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-muted" />
          </div>

          {mode === "signup" && (
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border-2 border-muted px-4 py-3 mb-3 font-medium outline-none focus:border-pink transition" />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" type="email"
            className="w-full rounded-2xl border-2 border-muted px-4 py-3 mb-3 font-medium outline-none focus:border-pink transition" />
          <input value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" type="password"
            className="w-full rounded-2xl border-2 border-muted px-4 py-3 mb-4 font-medium outline-none focus:border-pink transition" />

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full rounded-2xl bg-pink py-4 font-bold text-white text-lg transition hover:scale-105 disabled:opacity-60">
            {loading ? "..." : mode === "login" ? "Log In" : "Create Account"}
          </button>

          <p className="text-center text-sm mt-4 text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
              className="font-bold text-pink">
              {mode === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
