import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";

interface ProGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProGate({ children, fallback }: ProGateProps) {
  const { isPro } = useSubscription();
  const navigate = useNavigate();

  if (isPro) return <>{children}</>;

  return (
    fallback ?? (
      <div className="relative rounded-xl border border-border/50 p-4 bg-secondary/30">
        <div className="flex flex-col items-center gap-2 text-center">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Pro feature</p>
          <Button size="sm" variant="outline" onClick={() => navigate("/subscription")} className="hover-glow">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    )
  );
}
