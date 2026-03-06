import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(100),
  preferences: z.array(z.string()).min(1, "Select at least one topic"),
});

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      if (mode === "forgot") {
        const parsed = z.string().email().safeParse(email);
        if (!parsed.success) {
          setErrors({ email: "Invalid email" });
          setSubmitting(false);
          return;
        }
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error);
        } else {
          toast.success("Password reset email sent! Check your inbox.");
          setMode("signin");
        }
        setSubmitting(false);
        return;
      }

      if (mode === "signup") {
        const result = signUpSchema.safeParse({ email, password, name, preferences });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((e) => {
            if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;
          });
          setErrors(fieldErrors);
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, name, preferences);
        if (error) {
          toast.error(error);
        } else {
          toast.success("Check your email to confirm your account!");
        }
      } else {
        const result = signInSchema.safeParse({ email, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((e) => {
            if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;
          });
          setErrors(fieldErrors);
          setSubmitting(false);
          return;
        }
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error);
        } else {
          navigate("/");
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="gradient-primary rounded-xl p-2.5">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">Bitsize Master</h1>
        </div>

        <Card className="glass rounded-2xl">
          <CardHeader className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="font-display text-xl">
                  {mode === "signin" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
                </CardTitle>
                <CardDescription className="mt-1">
                  {mode === "signin"
                    ? "Sign in to continue learning"
                    : mode === "signup"
                    ? "Start your micro-learning journey"
                    : "We'll send you a reset link"}
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>
                  )}

                          {mode === "signup" && (
                            <div className="space-y-2">
                              <Label>Topics you'd like to study</Label>
                              <div className="space-y-1">
                                {[
                                  "Technical",
                                  "Soft Skills",
                                  "General Knowledge",
                                ].map((cat) => (
                                  <label
                                    key={cat}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={preferences.includes(cat)}
                                      onChange={() => {
                                        setPreferences((prev) =>
                                          prev.includes(cat)
                                            ? prev.filter((x) => x !== cat)
                                            : [...prev, cat]
                                        );
                                      }}
                                    />
                                    <span>{cat}</span>
                                  </label>
                                ))}
                              </div>
                              {errors.preferences && (
                                <p className="text-xs text-destructive">
                                  {errors.preferences}
                                </p>
                              )}
                            </div>
                          )}
                </motion.div>
              </AnimatePresence>

              <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground hover-glow">
                {submitting ? "..." : mode === "forgot" ? "Send Reset Link" : mode === "signin" ? "Sign In" : "Sign Up"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2 text-sm">
              {mode === "signin" && (
                <>
                  <button onClick={() => setMode("forgot")} className="text-primary hover:underline block mx-auto">
                    Forgot password?
                  </button>
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                      Sign up
                    </button>
                  </p>
                </>
              )}
              {mode === "signup" && (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => setMode("signin")} className="text-primary hover:underline">
                    Sign in
                  </button>
                </p>
              )}
              {mode === "forgot" && (
                <button onClick={() => setMode("signin")} className="text-primary hover:underline">
                  ← Back to sign in
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
