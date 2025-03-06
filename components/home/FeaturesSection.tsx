import FeatureCard from "./FeatureCard";
import { features } from "@/data/features";
import { Heading, Text } from "@/components/ui/typography";

export default function FeaturesSection() {
  return (
    <section className="relative py-24 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Heading as="h2" size="lg" className="text-dark-blue">
            Advanced Health Analytics
          </Heading>
          <Text muted className="max-w-2xl mx-auto">
            Get detailed insights into your health metrics with our comprehensive tracking system.
          </Text>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 