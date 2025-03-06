import { Heading, Text } from "@/components/ui/typography"

export default function DashboardHeader() {
  return (
    <div className="mb-8">
      <Heading size="h1">Welcome Back</Heading>
      <Text size="lg" className="text-subtext mt-2">
        Track your health optimization progress and view personalized recommendations.
      </Text>
    </div>
  )
} 