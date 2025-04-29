import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroContent() {
  return (
    <div className="h-screen flex flex-col justify-center items-center px-4 sm:px-10 text-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="relative w-[350px] h-[100px] sm:w-[600px] sm:h-[160px] md:w-[800px] md:h-[200px] mx-auto mb-6">
          <Image 
            src="/images/assets/kwilt_white logo.png"
            alt="KWILT"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-white text-lg sm:text-xl font-light mb-10">
          Longevity made simple.
        </p>
      </div>
      
      <div className="max-w-lg mx-auto mb-8">
        <p className="text-white/90 text-sm leading-relaxed mb-10">
          Kwilt<sup>®</sup> is pioneering a new longevity platform, combining cutting 
          edge science with tools that help you reach your wellness goals.
          Because taking control of your health shouldn't feel complicated.
          It's science simplified.
        </p>
        
        <div className="inline-block">
          <Button asChild variant="default" className="rounded-full bg-white hover:bg-white/90 text-gray-900 px-8 h-auto py-2.5">
            <Link href="/onboarding" className="text-base flex items-center">
              Get Started <span className="ml-2">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 