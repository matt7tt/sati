import NavBar from "@/components/home/NavBar";
import HeroContent from "@/components/home/HeroContent";
import FeatureSections from "@/components/home/FeatureSections";
import DailyDoseSection from "@/components/home/DailyDoseSection";
import ImprovementSection from "@/components/home/ImprovementSection";
import CustomizedPathSection from "@/components/home/CustomizedPathSection";
import AllInOneSection from "@/components/home/AllInOneSection";
import JoinNowSection from "@/components/home/JoinNowSection";
import FooterSection from "@/components/home/FooterSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Hero Image Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/assets/erik-dungan-lNUi7W4iwok-unsplash 1.png"
            alt="Person swimming in clear water"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full">
          <NavBar />
          <HeroContent />
        </div>
      </div>
      
      {/* Feature Sections */}
      <FeatureSections />
      
      {/* Daily Dose Section */}
      <DailyDoseSection />
      
      {/* Improvement Section */}
      <ImprovementSection />
      
      {/* Customized Path Section */}
      <CustomizedPathSection />
      
      {/* All in One Section */}
      <AllInOneSection />
      
      {/* Join Now Section */}
      <JoinNowSection />
      
      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}

