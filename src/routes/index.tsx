import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/LearnApp";
import { OnboardingPage } from "@/components/OnboardingPage";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Tiny Tots — Learn, Play, Grow!" },
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

  if (user && childProfile) {
    return <LearnApp childProfile={childProfile} onSignOut={signOut} />;
  }

  if (user && !childProfile) {
    return <OnboardingPage onDone={saveProfile} />;
  }

  return <LandingPage />;
}

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("signup");

  function openSignup() { setMode("signup"); setShowAuth(true); }
  function openLogin() { setMode("login"); setShowAuth(true); }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#fffbf5", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />

      {showAuth && <AuthModal mode={mode} setMode={setMode} onClose={() => setShowAuth(false)} />}

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.6rem", display: "flex", alignItems: "center", gap: ".5rem" }}>🌈 Tiny Tots</div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={openLogin} style={outlineBtn}>Log In</button>
          <button onClick={openSignup} style={pinkBtn}>Sign Up Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", textAlign: "center", background: "linear-gradient(160deg, #fff5f8 0%, #f0fbf6 40%, #f5f0ff 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <div style={{ display: "inline-block", background: "#b5ead7", borderRadius: 999, padding: ".4rem 1.2rem", fontWeight: 800, fontSize: ".9rem", marginBottom: "1.2rem" }}>🎉 100% Free — No Credit Card Needed</div>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
            {["🐱","🐶","🦒","🐯","🐼"].map((e,i) => (
              <span key={i} style={{ display: "inline-block", animation: `float 3s ease-in-out ${i*0.5}s infinite`, marginRight: ".5rem" }}>{e}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(3rem,8vw,5.5rem)", lineHeight: 1.05, marginBottom: "1.2rem" }}>
            Where Kids <span style={{ color: "#ff8fab" }}>Love</span> to Learn!
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 2.5rem" }}>
            Tiny Tots is the interactive learning app built for kids ages 3–7. ABCs, numbers, animals, math, spelling and more — all wrapped in games your child will love!
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <button onClick={openSignup} style={{ ...pinkBtn, padding: "1rem 2.5rem", fontSize: "1.15rem" }}>🚀 Start Learning Free</button>
            <button onClick={openLogin} style={{ ...outlineBtn, padding: "1rem 2.5rem", fontSize: "1.15rem" }}>Log In</button>
          </div>
          <p style={{ fontSize: ".85rem", color: "#888" }}>✨ No ads · No in-app purchases · Safe for kids</p>
        </div>
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }`}</style>
      </section>

      {/* WHY */}
      <section style={{ padding: "5rem 2rem", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: ".5rem" }}>Why Parents Choose Tiny Tots 💛</h2>
          <p style={{ color: "#666", fontSize: "1rem" }}>Everything your child needs to build a strong learning foundation</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          {[
            { icon: "🎮", title: "Learning Through Play", desc: "Every lesson is a game. Kids earn stars, unlock levels and keep daily streaks — making them WANT to come back!" },
            { icon: "🎯", title: "Built for Their Age", desc: "Content automatically adjusts to your child's age. A 3-year-old sees colors and animals. A 7-year-old gets math!" },
            { icon: "🔊", title: "Real Animal Sounds", desc: "Not robot noises — actual animal sounds. Kids hear a real dog bark, lion roar, and monkey call!" },
            { icon: "👩‍🏫", title: "Interactive Teacher", desc: "When a child gets something wrong, a friendly teacher appears and visually walks them through the answer!" },
            { icon: "🦊", title: "Custom Avatar Buddy", desc: "Kids pick their own animal buddy, choose colors and add accessories. Their buddy cheers them on!" },
            { icon: "🔒", title: "100% Safe & Ad-Free", desc: "No ads. No in-app purchases. No scary content. Just pure, safe, educational fun for young children." },
          ].map((f,i) => (
            <div key={i} style={{ background: "#fafafa", borderRadius: 28, padding: "2rem", transition: "transform .25s, box-shadow .25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.3rem", marginBottom: ".5rem" }}>{f.title}</h3>
              <p style={{ color: "#666", lineHeight: 1.65, fontSize: ".95rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section style={{ padding: "5rem 2rem", background: "linear-gradient(135deg,#f5f0ff,#f0fbf6)" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: ".5rem" }}>What We Teach 📚</h2>
          <p style={{ color: "#666" }}>A complete early learning curriculum packed into every game</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", maxWidth: 900, margin: "0 auto" }}>
          {["🔤 Alphabet","🔢 Numbers","🎨 Colors","⭐ Shapes","🐾 Animals & Sounds","📖 Stories","✍️ Spelling","➕ Math","🎵 Rhyming","👁️ Sight Words","✏️ Tracing","🧩 Memory","🫀 Body Parts","😊 Emotions","☀️ Weather","🖍️ Coloring"].map((s,i) => (
            <div key={i} style={{ borderRadius: 999, padding: ".8rem 1.6rem", fontWeight: 800, fontSize: ".95rem", background: ["#fff5f8","#f0fbf6","#f5f5ff","#fffbf0"][i%4] }}>{s}</div>
          ))}
        </div>
      </section>

      {/* AGE GROUPS */}
      <section style={{ padding: "5rem 2rem", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: ".5rem" }}>Perfect for Every Age 🎂</h2>
          <p style={{ color: "#666" }}>Content grows with your child — from first words to first grade</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
          {[
            { emoji:"🐣", age:"Age 3–4", desc:"Colors, shapes, animals, counting, emotions and free drawing." },
            { emoji:"🌱", age:"Age 5", desc:"ABCs, spelling, rhyming, phonics, sight words and stories." },
            { emoji:"⭐", age:"Age 6", desc:"Harder spelling, addition and subtraction, memory games." },
            { emoji:"🏆", age:"Age 7", desc:"Full curriculum including multiplication and advanced phonics." },
          ].map((a,i) => (
            <div key={i} style={{ borderRadius: 24, padding: "2rem", textAlign: "center", background: ["#fff5f8","#f0fbf6","#f5f0ff","#fffbf0"][i] }}>
              <div style={{ fontSize: "3rem", marginBottom: ".75rem" }}>{a.emoji}</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.3rem", marginBottom: ".3rem" }}>{a.age}</h3>
              <p style={{ fontSize: ".85rem", color: "#555", lineHeight: 1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", background: "linear-gradient(135deg,#ff8fab,#c8a8ff)", color: "white" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐱 🐶 🦒 🐯 🐼</div>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(2.2rem,6vw,4rem)", marginBottom: "1rem" }}>Ready to Start Learning?</h2>
        <p style={{ fontSize: "1.2rem", opacity: .9, marginBottom: "2rem" }}>Join kids already learning with Tiny Tots — totally free!</p>
        <button onClick={openSignup} style={{ background: "white", color: "#2d2d2d", border: "none", borderRadius: 999, padding: "1rem 2.5rem", fontSize: "1.15rem", fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
          🌈 Start Free Now →
        </button>
        <p style={{ fontSize: ".85rem", opacity: .75, marginTop: "1rem" }}>No credit card · No ads · Safe for kids ages 3–7</p>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#2d2d2d", color: "white", padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.6rem", marginBottom: ".5rem" }}>🌈 Tiny Tots</div>
        <p style={{ color: "#aaa", fontSize: ".85rem" }}>A fun interactive learning app for kids ages 3–7</p>
        <p style={{ color: "#666", fontSize: ".85rem", marginTop: "1rem" }}>Made with ❤️ · No ads · Safe for kids</p>
      </footer>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ mode, setMode, onClose }: { mode: "login"|"signup"|"forgot"; setMode: (m: "login"|"signup"|"forgot") => void; onClose: () => void }) {
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
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;
        setMessage("Account created! Setting up your child's profile...");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`,
        });
        if (error) throw error;
        setMessage("Check your email for a password reset link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 28, padding: "2.5rem", width: "100%", maxWidth: 420, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1.2rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem" }}>🌈</div>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.8rem", margin: ".3rem 0" }}>
            {mode === "login" ? "Welcome Back! 👋" : mode === "signup" ? "Join Tiny Tots! 🌟" : "Reset Password 🔑"}
          </h2>
          <p style={{ color: "#888", fontSize: ".9rem" }}>
            {mode === "login" ? "Sign in to continue your child's learning"
              : mode === "signup" ? "Create a free parent account"
              : "We'll email you a link to reset your password"}
          </p>
        </div>

        {mode === "signup" && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            style={inputStyle} />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
          onKeyDown={e => e.key === "Enter" && handleSubmit()} style={inputStyle} />
        {mode !== "forgot" && (
          <div style={{ position: "relative", marginBottom: "0.5rem" }}>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
              type={showPassword ? "text" : "password"} onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ ...inputStyle, marginBottom: 0, paddingRight: "3rem" }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        )}

        {mode === "login" && (
          <div style={{ textAlign: "right", marginBottom: "1rem", marginTop: "0.5rem" }}>
            <button onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}
              style={{ background: "none", border: "none", color: "#ff8fab", fontWeight: 800, cursor: "pointer", fontSize: ".85rem" }}>
              Forgot password?
            </button>
          </div>
        )}
        {mode !== "login" && <div style={{ marginBottom: "1.5rem" }} />}

        {error && <p style={{ color: "red", fontSize: ".85rem", textAlign: "center", marginBottom: ".75rem" }}>{error}</p>}
        {message && <p style={{ color: "green", fontSize: ".85rem", textAlign: "center", marginBottom: ".75rem" }}>{message}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{ ...pinkBtn, width: "100%", justifyContent: "center", fontSize: "1.1rem", padding: "1rem", marginBottom: "1rem" }}>
          {loading ? "..." : mode === "login" ? "Log In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
        </button>

        <p style={{ textAlign: "center", fontSize: ".9rem", color: "#666" }}>
          {mode === "forgot" ? (
            <button onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              style={{ background: "none", border: "none", color: "#ff8fab", fontWeight: 800, cursor: "pointer", fontSize: ".9rem" }}>
              ← Back to log in
            </button>
          ) : (
            <>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
                style={{ background: "none", border: "none", color: "#ff8fab", fontWeight: 800, cursor: "pointer", fontSize: ".9rem" }}>
                {mode === "login" ? "Sign up free" : "Log in"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const pinkBtn: React.CSSProperties = {
  background: "#ff8fab", color: "white", border: "none", borderRadius: 999,
  padding: ".65rem 1.5rem", fontWeight: 800, cursor: "pointer",
  fontFamily: "'Nunito',sans-serif", fontSize: "1rem",
  display: "inline-flex", alignItems: "center", gap: ".5rem",
  transition: "transform .2s, box-shadow .2s",
};
const outlineBtn: React.CSSProperties = {
  background: "transparent", color: "#2d2d2d", border: "2.5px solid #2d2d2d",
  borderRadius: 999, padding: ".65rem 1.5rem", fontWeight: 800, cursor: "pointer",
  fontFamily: "'Nunito',sans-serif", fontSize: "1rem",
};
const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: 16, border: "2px solid #eee",
  padding: ".8rem 1.2rem", marginBottom: "1rem", fontSize: "1rem",
  fontFamily: "'Nunito',sans-serif", outline: "none",
};
