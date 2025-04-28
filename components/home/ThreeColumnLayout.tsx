import Link from "next/link";
import { Button } from "@/components/ui/button";

// Placeholder SVG component
const PlaceholderImage = ({ text, width, height, className }) => (
  <div 
    className={`flex items-center justify-center bg-muted ${className}`}
    style={{ width: width, height: height }}
  >
    <span className="text-xs text-muted-foreground">{text}</span>
  </div>
);

export default function VerticalLayout() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-12">
        {/* Section 1: Brand Intro */}
        <section className="bg-white/90 rounded-xl p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-[#8A6A5E] mb-1">KWILT<sup className="text-sm align-super">®</sup></h1>
            <p className="text-sm text-muted-foreground mb-6">Longevity made simple</p>
            
            <div className="mb-8">
              <p className="text-sm mb-4">
                Kwilt<sup>®</sup> is pioneering a new longevity platform, combining cutting 
                edge science with tools that help you reach your wellness goals.
                Because optimizing your health shouldn't feel complicated.
                It's science simplified.
              </p>
            </div>
            
            <h2 className="text-lg font-semibold text-[#8A6A5E] mb-2">living well today for a better tomorrow</h2>
            
            <div className="relative mt-4 mb-6 rounded-lg overflow-hidden">
              <PlaceholderImage 
                text="Sunset Silhouette" 
                width="100%" 
                height="240px" 
                className="bg-[#FFA07A]"
              />
            </div>
            
            <p className="text-sm mb-4">
              Connect with experts and science to achieve your wellness goals. Whether you're focused on energy, 
              aging well, or overall health, we help make it simple.
            </p>
            
            <Button className="text-white bg-[#FC6B6B] hover:bg-[#FC6B6B]/90 rounded-full text-sm px-5 py-2 mt-4">
              Join now →
            </Button>
          </div>
        </section>
        
        {/* Section 2: Daily Dose & Customized Path */}
        <section className="bg-white/90 rounded-xl p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-6">Your daily dose of longevity</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg overflow-hidden">
                <PlaceholderImage 
                  text="Woman" 
                  width="100%" 
                  height="160px" 
                  className="bg-[#8A6A5E]"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <PlaceholderImage 
                  text="Nutrition" 
                  width="100%" 
                  height="160px" 
                  className="bg-[#90EE90]"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <PlaceholderImage 
                  text="Supplements" 
                  width="100%" 
                  height="160px" 
                  className="bg-[#20B2AA]"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <PlaceholderImage 
              text="Happy Woman" 
              width="100%" 
              height="300px" 
              className="rounded-lg bg-[#CD853F]"
            />
            
            <div className="text-center mb-6 mt-6">
              <h2 className="text-6xl font-bold text-[#8A6A5E] mb-2">80%</h2>
              <p className="text-lg">of members improve their biological age within the first 3 months.</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-medium mb-6">Customized path</h2>
            <p className="text-base mb-8">We use custom medicine to tailor everything to your body.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="bg-[#F9F5F2] h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="font-medium text-lg">01</span>
                </div>
                <div>
                  <p className="text-base">Tell us your health goals and we'll create your personalized plan</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-[#F9F5F2] h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="font-medium text-lg">02</span>
                </div>
                <div>
                  <p className="text-base">Follow our expert recommendations and track your progress</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-[#F9F5F2] h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="font-medium text-lg">03</span>
                </div>
                <div>
                  <p className="text-base">Connect with health experts for ongoing support</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-[#F9F5F2] h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="font-medium text-lg">04</span>
                </div>
                <div>
                  <p className="text-base">Celebrate measurable improvements in your health metrics</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 3: All in One & Join */}
        <section className="bg-white/90 rounded-xl p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-medium mb-4">All in one</h2>
            <p className="text-base mb-6">All your custom tailored data all in your hand</p>
            
            <div className="bg-[#F9F5F2] rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm font-medium text-muted-foreground">500+ Lab tests yearly</p>
                  <p className="text-base">Monitor key health markers and track improvements</p>
                </div>
                <div className="w-24 h-24 bg-[#E2D9D0] rounded-full flex items-center justify-center">
                  <span className="text-base text-[#8A6A5E]">Chart</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-3">
                  <p className="text-base font-medium mb-1">Doctor Insights</p>
                  <p className="text-sm">Professional analysis of your health data</p>
                </div>
                
                <div>
                  <p className="text-base font-medium mb-1">Lifetime Tracking of Results</p>
                  <p className="text-sm">Watch how your health metrics change over time</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mb-10">
              <Button className="text-[#8A6A5E] bg-[#F9F5F2] hover:bg-[#F9F5F2]/80 font-medium rounded px-6 py-3 text-lg">
                Start Assessment
              </Button>
            </div>
            
            <div className="mb-10">
              <PlaceholderImage 
                text="Sunset View" 
                width="100%" 
                height="300px" 
                className="rounded-lg bg-[#4682B4]"
              />
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-4">Join now</h2>
              <p className="text-base mb-6">Take control of your health journey and join now</p>
              
              <div className="flex flex-col md:flex-row border border-gray-200 rounded-md overflow-hidden">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 focus:outline-none text-base"
                />
                <Button className="bg-[#FC6B6B] hover:bg-[#FC6B6B]/90 text-white text-base px-6 py-3 rounded-none">
                  Join
                </Button>
              </div>
            </div>
            
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-[#8A6A5E]">KWILT<sup className="text-xs align-super">®</sup></h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p>About</p>
                  <p>Product</p>
                  <p>Team</p>
                </div>
                <div className="space-y-2">
                  <p>Testimonials</p>
                  <p>Resources</p>
                  <p>Support</p>
                </div>
                <div className="space-y-2">
                  <p>Terms</p>
                  <p>Privacy</p>
                  <p>Contact</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 