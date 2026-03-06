import { useState, useEffect, useMemo } from "react";
import { loadBites, getBites, type Bite } from "@/data/bites";
import { BiteCard } from "@/components/BiteCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = ["All", "Technical", "Soft Skills", "General Knowledge"];
const types = ["All", "quiz", "fact", "tip"];

export default function Library() {
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadBites().then(() => setLoaded(true));
  }, []);

  const filtered = useMemo(() => {
    let result = getBites();
    if (filter !== "All") result = result.filter((b) => b.category === filter);
    if (typeFilter !== "All") result = result.filter((b) => b.type === typeFilter);
    return result.slice(0, 50); // Paginate for performance
  }, [filter, typeFilter, loaded]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold gradient-text">📚 Content Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse all {getBites().length} micro-learning bites
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200",
                filter === cat && "gradient-primary text-primary-foreground"
              )}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <Badge
              key={t}
              variant={typeFilter === t ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 capitalize",
                typeFilter === t && "gradient-primary text-primary-foreground"
              )}
              onClick={() => setTypeFilter(t)}
            >
              {t === "All" ? "All Types" : t}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((bite) => (
          <BiteCard key={bite.id} bite={bite} onAiDive={() => {}} />
        ))}
      </div>

      {filtered.length === 0 && loaded && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No bites found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
