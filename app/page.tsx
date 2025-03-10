import NavBar from "@/components/home/NavBar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background" />
      
      <NavBar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

