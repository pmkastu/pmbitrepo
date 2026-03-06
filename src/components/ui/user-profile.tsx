import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UserProfile = () => {
  const { user, session, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || "User");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setDisplayName(user.user_metadata.name);
    } else if (user?.email) {
      setDisplayName(user.email.split('@')[0]);
    }
  }, [user]);

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-3 p-4 md:p-6 rounded-2xl",
        "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
        "border border-blue-200/50 dark:border-blue-400/30",
        "transition-all duration-300",
        isHovered && "shadow-lg border-blue-400/50 dark:border-blue-300/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className="relative">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-blue-500 to-purple-600",
          "border-2 border-white dark:border-slate-800",
          "shadow-lg transition-transform duration-300",
          isHovered && "scale-110"
        )}>
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-slate-800 shadow-md" />
      </div>

      {/* User Info */}
      <div className="text-center space-y-1">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white">
          Welcome, {displayName.split(' ')[0]}!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="w-full grid grid-cols-2 gap-3 my-2">
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
        </div>
      </div>

      {/* Pro Badge */}
      <div className="w-full bg-gradient-to-r from-yellow-100/30 to-orange-100/30 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-2 border border-yellow-200/50 dark:border-yellow-800/50 flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
          Free Plan
        </span>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full mt-2 flex items-center justify-center gap-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};
