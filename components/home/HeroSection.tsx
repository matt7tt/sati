import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 relative">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <Heading 
            as="h1" 
            size="xl" 
            className="text-text"
          >
            Personalized Healthspan
            <span className="block text-accent">Optimization</span>
          </Heading>
          <div className="max-w-3xl mx-auto">
            <Text size="md" muted className="mb-4">
              Experience a new era of proactive wellness designed for busy adults aged 30–60. Our AI-powered system pinpoints your unique needs—improving metabolic health, balancing hormones, protecting your heart, boosting brainpower, and fighting inflammation.
            </Text>
            <Text size="md" muted>
              From customized nutrition and evidence-based exercise routines to advanced therapies and real-time tracking, we help you feel younger, stronger, and more energized. Don't settle for outdated "one-size-fits-all" advice.
            </Text>
          </div>
        </div>
        <div className="mt-12">
          <Button asChild variant="primary" size="lg">
            <Link href="/onboarding">Reclaim Your Vitality Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 