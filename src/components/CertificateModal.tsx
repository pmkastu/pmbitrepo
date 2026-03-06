import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  streak: number;
  quizCount: number;
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = [
    "bg-primary", "bg-accent", "bg-success", "bg-gold",
  ];
  const color = colors[index % colors.length];
  const left = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 2}s`;
  const size = Math.random() * 8 + 4;

  return (
    <div
      className={`absolute confetti-piece ${color} rounded-sm`}
      style={{ left, animationDelay: delay, width: size, height: size, top: -10 }}
    />
  );
}

export function CertificateModal({ open, onClose, streak, quizCount }: CertificateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong rounded-2xl overflow-hidden max-w-md">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>

        <DialogHeader className="text-center relative z-10">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full gradient-primary flex items-center justify-center glow-primary">
            <span className="text-4xl">🏅</span>
          </div>
          <DialogTitle className="font-display text-2xl gradient-text">
            Micro Mastery Certificate!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-3 relative z-10">
          <p className="text-muted-foreground text-sm">
            🎉 Congratulations! You've demonstrated exceptional learning dedication.
          </p>
          <div className="flex justify-center gap-6 py-2">
            <div className="text-center">
              <p className="font-display text-2xl font-bold gradient-text">{streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold gradient-text">{quizCount}</p>
              <p className="text-xs text-muted-foreground">Quizzes Done</p>
            </div>
          </div>
          <Button onClick={onClose} className="gradient-primary text-primary-foreground w-full">
            Awesome! 🎉
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
