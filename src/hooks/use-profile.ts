import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPreferences([]);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          setPreferences(data.preferences || []);
        }
      } catch (e) {
        // preferences column may not exist yet; silently ignore
        console.debug("Could not fetch preferences:", e);
      }
      setLoading(false);
    };

    fetch();
  }, [user]);

  const updatePreferences = useCallback(
    async (prefs: string[]) => {
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .update({ preferences: prefs })
        .eq("id", user.id);
      if (!error) {
        setPreferences(prefs);
      }
      return { error: error?.message ?? null };
    },
    [user]
  );

  return { preferences, updatePreferences, loading };
}
