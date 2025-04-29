import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeatureSections() {
  return (
    <div className="bg-white py-24">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="space-y-24">
          {/* Main heading for the page section */}
          <div className="pb-4">
            <h2 className="text-4xl font-bold text-gray-900">
              living well today for<br />a better tomorrow
            </h2>
          </div>

          {/* First feature section - Image on left */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-2/5">
              <div className="rounded-2xl overflow-hidden">
                <Image 
                  src="/images/assets/mario-von-rotz-1pcMSzyNPyg-unsplash 1.png"
                  alt="Person standing on beach at sunset"
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-3/5">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Start your journey</h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                Everyone's path to healthier aging is unique. Kwilt's personalized approach provides a
                holistic suite of science-backed tools to help you take control.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Whether you're looking for comprehensive support or supplements, you're covered.
              </p>
              <Button asChild variant="link" className="text-[#FC6B6B] hover:text-[#FC6B6B]/90 font-semibold px-0 h-auto">
                <Link href="/onboarding" className="flex items-center">
                  Join now <span className="ml-1">→</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Second feature section - Image on right */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="w-full md:w-2/5">
              <div className="rounded-2xl overflow-hidden">
                <Image 
                  src="/images/assets/polina-kuzovkova-WbV_i-dpGKA-unsplash 2.png"
                  alt="Woman in athletic wear at the beach"
                  width={500}
                  height={650}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-3/5">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Optimize your age</h3>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Discover your true cellular age. Powered by Kwilt<sup>®</sup> diagnostics, our blood test analyzes 
                100+ biomarkers to reveal your biological age markers across all major organ systems. 
                Benchmark, track progress, and make changes that matter.
              </p>
              <Button asChild variant="link" className="text-[#FC6B6B] hover:text-[#FC6B6B]/90 font-semibold px-0 h-auto">
                <Link href="/onboarding" className="flex items-center">
                  Start Assessment <span className="ml-1">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 