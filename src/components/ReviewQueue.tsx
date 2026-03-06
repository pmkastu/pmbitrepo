import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBites } from "@/data/bites";

interface ReviewItem {
  biteId: number;
  confidence: string;
  nextReviewDate: string;
}

interface ReviewQueueProps {
  items: ReviewItem[];
  onReview: (biteId: number) => void;
}

export function ReviewQueue({ items, onReview }: ReviewQueueProps) {
  if (items.length === 0) {
    return (
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4" /> Upcoming Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            🎉 No reviews pending! Complete more quizzes to build your queue.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <CalendarClock className="h-4 w-4" /> Upcoming Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.slice(0, 5).map((item) => {
          const bite = getBites().find((b) => b.id === item.biteId);
          if (!bite) return null;
          const isOverdue = new Date(item.nextReviewDate) <= new Date();
          return (
            <div
              key={item.biteId}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{bite.content.slice(0, 40)}</p>
                <p className="text-xs text-muted-foreground">
                  {isOverdue ? "⚠️ Overdue" : `📅 ${item.nextReviewDate}`}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onReview(item.biteId)} className="shrink-0 ml-2">
                Review
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
