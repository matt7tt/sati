import { Heading, Text } from "@/components/ui/typography"

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingHeader({ currentStep, totalSteps }: OnboardingHeaderProps) {
  return (
    <header className="py-6 px-8 border-b border-border">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Heading as="h1" size="sm" className="text-text">
          FutureProof Health
        </Heading>
        <Text size="sm" className="text-accent font-medium">
          Onboarding ({currentStep} of {totalSteps})
        </Text>
      </div>
    </header>
  )
} 