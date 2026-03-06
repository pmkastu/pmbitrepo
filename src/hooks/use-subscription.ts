import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useSubscription() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlan("free");
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_type")
        .eq("id", user.id)
        .single();
      setPlan((data?.subscription_type as "free" | "pro") ?? "free");
      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  const upgrade = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ subscription_type: "pro" })
      .eq("id", user.id);
    setPlan("pro");
  };

  const downgrade = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ subscription_type: "free" })
      .eq("id", user.id);
    setPlan("free");
  };

  return { plan, isPro: plan === "pro", loading, upgrade, downgrade };
}
