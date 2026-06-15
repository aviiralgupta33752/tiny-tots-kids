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
      if (session?.user) loadProfile();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile();
      else setChildProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function loadProfile() {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) setChildProfile(JSON.parse(saved));
    } catch {}
  }

  function saveProfile(profile: ChildProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setChildProfile(profile);
  }

  function clearProfile() {
    localStorage.removeItem(PROFILE_KEY);
    setChildProfile(null);
  }

  async function signOut() {
    clearProfile();
    await supabase.auth.signOut();
  }

  return { user, loading, childProfile, saveProfile, signOut };
}
