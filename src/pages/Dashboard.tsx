import { useState, useEffect, useMemo } from "react";
import { useLearningStore } from "@/hooks/use-learning-store";
import { BiteCard } from "@/components/BiteCard";
import { TimedQuizCard } from "@/components/TimedQuizCard";
import { SearchBite } from "@/components/SearchBite";
import { MemoryHeatmap } from "@/components/MemoryHeatmap";
import { Leaderboard } from "@/components/Leaderboard";
import { SubscribeCard } from "@/components/SubscribeCard";
import { CertificateModal } from "@/components/CertificateModal";
import { StatsCards } from "@/components/StatsCards";
import { ReviewQueue } from "@/components/ReviewQueue";
import { WeeklyProgressChart } from "@/components/WeeklyProgressChart";
import { PeerChallenge } from "@/components/PeerChallenge";
import { CollectedBites } from "@/components/CollectedBites";
import { getBites } from "@/data/bites";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  store: ReturnType<typeof useLearningStore>;
}

export default function Dashboard({ store }: DashboardProps) {
  const [showCert, setShowCert] = useState(false);
  const [certShown, setCertShown] = useState(false);
  const [selectedBite, setSelectedBite] = useState<number | null>(null);
  const [showBiteModal, setShowBiteModal] = useState(true);

  const { preferences, updatePreferences, loading: profileLoading } = useProfile();

  // whenever preferences are fetched or changed, inform the learning store
  useEffect(() => {
    if (!profileLoading) {
      store.setPreferredCategories(preferences);
    }
  }, [profileLoading, preferences, store]);

  useEffect(() => {
    // Check if certificate should be shown
    // Only show if: not yet shown this session AND (streak >= 7 OR quizCount >= 10)
    // AND last certificate was shown more than 7 days ago
    if (!certShown && (store.streak >= 7 || store.quizCount >= 10)) {
      const today = new Date().toISOString().split("T")[0];
      const lastCertDate = store.lastCertificateDate;
      
      // Calculate days since last certificate
      const daysSinceLastCert = lastCertDate 
        ? Math.floor((new Date(today).getTime() - new Date(lastCertDate).getTime()) / (1000 * 60 * 60 * 24))
        : 8; // If never shown, treat as 8 days ago
      
      // Show certificate only if it's been 7+ days since last shown
      if (daysSinceLastCert >= 7) {
        setShowCert(true);
        setCertShown(true);
        // Update the last certificate date in the store
        store.updateCertificateDate(today);
      }
    }
  }, [store.streak, store.quizCount, certShown, store]);

  const activeBite = selectedBite
    ? getBites().find((b) => b.id === selectedBite) || store.currentBite
    : store.currentBite;

  const topicsMastered = useMemo(() => {
    return Object.values(store.confidenceRatings).filter((v) => v === "mastered").length;
  }, [store.confidenceRatings]);

  // Spaced repetition: schedule reviews based on confidence
  // confused → 1-2 days, getting-there → 3-4 days, mastered → 7 days
  const reviewItems = useMemo(() => {
    return Object.entries(store.confidenceRatings)
      .filter(([, v]) => v !== "mastered")
      .map(([category, confidence]) => {
        const bite = getBites().find((b) => b.category === category);
        const days = confidence === "confused" ? 1 : 3;
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() + days);
        return {
          biteId: bite?.id ?? 1,
          confidence,
          nextReviewDate: reviewDate.toISOString().split("T")[0],
        };
      });
  }, [store.confidenceRatings]);

  if (!store.bitesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary" />
          <p className="text-sm text-muted-foreground">Loading bites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 min-h-[calc(100vh-60px)]">
      {/* Background blur overlay when modal is open */}
      {showBiteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowBiteModal(false)} />
      )}

      {/* Bite Modal Alert Overlay */}
      {showBiteModal && activeBite && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-3xl border border-primary/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-primary/10 bg-background/95 backdrop-blur">
              <h1 className="font-display text-2xl font-bold gradient-text">Today's Knowledge Bit</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBiteModal(false)}
                className="hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 md:p-6">
              <BiteCard
                bite={activeBite}
                onAiDive={store.incrementGoal}
                onComplete={() => {
                  store.earnBites(2);
                  if (activeBite) store.collectBite(activeBite.id);
                }}
              />
              <div className="mt-6 pt-6 border-t border-primary/10">
                <h2 className="font-display text-lg font-semibold mb-4">Test Your Knowledge</h2>
                <TimedQuizCard
                  key={activeBite.id}
                  bite={activeBite}
                  onComplete={(correctCount) => {
                    store.completeQuiz(1);
                    store.earnBites(correctCount);
                  }}
                  onConfidence={(level) => store.setConfidence(activeBite.category, level)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        <StatsCards
          streak={store.streak}
          quizCount={store.quizCount}
          biteTokens={store.biteTokens}
          collectedCount={store.collectedCount}
        />

        <SearchBite
          allowedCategories={preferences}
          onSelectBite={(id) => {
            setSelectedBite(id);
            store.incrementGoal();
            store.collectBite(id);
          }}
        />

        {/* Hidden section - content only appears when modal is closed */}
        {!showBiteModal && activeBite && (
          <>
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold">
                {selectedBite ? "📚 Selected Bite" : "🎯 Today's Bite"}
              </h2>
              {selectedBite && (
                <button
                  onClick={() => setSelectedBite(null)}
                  className="text-xs text-primary hover:underline"
                >
                  ← Back to daily bite
                </button>
              )}
            </div>
            <BiteCard
              bite={activeBite}
              onAiDive={store.incrementGoal}
              onComplete={() => {
                store.earnBites(2);
                if (activeBite) store.collectBite(activeBite.id);
              }}
            />
            <TimedQuizCard
              key={activeBite.id}
              bite={activeBite}
              onComplete={(correctCount) => {
                store.completeQuiz(1);
                store.earnBites(correctCount);
              }}
              onConfidence={(level) => store.setConfidence(activeBite.category, level)}
            />
          </>
        )}

        <WeeklyProgressChart activityLog={store.activityLog} />

        <SubscribeCard />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-72 xl:w-80 space-y-6 shrink-0">
        <CollectedBites 
          bites={store.collectedBites} 
          onSelectBite={(id) => {
            setSelectedBite(id);
            store.incrementGoal();
          }}
        />
        <PeerChallenge quizCount={store.quizCount} />
        <Leaderboard quizCount={store.quizCount} />
        <ReviewQueue items={reviewItems} onReview={(id) => setSelectedBite(id)} />
        <MemoryHeatmap confidenceRatings={store.confidenceRatings} />
      </div>

      <CertificateModal
        open={showCert}
        onClose={() => setShowCert(false)}
        streak={store.streak}
        quizCount={store.quizCount}
      />
    </div>
  );
}
