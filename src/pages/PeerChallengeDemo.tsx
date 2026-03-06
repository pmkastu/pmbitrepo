import { PeerChallenge } from "@/components/PeerChallenge";

export default function PeerChallengeDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <PeerChallenge quizCount={5} />
      </div>
    </div>
  );
}
