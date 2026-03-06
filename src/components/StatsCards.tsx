import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  streak: number;
  quizCount: number;
  biteTokens?: number;
  collectedCount?: number;
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [value]);

  return <span>{display}</span>;
}

  const stats = [
  { key: "streak", label: "Day Streak", icon: Flame, color: "text-orange-500" },
  { key: "collectedCount", label: "Collected Bites", icon: Zap, color: "text-yellow-500" },
  { key: "biteTokens", label: "Bite Tokens", icon: Zap, color: "text-yellow-500" },
  { key: "quizCount", label: "Quizzes Done", icon: Trophy, color: "text-primary" },
];

export function StatsCards(props: StatsCardsProps) {
  const values: Record<string, number> = {
    streak: props.streak,
    collectedCount: props.collectedCount || 0,
    biteTokens: props.biteTokens || 0,
    quizCount: props.quizCount,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="glass rounded-2xl hover-glow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">
                  <AnimatedCounter value={values[s.key]} />
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
