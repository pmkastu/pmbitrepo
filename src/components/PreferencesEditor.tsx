import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const categories = ["Technical", "Soft Skills", "General Knowledge"];

interface PreferencesEditorProps {
  preferences: string[];
  onSave: (prefs: string[]) => Promise<void> | void;
}

export function PreferencesEditor({ preferences, onSave }: PreferencesEditorProps) {
  const [local, setLocal] = useState<string[]>(preferences);

  useEffect(() => {
    setLocal(preferences);
  }, [preferences]);

  const toggle = (cat: string) => {
    setLocal((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="space-y-3 p-4 bg-card rounded-lg">
      <p className="font-medium">Learning preferences</p>
      <div className="space-y-1">
        {categories.map((cat) => (
          <label key={cat} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={local.includes(cat)}
              onChange={() => toggle(cat)}
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>
      <Button
        size="sm"
        onClick={() => onSave(local)}
        disabled={
          local.length === 0 ||
          (preferences.length === local.length &&
            preferences.every((v) => local.includes(v)))
        }
      >
        Save preferences
      </Button>
    </div>
  );
}
