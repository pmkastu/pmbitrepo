import React, { useState, useEffect } from 'react';
import { Zap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pricingData = {
  free: {
    landing: { 
      price: "Free", 
      features: ["Daily Knowledge Bites", "Basic Quiz", "Memory Heatmap", "Peer Challenges"] 
    },
    pro: { 
      price: "₹99/month", 
      features: ["All Free Features", "AI Deep Dive", "Unlimited Quizzes", "Certificates", "Advanced Analytics", "Priority Support"] 
    }
  }
};

const PricingCard = ({ type, mode }: { type: 'landing' | 'pro'; mode: 'free' | 'pro' }) => {
  const isPro = type === 'pro';
  const [displayData, setDisplayData] = useState(pricingData[mode][type]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayData(pricingData[mode][type]);
      setIsAnimating(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [mode, type]);

  const title = isPro ? 'PRO PLAN' : 'FREE PLAN';
  const borderClass = isPro 
    ? 'border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-purple-900/10' 
    : 'border-2 border-blue-500/50 bg-gradient-to-br from-blue-900/20 to-blue-900/10';

  return (
    <div className={`relative rounded-2xl p-6 md:p-8 ${borderClass} backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-opacity-100`}>
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold">
            {isPro ? <Zap className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            {title}
          </div>
        </div>

        <p className="text-5xl md:text-6xl font-black text-white mb-2">
          {displayData.price}
        </p>
        <p className="text-sm font-medium text-white/70 mb-6">
          {isPro ? 'Unlock full potential' : 'Start learning free'}
        </p>

        {/* Features */}
        <div className={`transition-opacity duration-300 flex-1 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="space-y-3 mb-8">
            {displayData.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <Button 
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
            isPro 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
          }`}
        >
          {isPro ? 'Upgrade Now' : 'Get Started'}
        </Button>
      </div>

      {/* Background glow */}
      {isPro && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </div>
  );
};

export const AnimatedPricingPage = () => {
  const [mode, setMode] = useState('free');

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.checked ? 'pro' : 'free');
  };

  return (
    <div className="relative w-full py-16 md:py-24 px-4">
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Start free and upgrade whenever you're ready for advanced features and AI-powered insights.
          </p>

          {/* Toggle */}
          <div className="flex justify-center items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur w-fit mx-auto rounded-full p-1">
            <span className={`text-sm font-medium transition-colors ${mode === 'free' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Free Plan
            </span>
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="toggle" 
                className="sr-only" 
                onChange={handleToggle}
              />
              <div className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${mode === 'pro' ? 'translate-x-6' : ''}`} />
              </div>
            </label>
            <span className={`text-sm font-medium transition-colors ${mode === 'pro' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Pro Plan
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
          <PricingCard type="landing" mode={mode as 'free' | 'pro'} />
          <PricingCard type="pro" mode={mode as 'free' | 'pro'} />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-5 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

// alias used in earlier example snippets
export { AnimatedPricingPage as PricingPage };

