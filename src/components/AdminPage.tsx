import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "avigupta2772@gmail.com";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  child_name?: string;
  child_age?: number;
  stars?: number;
  streak?: number;
  last_active?: string;
}

export function AdminPage({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    byAge: {} as Record<number, number>,
    avgStars: 0,
    activeToday: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email ?? "";
      setCurrentEmail(email);
      if (email === ADMIN_EMAIL) {
        setAuthorized(true);
        loadUsers();
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      // Get all auth users via admin API
      const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;

      // Build user data — merge with any profile data stored in localStorage
      // (In a real app you'd have a profiles table in Supabase)
      const userData: UserData[] = authUsers.map(u => ({
        id: u.id,
        email: u.email ?? "",
        created_at: u.created_at,
        last_active: u.last_sign_in_at,
      }));

      setUsers(userData);

      // Compute stats
      const today = new Date().toDateString();
      const activeToday = userData.filter(u =>
        u.last_active && new Date(u.last_active).toDateString() === today
      ).length;

      setStats({
        total: userData.length,
        byAge: {},
        avgStars: 0,
        activeToday,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!authorized && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #fff5f8, #f0fbf6)" }}>
        <div className="card-soft rounded-3xl p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Only the admin can view this page.</p>
          <p className="text-sm text-muted-foreground mb-6">Logged in as: {currentEmail}</p>
          <button onClick={onBack} className="rounded-2xl bg-pink px-6 py-3 font-bold text-white">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-3">📊</div>
          <p className="font-bold">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#f8f9fa" }}>
      {/* Header */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🌈</div>
            <div>
              <h1 className="font-display text-3xl font-bold">Tiny Tots Admin</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Avi! 👋</p>
            </div>
          </div>
          <button onClick={onBack} className="rounded-2xl bg-muted px-4 py-2 font-bold text-sm hover:scale-105 transition">
            ← Back to App
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
          <StatCard emoji="👥" label="Total Users" value={stats.total} color="#fff5f8" />
          <StatCard emoji="🟢" label="Active Today" value={stats.activeToday} color="#f0fbf6" />
          <StatCard emoji="⭐" label="Avg Stars" value={stats.avgStars} color="#fffbf0" />
          <StatCard emoji="📱" label="Platform" value="Web" color="#f5f0ff" isText />
        </div>

        {/* Age breakdown */}
        <div className="card-soft rounded-3xl p-6 mb-6 bg-white">
          <h2 className="font-display text-xl font-bold mb-4">Age Breakdown</h2>
          {Object.keys(stats.byAge).length === 0 ? (
            <p className="text-muted-foreground text-sm">No age data yet — users need to complete onboarding.</p>
          ) : (
            <div className="flex gap-4">
              {[3,4,5,6,7].map(age => (
                <div key={age} className="flex-1 text-center">
                  <div className="font-display text-3xl font-bold">{stats.byAge[age] ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Age {age}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User table */}
        <div className="card-soft rounded-3xl p-6 bg-white overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">All Users ({users.length})</h2>
            <button onClick={loadUsers} className="rounded-xl bg-muted px-3 py-1 text-sm font-bold hover:scale-105 transition">
              ↻ Refresh
            </button>
          </div>

          {users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users yet!</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-bold text-muted-foreground">Email</th>
                  <th className="text-left py-2 pr-4 font-bold text-muted-foreground">Joined</th>
                  <th className="text-left py-2 pr-4 font-bold text-muted-foreground">Last Active</th>
                  <th className="text-left py-2 font-bold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isToday = u.last_active && new Date(u.last_active).toDateString() === new Date().toDateString();
                  return (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-3 pr-4 font-medium">{u.email}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {u.last_active ? new Date(u.last_active).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${isToday ? "bg-mint" : "bg-muted"}`}>
                          {isToday ? "🟢 Active" : "⚪ Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-6 card-soft rounded-3xl p-6 bg-white">
          <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction emoji="📧" label="Email Users" onClick={() => alert("Coming soon!")} />
            <QuickAction emoji="📢" label="Announcements" onClick={() => alert("Coming soon!")} />
            <QuickAction emoji="📊" label="Export Data" onClick={() => {
              const csv = ["Email,Joined,Last Active", ...users.map(u => `${u.email},${u.created_at},${u.last_active ?? ""}`)].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "tiny-tots-users.csv"; a.click();
            }} />
            <QuickAction emoji="🔄" label="Refresh" onClick={loadUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, color, isText }: { emoji: string; label: string; value: number | string; color: string; isText?: boolean }) {
  return (
    <div className="card-soft rounded-3xl p-5 text-center" style={{ background: color }}>
      <div className="text-3xl mb-1">{emoji}</div>
      <div className={`font-display font-bold ${isText ? "text-xl" : "text-3xl"}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function QuickAction({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl bg-muted p-4 text-center hover:scale-105 transition">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-xs font-bold">{label}</div>
    </button>
  );
}
