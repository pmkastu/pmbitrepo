import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getBites } from "@/data/bites";

interface HeatmapProps {
  confidenceRatings: Record<string, "confused" | "getting-there" | "mastered">;
}

const colorMap = {
  mastered: "bg-success/80 hover:bg-success",
  "getting-there": "bg-accent/70 hover:bg-accent",
  confused: "bg-destructive/60 hover:bg-destructive/80",
  none: "bg-secondary hover:bg-secondary/80",
};

export function MemoryHeatmap({ confidenceRatings }: HeatmapProps) {
  // Dynamically get unique tags from loaded bites
  const cells = useMemo(() => {
    const allTags = new Set<string>();
    getBites().forEach((b) => {
      allTags.add(b.category);
      b.tags.forEach((t) => allTags.add(t));
    });
    return Array.from(allTags).slice(0, 35);
  }, []);

  return (
    <Card className="glass rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base">🧠 Memory Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cat, i) => {
            const rating = confidenceRatings[cat] || "none";
            return (
              <Tooltip key={i}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "w-full aspect-square rounded-sm transition-all duration-200 cursor-pointer",
                      colorMap[rating as keyof typeof colorMap]
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-medium">{cat}</p>
                  <p className="text-xs text-muted-foreground capitalize">{rating === "none" ? "Not attempted" : rating.replace("-", " ")}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        <div className="flex gap-3 mt-3 text-xs text-muted-foreground justify-center">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-success/80" /> Mastered</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-accent/70" /> Getting There</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-destructive/60" /> Confused</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-secondary" /> N/A</span>
        </div>
      </CardContent>
    </Card>
  );
}
