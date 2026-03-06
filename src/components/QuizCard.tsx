import { useState } from "react";
import { Check, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type Bite } from "@/data/bites";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuizCardProps {
  bite: Bite;
  onComplete: () => void;
  onConfidence: (level: "confused" | "getting-there" | "mastered") => void;
}

export function QuizCard({ bite, onComplete, onConfidence }: QuizCardProps) {
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [rated, setRated] = useState(false);

  // Only render for quiz-type bites with options
  if (bite.type !== "quiz" || !bite.options || !bite.answer) return null;

  // Find the correct answer index by matching the answer text
  const correctIndex = bite.options.findIndex((opt) => opt === bite.answer);
  const isCorrect = submitted && selected === String(correctIndex);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    onComplete();
    setTimeout(() => setShowConfidence(true), 800);
  };

  const handleConfidence = (level: "confused" | "getting-there" | "mastered") => {
    onConfidence(level);
    setRated(true);
  };

  const handleCopyChallenge = () => {
    const grid = bite.options!
      .map((_, i) => (i === correctIndex ? "🟩" : i === Number(selected) ? "🟥" : "⬜"))
      .join("");
    const text = `Knowledge Bite #${bite.id}\n${grid}\nScore: ${isCorrect ? "1" : "0"}/1\nCan you beat me? 🧠`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
  };

  return (
    <Card className="glass rounded-2xl animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-lg">📝 Quick Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-sm">{bite.content}</p>

        <RadioGroup value={selected} onValueChange={setSelected} disabled={submitted}>
          {bite.options.map((opt, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer",
                submitted && i === correctIndex && "border-success bg-success/10",
                submitted && i === Number(selected) && i !== correctIndex && "border-destructive bg-destructive/10",
                !submitted && selected === String(i) && "border-primary bg-primary/5 glow-primary",
                !submitted && selected !== String(i) && "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value={String(i)} id={`opt-${bite.id}-${i}`} />
              <Label htmlFor={`opt-${bite.id}-${i}`} className="flex-1 cursor-pointer text-sm">
                {opt}
              </Label>
              {submitted && i === correctIndex && <Check className="h-4 w-4 text-success" />}
              {submitted && i === Number(selected) && i !== correctIndex && (
                <X className="h-4 w-4 text-destructive" />
              )}
            </div>
          ))}
        </RadioGroup>

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={!selected}
            className="w-full gradient-primary text-primary-foreground"
          >
            Submit Answer
          </Button>
        )}

        {submitted && (
          <div className="space-y-3 animate-fade-in">
            <div
              className={cn(
                "p-3 rounded-xl text-sm",
                isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}
            >
              {isCorrect ? "🎉 Correct!" : "❌ Not quite."} {bite.explanation}
            </div>

            <Button variant="outline" size="sm" onClick={handleCopyChallenge} className="w-full">
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy Challenge
            </Button>
          </div>
        )}

        {showConfidence && !rated && (
          <div className="animate-fade-in space-y-2 p-4 rounded-xl bg-secondary/50">
            <p className="text-sm font-medium text-center">How confident do you feel?</p>
            <div className="flex gap-2 justify-center">
              {([
                { level: "confused" as const, emoji: "😕", label: "Still Confused" },
                { level: "getting-there" as const, emoji: "🙂", label: "Getting There" },
                { level: "mastered" as const, emoji: "😎", label: "Mastered" },
              ]).map(({ level, emoji, label }) => (
                <Button
                  key={level}
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfidence(level)}
                  className="hover-glow text-xs"
                >
                  {emoji} {label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {rated && (
          <p className="text-center text-sm text-muted-foreground animate-fade-in">
            ✅ Rating saved!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
