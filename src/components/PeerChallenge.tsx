import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, Copy, Trophy, Users } from "lucide-react";
import { getRandomQuizBites, type Bite } from "@/data/bites";
import { getUsers, type AppUser } from "@/data/users";
import { LogoIcon } from "@/components/LogoIcon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PeerChallengeProps {
  quizCount: number;
  onStartChallenge?: () => void;
}

interface ChallengeData {
  id: string;
  opponentName: string;
  questions: Bite[];
  myScore: number | null;
  opponentScore: number | null;
  status: "pending" | "in-progress" | "completed";
}

function generateChallengeId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function PeerChallenge({ quizCount }: PeerChallengeProps) {
  const [phase, setPhase] = useState<"idle" | "select" | "playing" | "results">("idle");
  const [searchQuery, setSearchQuery] = useState("");

  // scroll into view when challenge activates or results appear
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase === "playing" || phase === "results") {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [phase]);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isLive] = useState(true); // Always live mode

  const users = useMemo(() => getUsers(), []);
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users.slice(0, 8);
    return users
      .filter((u) => u.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 8);
  }, [users, searchQuery]);

  const handleSelectOpponent = useCallback((opponent: AppUser) => {
    const quizBites = getRandomQuizBites(5);
    if (quizBites.length === 0) {
      toast.error("No quiz questions available");
      return;
    }
    // Simulate opponent score based on their total_points
    const opponentScore = Math.min(
      quizBites.length,
      Math.floor((opponent.total_points / 500) * quizBites.length * (0.4 + Math.random() * 0.5))
    );
    setChallenge({
      id: generateChallengeId(),
      opponentName: opponent.user_name,
      questions: quizBites,
      myScore: null,
      opponentScore,
      status: "in-progress",
    });
    setCurrentIdx(0);
    setScore(0);
    setSelected("");
    setAnswered(false);
    setPhase("playing");
  }, []);

  const handleAnswer = useCallback(() => {
    if (!challenge || answered) return;
    const q = challenge.questions[currentIdx];
    const isCorrect = q.options![Number(selected)] === q.answer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswered(true);

    setTimeout(() => {
      const next = currentIdx + 1;
      if (next >= challenge.questions.length) {
        const finalScore = isCorrect ? score + 1 : score;
        setChallenge((c) => c ? { ...c, myScore: finalScore, status: "completed" } : c);
        setPhase("results");
      } else {
        setCurrentIdx(next);
        setSelected("");
        setAnswered(false);
      }
    }, 1200);
  }, [challenge, currentIdx, selected, answered, score]);

  const handleCopyLink = () => {
    if (!challenge) return;
    const text = `🧠 BitSize Challenge #${challenge.id}\nI scored ${challenge.myScore}/${challenge.questions.length}!\nCan you beat me?`;
    navigator.clipboard.writeText(text);
    toast.success("Challenge copied! Share it with friends 📋");
  };

  // IDLE
  if (phase === "idle") {
    return (
      <div ref={containerRef}>
        <Card className="glass rounded-2xl border-success/30 hover-glow">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-accent" />
              <span>Peer Challenge</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success text-xs font-semibold rounded-full">
                <span className="h-2 w-2 bg-success rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Challenge another learner to a real-time 5-question quiz duel!
          </p>
          <Button
            onClick={() => setPhase("select")}
            className="w-full gradient-primary text-primary-foreground gap-2"
          >
            <Users className="h-4 w-4" />
            Find Opponent
          </Button>
        </CardContent>
      </Card>
      </div>
    );
  }

  // SELECT opponent
  if (phase === "select") {
    return (
      <div ref={containerRef}>
        <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Choose Opponent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {filteredUsers.map((u, i) => (
              <button
                key={i}
                onClick={() => handleSelectOpponent(u)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
              >
                <span className="font-medium truncate">{u.user_name}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {u.total_points} pts · 🔥{u.streak}
                </span>
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setPhase("idle")} className="w-full text-xs">
            Cancel
          </Button>
        </CardContent>
      </Card>
      </div>
    );
  }

  // PLAYING
  if (phase === "playing" && challenge) {
    const q = challenge.questions[currentIdx];
    const correctIdx = q.options!.findIndex((o) => o === q.answer);

    return (
      <div ref={containerRef}>
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              ⚔️ vs {challenge.opponentName} — Q{currentIdx + 1}/{challenge.questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium">{q.content}</p>
            <div className="space-y-2">
              {q.options!.map((opt, i) => (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => !answered && setSelected(String(i))}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border text-sm transition-all",
                    answered && i === correctIdx && "border-success bg-success/10",
                    answered && selected === String(i) && i !== correctIdx && "border-destructive bg-destructive/10",
                    !answered && selected === String(i) && "border-primary bg-primary/5",
                    !answered && selected !== String(i) && "border-border hover:border-primary/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            {!answered && (
              <Button
                onClick={handleAnswer}
                disabled={!selected}
                className="w-full gradient-primary text-primary-foreground"
              >
                Submit
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // RESULTS
  if (phase === "results" && challenge) {
    const myScore = challenge.myScore ?? 0;
    const oppScore = challenge.opponentScore ?? 0;
    const won = myScore > oppScore;
    const tied = myScore === oppScore;

    return (
      <div ref={containerRef}>
        <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base text-center flex items-center justify-center gap-2">
            <LogoIcon size="md" className={cn("drop-shadow-lg", won ? "opacity-100" : "opacity-60")} />
            Challenge Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-6"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{myScore}</p>
                <p className="text-xs text-muted-foreground">You</p>
              </div>
              <span className="text-lg text-muted-foreground font-bold">vs</span>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{oppScore}</p>
                <p className="text-xs text-muted-foreground">{challenge.opponentName}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "text-center text-sm font-semibold p-3 rounded-xl",
              won && "bg-accent/10 text-accent",
              !won && !tied && "bg-destructive/10 text-destructive",
              tied && "bg-muted text-muted-foreground"
            )}
          >
            {won ? "🏆 You Win!" : tied ? "🤝 It's a Tie!" : "😤 Better luck next time!"}
          </motion.p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-1 text-xs">
              <Copy className="h-3.5 w-3.5 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setPhase("select"); setSearchQuery(""); }}
              className="flex-1 text-xs"
            >
              <Swords className="h-3.5 w-3.5 mr-1" />
              Rematch
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setPhase("idle")} className="w-full text-xs">
            Done
          </Button>
        </CardContent>
      </Card>
      </div>
    );
  }

  return null;
}
