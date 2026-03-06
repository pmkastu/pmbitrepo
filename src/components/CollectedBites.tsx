import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Bite } from "@/data/bites";
import { cn } from "@/lib/utils";

interface CollectedBitesProps {
  bites: Bite[];
  onSelectBite?: (id: number) => void;
}

const categoryColors: Record<string, string> = {
  Technical: "bg-primary/10 text-primary border-primary/20",
  "Soft Skills": "bg-accent/10 text-accent-foreground border-accent/20",
  "General Knowledge": "bg-success/10 text-success border-success/20",
};

export function CollectedBites({ bites, onSelectBite }: CollectedBitesProps) {
  const typeGroups = useMemo(() => {
    return {
      quiz: bites.filter((b) => b.type === "quiz").length,
      fact: bites.filter((b) => b.type === "fact").length,
      tip: bites.filter((b) => b.type === "tip").length,
    };
  }, [bites]);

  const categoryGroups = useMemo(() => {
    const groups: Record<string, number> = {};
    bites.forEach((b) => {
      groups[b.category] = (groups[b.category] || 0) + 1;
    });
    return groups;
  }, [bites]);

  return (
    <Card className="glass rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg">📚 Your Collection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{bites.length}</p>
          <p className="text-sm text-muted-foreground">Bites Collected</p>
        </div>

        {/* Type breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">By Type</p>
          <div className="flex gap-2">
            {typeGroups.quiz > 0 && (
              <Badge variant="outline" className="text-xs">
                📝 {typeGroups.quiz} Quiz
              </Badge>
            )}
            {typeGroups.fact > 0 && (
              <Badge variant="outline" className="text-xs">
                💡 {typeGroups.fact} Fact
              </Badge>
            )}
            {typeGroups.tip > 0 && (
              <Badge variant="outline" className="text-xs">
                ⚡ {typeGroups.tip} Tip
              </Badge>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">By Category</p>
          <div className="space-y-1.5">
            {Object.entries(categoryGroups).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{category}</span>
                <Badge
                  variant="outline"
                  className={cn("text-xs font-semibold", categoryColors[category])}
                >
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bites */}
        {bites.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Latest Collected</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {bites.slice(-5).reverse().map((bite) => (
                <button
                  key={bite.id}
                  onClick={() => onSelectBite?.(bite.id)}
                  className="w-full text-left p-2 rounded-lg hover:bg-secondary/50 transition-colors text-xs leading-snug text-muted-foreground hover:text-foreground"
                  title={bite.content}
                >
                  <div className="line-clamp-2">{bite.content}</div>
                  <Badge variant="secondary" className="text-xs mt-1 capitalize">
                    {bite.type}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
