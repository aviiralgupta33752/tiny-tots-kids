import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface ChildProfile {
  name: string;
  age: number;
}

const PROFILE_KEY = "tt_child_profile_v1";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user);
      else setChildProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(user: User) {
    // First check localStorage for quick load
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        setChildProfile(JSON.parse(saved));
        return;
      }
    } catch {}

    // Then check Supabase user metadata
    try {
      const meta = user.user_metadata;
      if (meta?.child_name && meta?.child_age) {
        const profile = { name: meta.child_name, age: meta.child_age };
        setChildProfile(profile);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      }
    } catch {}
  }

  async function saveProfile(profile: ChildProfile) {
    // Save to localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setChildProfile(profile);

    // Save to Supabase user metadata so it persists across devices/sign outs
    try {
      await supabase.auth.updateUser({
        data: {
          child_name: profile.name,
          child_age: profile.age,
        }
      });
    } catch (e) {
      console.error("Failed to save profile to Supabase:", e);
    }
  }

  async function signOut() {
    // Keep profile in localStorage so it loads next time
    // Just clear from memory
    setChildProfile(null);
    await supabase.auth.signOut();
  }

  return { user, loading, childProfile, saveProfile, signOut };
}
