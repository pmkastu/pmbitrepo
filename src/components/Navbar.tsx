import { Sun, Moon, Flame, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { LogoIcon } from "@/components/LogoIcon";
import { toast } from "sonner";

interface NavbarProps {
  streak: number;
  dailyGoalProgress: number;
  dailyGoalTarget: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onSimulateNewDay: () => void;
}

export function Navbar({
  streak,
  dailyGoalProgress,
  dailyGoalTarget,
  isDark,
  onToggleTheme,
  onSimulateNewDay,
}: NavbarProps) {
  const goalPercent = Math.round((dailyGoalProgress / dailyGoalTarget) * 100);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out!");
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl p-1">
            <LogoIcon size="md" className="drop-shadow-lg" />
          </div>
          <h1 className="font-display text-xl font-bold gradient-text hidden sm:block">
            Bitsize Master
          </h1>
        </div>

        {/* Center: streak + goal */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-xl streak-bounce" key={streak}>🔥</span>
            <span className="font-display font-bold text-lg">{streak}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">day streak</span>
          </div>

          <div className="hidden md:flex items-center gap-2 min-w-[160px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Daily Goal</span>
            <div className="flex-1 relative">
              <Progress value={goalPercent} className="h-2.5 bg-secondary" />
              <div
                className="absolute inset-0 h-2.5 rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium">{dailyGoalProgress}/{dailyGoalTarget}</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSimulateNewDay} className="text-xs glass hover-glow">
            <Flame className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">New Day</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleTheme} className="hover-glow">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out" className="hover-glow">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
