import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { loadUsers, getLeaderboard, getStreakLeaderboard, type AppUser } from "@/data/users";

interface LeaderboardProps {
  quizCount: number;
}

export function Leaderboard({ quizCount }: LeaderboardProps) {
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [sortBy, setSortBy] = useState<"points" | "streak">("points");

  useEffect(() => {
    loadUsers().then(() => setUsersLoaded(true));
  }, []);

  const entries = useMemo(() => {
    if (!usersLoaded) return [];
    const top = sortBy === "points" ? getLeaderboard(9) : getStreakLeaderboard(9);
    const mapped = top.map((u) => ({
      name: u.user_name,
      score: sortBy === "points" ? u.total_points : u.streak,
      isUser: false,
    }));
    // Insert logged-in user
    mapped.push({ name: "You", score: sortBy === "points" ? quizCount * 10 : 0, isUser: true });
    return mapped.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [usersLoaded, sortBy, quizCount]);

  return (
    <Card className="glass rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base">🏆 Top Learners</CardTitle>
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "points" | "streak")}>
            <TabsList className="h-7">
              <TabsTrigger value="points" className="text-xs px-2 py-1">Points</TabsTrigger>
              <TabsTrigger value="streak" className="text-xs px-2 py-1">Streak</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {entries.map((entry, i) => (
          <div
            key={entry.name}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-300",
              entry.isUser
                ? "gradient-primary text-primary-foreground glow-primary font-semibold"
                : "bg-secondary/50 hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-bold w-5 text-xs">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <span className="truncate max-w-[120px]">{entry.name}</span>
            </div>
            <span className="font-display font-bold">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
