export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="animate-pulse space-y-4 text-center">
        <div className="h-8 w-64 bg-accent/20 rounded-md mx-auto"></div>
        <div className="h-4 w-48 bg-accent/10 rounded-md mx-auto"></div>
        <div className="mt-8 h-64 w-full max-w-md bg-white/50 rounded-lg mx-auto"></div>
      </div>
    </div>
  )
} 