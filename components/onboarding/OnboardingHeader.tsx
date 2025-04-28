import { Heading, Text } from "@/components/ui/typography"

export default function OnboardingHeader() {
  return (
    <div className="text-center mb-8">
      <Heading size="h1">Welcome to KWILT</Heading>
      <Text size="lg" className="text-subtext mt-2">
        Let's create your personalized health optimization plan.
      </Text>
    </div>
  )
} 