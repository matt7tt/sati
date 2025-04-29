import Image from "next/image";
import Link from "next/link";

export default function JoinNowSection() {
  return (
    <div className="bg-[#f8f5f2]">
      <div className="container max-w-5xl mx-auto px-6 pb-16">
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative h-72 md:h-80">
            <Image 
              src="/images/assets/mario-von-rotz-1pcMSzyNPyg-unsplash 1.png"
              alt="Person at sunset"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          {/* Content overlay */}
          <div className="absolute top-0 left-0 p-6 h-full flex flex-col justify-center">
            <div className="max-w-[220px]">
              <h2 className="text-3xl font-bold text-white mb-2">Join now</h2>
              <p className="text-white text-xs mb-6">
                Find a custom plan that moves at your pace.
              </p>
              
              <div className="bg-white p-2">
                <div className="relative">
                  <select className="w-full px-2 py-2 text-xs border border-gray-200 bg-white text-gray-700 appearance-none focus:outline-none">
                    <option>Select a plan</option>
                    <option>Monthly Plan</option>
                    <option>Annual Plan</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 