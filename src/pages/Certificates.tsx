import { Card, CardContent } from "@/components/ui/card";
import { useLearningStore } from "@/hooks/use-learning-store";

interface CertificatesPageProps {
  store: ReturnType<typeof useLearningStore>;
}

export default function CertificatesPage({ store }: CertificatesPageProps) {
  const hasStreakCert = store.streak >= 7;
  const hasQuizCert = store.quizCount >= 10;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold gradient-text">🏅 Certificates</h1>
        <p className="text-sm text-muted-foreground mt-1">Your learning achievements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`glass rounded-2xl ${hasStreakCert ? "glow-primary" : "opacity-50"}`}>
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-5xl">{hasStreakCert ? "🏅" : "🔒"}</div>
            <h3 className="font-display font-bold text-lg">7-Day Streak Master</h3>
            <p className="text-sm text-muted-foreground">
              {hasStreakCert
                ? `Unlocked! Current streak: ${store.streak} days`
                : `Maintain a 7-day streak (${store.streak}/7)`}
            </p>
          </CardContent>
        </Card>

        <Card className={`glass rounded-2xl ${hasQuizCert ? "glow-accent" : "opacity-50"}`}>
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-5xl">{hasQuizCert ? "🏅" : "🔒"}</div>
            <h3 className="font-display font-bold text-lg">Quiz Champion</h3>
            <p className="text-sm text-muted-foreground">
              {hasQuizCert
                ? `Unlocked! ${store.quizCount} quizzes completed`
                : `Complete 10 quizzes (${store.quizCount}/10)`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
