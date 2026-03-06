import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBites } from "@/data/bites";

interface SearchBiteProps {
  onSelectBite: (id: number) => void;
  allowedCategories?: string[];
}

export function SearchBite({ onSelectBite, allowedCategories }: SearchBiteProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return getBites()
      .filter(
        (b) =>
          // respect optional allowed categories
          (!allowedCategories || allowedCategories.length === 0 ||
            allowedCategories.includes(b.category)) &&
          (b.tags.some((t) => t.toLowerCase().includes(q)) ||
            b.content.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [query, allowedCategories]);

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bites by topic, tag, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 glass rounded-xl"
        />
      </div>
      {results.length > 0 && (
        <div className="space-y-1.5 animate-fade-in">
          {results.map((bite) => (
            <Card
              key={bite.id}
              className="glass rounded-xl cursor-pointer hover-glow"
              onClick={() => {
                onSelectBite(bite.id);
                setQuery("");
              }}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {highlightMatch(bite.content.slice(0, 60))}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {bite.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs text-muted-foreground">
                        {highlightMatch(`#${t}`)}
                      </span>
                    ))}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 ml-2">
                  {bite.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
