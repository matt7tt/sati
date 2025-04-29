import Image from "next/image";

export default function DailyDoseSection() {
  return (
    <div className="bg-white py-16">
      <div className="container max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Your daily dose of longevity
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Immunity Card */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 sm:h-40 md:h-48">
              <Image 
                src="/images/assets/david-VCUPFJfPuho-unsplash 1.png"
                alt="Person with water bottle"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 bg-blue-50">
              <p className="text-xs text-gray-700 mb-1">Immunity</p>
              <p className="text-sm font-medium">Become the best version of you</p>
            </div>
          </div>
          
          {/* Metabolism Card */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 sm:h-40 md:h-48">
              <Image 
                src="/images/assets/getty-images--rXmZ9315vg-unsplash 1.png"
                alt="Person walking on beach"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 bg-stone-50">
              <p className="text-xs text-gray-700 mb-1">Metabolism</p>
              <p className="text-sm font-medium">Achieve your weight goal</p>
            </div>
          </div>
          
          {/* Libido Card */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 sm:h-40 md:h-48">
              <Image 
                src="/images/assets/joshua-earle-S8vWYoI0Exc-unsplash 2.png"
                alt="Person's hand"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 bg-amber-50">
              <p className="text-xs text-gray-700 mb-1">Libido</p>
              <p className="text-sm font-medium">Gain confidence</p>
            </div>
          </div>
          
          {/* Longevity Card */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 sm:h-40 md:h-48">
              <Image 
                src="/images/assets/leandro-crespi-PFVY0nfkbCg-unsplash 2.png"
                alt="Person with arm raised"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 bg-gray-50">
              <p className="text-xs text-gray-700 mb-1">Longevity</p>
              <p className="text-sm font-medium">Feel your best and strongest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 