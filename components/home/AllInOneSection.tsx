import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AllInOneSection() {
  return (
    <div className="bg-[#f8f5f2] py-16">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Left column - text content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              All in one
            </h2>
            <p className="text-gray-700 text-sm mb-8">
              It's your custom treatment plan, at your pace.
            </p>
            
            <div className="space-y-5">
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">100+ Lab tests yearly</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Trusted by healthcare providers and valued users typically not covered by insurance. Studies label this a top use of health $s.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">Doctor Insights</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Get insights from top doctors and 1000s of hours of research. Your personal health assistant is powered by AI but has real humans for when you'd need them—just like your phone. If any point, need to ask a question?
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">Lifetime Tracking of Results</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Results are organized in reports you can view anytime, on any device, with easy access.
                </p>
              </div>
              
              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-none bg-transparent border-gray-900 text-gray-900 hover:bg-gray-100 px-6 py-1.5 h-auto text-sm">
                  <Link href="/onboarding">Start Assessment</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right column - pill/medical device image */}
          <div className="w-full md:w-1/2">
            <div className="relative h-72 md:h-80">
              <Image 
                src="/images/assets/Vile_stats.png"
                alt="Medical device with health stats"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 