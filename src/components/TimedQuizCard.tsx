import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Check, X, Copy, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type Bite, getQuizBites } from "@/data/bites";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TimedQuizCardProps {
  bite: Bite;
  onComplete: (correctCount: number) => void;
  onConfidence: (level: "confused" | "getting-there" | "mastered") => void;
}

type QuizPhase = "idle" | "active" | "feedback" | "finished";

interface QuestionResult {
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

// Circular timer SVG component
function CircularTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / total) * circumference;
  const color =
    timeLeft > 15
      ? "hsl(var(--primary))"
      : timeLeft > 5
        ? "hsl(42, 80%, 55%)"
        : "hsl(var(--destructive))";

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={cn(
          "absolute text-sm font-bold",
          timeLeft > 15
            ? "text-primary"
            : timeLeft > 5
              ? "text-gold"
              : "text-destructive"
        )}
      >
        {timeLeft}
      </span>
    </div>
  );
}

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TimedQuizCard({ bite, onComplete, onConfidence }: TimedQuizCardProps) {
  const [phase, setPhase] = useState<QuizPhase>("idle");
  const [questions, setQuestions] = useState<Bite[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [rated, setRated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const TOTAL_QUESTIONS = 5;
  const TIME_PER_QUESTION = 30;

  // Select 5 quiz questions from same category, fill from others if needed
  const selectQuestions = useCallback(() => {
    const allQuiz = getQuizBites().filter((b) => b.id !== bite.id);
    const sameCategory = shuffle(allQuiz.filter((b) => b.category === bite.category));
    const otherCategory = shuffle(allQuiz.filter((b) => b.category !== bite.category));
    const picked = [...sameCategory.slice(0, TOTAL_QUESTIONS)];
    if (picked.length < TOTAL_QUESTIONS) {
      picked.push(...otherCategory.slice(0, TOTAL_QUESTIONS - picked.length));
    }
    return picked.slice(0, TOTAL_QUESTIONS);
  }, [bite.id, bite.category]);

  // Start quiz
  const handleStart = useCallback(() => {
    const q = selectQuestions();
    if (q.length === 0) return;
    setQuestions(q);
    setCurrentIdx(0);
    setResults([]);
    setSelected("");
    setTimeLeft(TIME_PER_QUESTION);
    setRated(false);
    setPhase("active");
  }, [selectQuestions]);

  // Timer effect
  useEffect(() => {
    if (phase !== "active") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — auto-submit as wrong
          clearInterval(intervalRef.current!);
          handleSubmitAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIdx]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIdx] || null;

  const handleSubmitAnswer = useCallback(
    (answer: string | null) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const q = questions[currentIdx];
      if (!q) return;

      const correctAnswer = q.answer!;
      const isCorrect = answer !== null && q.options![Number(answer)] === correctAnswer;
      const userAnswerText = answer !== null ? q.options![Number(answer)] : null;

      const result: QuestionResult = {
        question: q.content,
        userAnswer: userAnswerText,
        correctAnswer,
        isCorrect,
      };

      setResults((prev) => [...prev, result]);
      setPhase("feedback");

      // Auto-advance after 1.5s
      feedbackTimeoutRef.current = setTimeout(() => {
        const nextIdx = currentIdx + 1;
        if (nextIdx >= questions.length) {
          // Quiz finished
          const allResults = [...results, result];
          const correctCount = allResults.filter((r) => r.isCorrect).length;
          onComplete(correctCount);
          setPhase("finished");
        } else {
          setCurrentIdx(nextIdx);
          setSelected("");
          setTimeLeft(TIME_PER_QUESTION);
          setPhase("active");
        }
      }, 1500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIdx, questions, results, onComplete]
  );

  const correctCount = useMemo(() => results.filter((r) => r.isCorrect).length, [results]);

  const handleCopyChallenge = () => {
    const grid = results.map((r) => (r.isCorrect ? "🟩" : r.userAnswer === null ? "⬛" : "🟥")).join("");
    const text = `Knowledge Bite Quiz\n${grid}\nScore: ${correctCount}/${results.length}\nCan you beat me? 🧠`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
  };

  const handleConfidence = (level: "confused" | "getting-there" | "mastered") => {
    onConfidence(level);
    setRated(true);
  };

  // Check if we have enough quiz bites
  const availableCount = getQuizBites().filter((b) => b.id !== bite.id).length;
  if (availableCount === 0) return null;

  // IDLE — show start button
  if (phase === "idle") {
    return (
      <Card className="glass rounded-2xl animate-fade-in">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            <span>5 Questions · 30s each</span>
          </div>
          <Button onClick={handleStart} className="gradient-primary text-primary-foreground gap-2 px-6">
            <Play className="h-4 w-4" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ACTIVE or FEEDBACK — show question
  if ((phase === "active" || phase === "feedback") && currentQuestion) {
    const correctIndex = currentQuestion.options!.findIndex((o) => o === currentQuestion.answer);
    const lastResult = phase === "feedback" ? results[results.length - 1] : null;

    return (
      <Card className="glass rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-display text-lg">
            📝 Question {currentIdx + 1}/{questions.length}
          </CardTitle>
          <CircularTimer timeLeft={timeLeft} total={TIME_PER_QUESTION} />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-sm">{currentQuestion.content}</p>

          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            disabled={phase === "feedback"}
          >
            {currentQuestion.options!.map((opt, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer",
                  phase === "feedback" && i === correctIndex && "border-success bg-success/10",
                  phase === "feedback" && selected === String(i) && i !== correctIndex && "border-destructive bg-destructive/10",
                  phase !== "feedback" && selected === String(i) && "border-primary bg-primary/5",
                  phase !== "feedback" && selected !== String(i) && "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={String(i)} id={`tq-${currentQuestion.id}-${i}`} />
                <Label htmlFor={`tq-${currentQuestion.id}-${i}`} className="flex-1 cursor-pointer text-sm">
                  {opt}
                </Label>
                {phase === "feedback" && i === correctIndex && <Check className="h-4 w-4 text-success" />}
                {phase === "feedback" && selected === String(i) && i !== correctIndex && <X className="h-4 w-4 text-destructive" />}
              </div>
            ))}
          </RadioGroup>

          {phase === "active" && (
            <Button
              onClick={() => handleSubmitAnswer(selected || null)}
              disabled={!selected}
              className="w-full gradient-primary text-primary-foreground"
            >
              Submit Answer
            </Button>
          )}

          {phase === "feedback" && lastResult && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-3 rounded-xl text-sm",
                  lastResult.isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}
              >
                {lastResult.isCorrect ? "🎉 Correct!" : lastResult.userAnswer === null ? "⏰ Time's up!" : "❌ Not quite."}
                {" "}{currentQuestion.explanation}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    );
  }

  // FINISHED — results screen
  if (phase === "finished") {
    return (
      <Card className="glass rounded-2xl animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display text-lg text-center">🏆 Quiz Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-primary">{correctCount}/{results.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
          </motion.div>

          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className={cn(
                "flex items-start gap-3 p-3 rounded-xl border text-sm",
                r.isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
              )}>
                {r.isCorrect ? <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> : <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.question}</p>
                  {!r.isCorrect && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Your answer: {r.userAnswer ?? "No answer"} · Correct: {r.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleCopyChallenge} className="w-full">
            <Copy className="h-3.5 w-3.5 mr-2" />
            Copy Challenge
          </Button>

          {!rated ? (
            <div className="space-y-2 p-4 rounded-xl bg-secondary/50">
              <p className="text-sm font-medium text-center">How confident do you feel?</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {([
                  { level: "confused" as const, emoji: "😕", label: "Still Confused" },
                  { level: "getting-there" as const, emoji: "🙂", label: "Getting There" },
                  { level: "mastered" as const, emoji: "😎", label: "Mastered" },
                ]).map(({ level, emoji, label }) => (
                  <Button key={level} variant="outline" size="sm" onClick={() => handleConfidence(level)} className="text-xs">
                    {emoji} {label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground animate-fade-in">✅ Rating saved!</p>
          )}

          <Button variant="ghost" size="sm" onClick={handleStart} className="w-full text-xs">
            🔄 Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
