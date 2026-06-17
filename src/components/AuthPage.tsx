import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup" | "forgot";

export function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`,
        });
        if (error) throw error;
        setMessage("Check your email for a password reset link!");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #fff5f8 0%, #f0fbf6 50%, #f5f0ff 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-bounce">🌈</div>
          <h1 className="font-display text-4xl font-bold">Tiny Tots</h1>
          <p className="text-muted-foreground mt-1">Learning is fun!</p>
        </div>

        <div className="card-soft rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold text-center mb-1">
            {mode === "login" ? "Welcome back! 👋" : mode === "signup" ? "Join Tiny Tots! 🌟" : "Reset Password 🔑"}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Sign in to continue your child's learning"
              : mode === "signup" ? "Create a free parent account"
              : "We'll email you a link to reset your password"}
          </p>

          {mode === "signup" && (
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border-2 border-muted px-4 py-3 mb-3 font-medium outline-none focus:border-pink transition" />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" type="email"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="w-full rounded-2xl border-2 border-muted px-4 py-3 mb-3 font-medium outline-none focus:border-pink transition" />

          {mode !== "forgot" && (
            <div className="relative mb-2">
              <input value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" type={showPassword ? "text" : "password"}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-2xl border-2 border-muted px-4 py-3 pr-12 font-medium outline-none focus:border-pink transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          )}

          {mode === "login" && (
            <div className="text-right mb-4">
              <button onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}
                className="text-sm font-bold text-pink">
                Forgot password?
              </button>
            </div>
          )}
          {mode !== "login" && <div className="mb-4" />}

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full rounded-2xl bg-pink py-4 font-bold text-white text-lg transition hover:scale-105 disabled:opacity-60">
            {loading ? "..." : mode === "login" ? "Log In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>

          <p className="text-center text-sm mt-4 text-muted-foreground">
            {mode === "forgot" ? (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="font-bold text-pink">
                ← Back to log in
              </button>
            ) : (
              <>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
                  className="font-bold text-pink">
                  {mode === "login" ? "Sign up free" : "Log in"}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
