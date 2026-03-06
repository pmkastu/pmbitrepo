import { Volume2, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTTS } from "@/hooks/use-tts";
import { cn } from "@/lib/utils";

interface TTSButtonProps {
  text: string;
  disabled?: boolean;
}

export function TTSButton({ text, disabled }: TTSButtonProps) {
  const { speaking, paused, voices, selectedVoice, setSelectedVoice, speak, pause, resume, stop } = useTTS();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn("relative", speaking && "text-primary")}
          title={disabled ? "Pro feature" : "Text-to-Speech"}
        >
          <Volume2 className={cn("h-4 w-4", speaking && !paused && "animate-pulse")} />
          {disabled && (
            <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground rounded px-1">
              PRO
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 glass rounded-xl" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {!speaking && (
              <Button size="sm" onClick={() => speak(text)} className="flex-1 gradient-primary text-primary-foreground">
                <Play className="h-3.5 w-3.5 mr-1" /> Play
              </Button>
            )}
            {speaking && !paused && (
              <Button size="sm" variant="outline" onClick={pause} className="flex-1">
                <Pause className="h-3.5 w-3.5 mr-1" /> Pause
              </Button>
            )}
            {speaking && paused && (
              <Button size="sm" variant="outline" onClick={resume} className="flex-1">
                <Play className="h-3.5 w-3.5 mr-1" /> Resume
              </Button>
            )}
            {speaking && (
              <Button size="sm" variant="destructive" onClick={stop}>
                <Square className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.slice(0, 15).map((v) => (
                <SelectItem key={v.name} value={v.name} className="text-xs">
                  {v.name.slice(0, 30)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
