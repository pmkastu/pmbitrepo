import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function SubscribeCard() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("📩 Bit Sent! Check your simulated inbox.");
    setEmail("");
  };

  return (
    <Card className="glass rounded-2xl">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="font-display font-semibold text-sm">Get Daily Bits</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass rounded-xl text-sm"
          />
          <Button
            onClick={handleSubscribe}
            className="gradient-primary text-primary-foreground shrink-0"
            size="sm"
          >
            Subscribe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
