interface FeatureCardProps {
  title: string;
  description: string;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-2 text-dark-blue">{title}</h3>
      <p className="text-subtext text-sm">{description}</p>
    </div>
  );
} 