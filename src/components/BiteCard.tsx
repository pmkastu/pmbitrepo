import { useState } from "react";
import { Sparkles, Loader2, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Bite } from "@/data/bites";
import { cn } from "@/lib/utils";
import { TTSButton } from "@/components/TTSButton";
import { useSubscription } from "@/hooks/use-subscription";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface BiteCardProps {
  bite: Bite;
  onAiDive: () => void;
  onComplete?: () => void;
}

const categoryStyles: Record<string, { bg: string; border: string; badge: string }> = {
  Technical: {
    bg: "bg-blue-900/20",
    border: "border-blue-500/30",
    badge: "bg-blue-900/40 text-blue-200 border-blue-500/30",
  },
  "Soft Skills": {
    bg: "bg-purple-900/20",
    border: "border-purple-500/30",
    badge: "bg-purple-900/40 text-purple-200 border-purple-500/30",
  },
  "General Knowledge": {
    bg: "bg-amber-900/20",
    border: "border-amber-500/30",
    badge: "bg-amber-900/40 text-amber-200 border-amber-500/30",
  },
};

export function BiteCard({ bite, onAiDive, onComplete }: BiteCardProps) {
  const [showAi, setShowAi] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const styles = categoryStyles[bite.category];

  const handleAiDive = async () => {
    if (!isPro) return;
    setShowAi(true);
    setAiLoading(true);
    onAiDive();

    try {
      const { generateDeepDiveInsight } = await import('@/integrations/grok/client');
      const insight = await generateDeepDiveInsight(bite.content);
      setAiText(insight);
    } catch (e: any) {
      console.error("Error loading deep dive:", e);
      toast.error("Failed to load deep dive explanation");
      setAiText("Unable to load explanation. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main Knowledge Bit Alert */}
      <div className={cn(
        "rounded-2xl border-2 p-4 md:p-6 backdrop-blur-sm",
        styles.bg,
        styles.border
      )}>
        <div className="flex flex-col gap-4">
          {/* Header with badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-xs font-semibold px-3 py-1", styles.badge)}>
                {bite.category}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {bite.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <TTSButton text={bite.content} disabled={!isPro} />
            </div>
          </div>

          {/* Main Content - Knowledge Bit */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-base md:text-lg font-semibold leading-relaxed text-foreground">
                {bite.content}
              </p>
            </div>

            {bite.explanation && (
              <p className="text-sm text-muted-foreground leading-relaxed ml-8">
                {bite.explanation}
              </p>
            )}

            {/* Tags */}
            {bite.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 ml-8">
                {bite.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs rounded-full bg-secondary/60 text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mark as Done Button */}
          {onComplete && (
            <div className="ml-8">
              <Button
                size="sm"
                className={cn(
                  "transition-all",
                  completed
                    ? "bg-success/20 text-success border border-success/30 hover:bg-success/30"
                    : "gradient-primary text-white hover-glow"
                )}
                disabled={completed}
                onClick={() => {
                  if (!completed) {
                    onComplete();
                    setCompleted(true);
                  }
                }}
              >
                {completed ? "✔ Done" : "Mark as Done"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="rounded-2xl border border-primary/20 bg-card/50 p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Deep Dive Analysis</h3>
        </div>

        {!showAi ? (
          isPro ? (
            <Button
              onClick={handleAiDive}
              className="w-full gradient-primary text-white hover-glow text-base"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              ✨ Deep Dive with AI
            </Button>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <div className="blur-sm p-4 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-sm text-muted-foreground">AI insights unlock deeper understanding...</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Lock className="h-6 w-6 text-muted-foreground" />
                <Button size="sm" variant="outline" onClick={() => navigate("/subscription")}>
                  Unlock with Pro
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="p-4 rounded-xl border-2 border-primary/40 bg-primary/10 space-y-3">
            {aiLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating insight...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {aiText}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
