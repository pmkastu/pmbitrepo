import React from "react";
import AuthSwitchDemo from "@/components/ui/auth-switch-demo";
import AnimatedPricingDemo from "@/components/ui/animated-pricing-demo";
import QuizDemo from "@/components/ui/quiz-demo";

export default function DemoPage() {
  return (
    <div className="space-y-12 p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Auth Switch Example</h2>
        <AuthSwitchDemo />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Pricing Page Example</h2>
        <AnimatedPricingDemo />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Quiz Section Example</h2>
        <QuizDemo />
      </section>
    </div>
  );
}
