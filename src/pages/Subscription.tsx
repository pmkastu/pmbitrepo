import { Check, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "1 bite per day",
      "Basic quizzes",
      "Streak tracking",
      "Leaderboard access",
    ],
    missing: [
      "AI Deep Dive insights",
      "Text-to-Speech",
      "Unlimited daily bites",
      "Advanced spaced repetition",
      "Peer challenge analytics",
    ],
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/month",
    features: [
      "Unlimited bites per day",
      "AI Deep Dive insights",
      "Text-to-Speech mode",
      "Advanced spaced repetition",
      "Peer challenge analytics",
      "Priority support",
      "All Free features",
    ],
    missing: [],
  },
];

export default function Subscription() {
  const { plan, isPro, upgrade, downgrade } = useSubscription();

  const handleUpgrade = async () => {
    await upgrade();
    toast.success("🎉 Welcome to Pro! All features unlocked.");
  };

  const handleDowngrade = async () => {
    await downgrade();
    toast.info("Switched to Free plan.");
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-bold gradient-text">Choose Your Plan</h1>
        <p className="text-muted-foreground">Unlock your full learning potential</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((p, i) => {
          const isCurrent = (i === 0 && !isPro) || (i === 1 && isPro);
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card
                className={cn(
                  "glass rounded-2xl h-full transition-all duration-300",
                  i === 1 && "glow-primary border-primary/30",
                  isCurrent && "ring-2 ring-primary/50"
                )}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {i === 1 && <Crown className="h-5 w-5 text-primary" />}
                    <CardTitle className="font-display text-xl">{p.name}</CardTitle>
                    {isCurrent && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="font-display text-4xl font-bold">{p.price}</span>
                    <span className="text-muted-foreground text-sm">{p.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-neon shrink-0" />
                        {f}
                      </li>
                    ))}
                    {p.missing.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground line-through">
                        <span className="h-4 w-4 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {i === 1 && !isPro && (
                    <Button onClick={handleUpgrade} className="w-full gradient-primary text-primary-foreground hover-glow">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  )}
                  {i === 1 && isPro && (
                    <Button variant="outline" onClick={handleDowngrade} className="w-full">
                      Downgrade to Free
                    </Button>
                  )}
                  {i === 0 && !isPro && (
                    <Button variant="outline" disabled className="w-full">
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
