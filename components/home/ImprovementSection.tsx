import Image from "next/image";

export default function ImprovementSection() {
  return (
    <div className="bg-white">
      <div className="container max-w-5xl mx-auto px-6 mb-16">
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative h-72 md:h-80">
            <Image 
              src="/images/assets/daniel-j-schwarz-4StES1hWBdY-unsplash 2.png"
              alt="Smiling woman"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>
          
          <div className="absolute top-0 left-0 h-full p-6 md:p-8 flex flex-col justify-center max-w-md">
            <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Age slower. Live better.</p>
            <h2 className="text-white text-6xl md:text-7xl font-bold mb-2">80%</h2>
            <p className="text-white text-lg md:text-xl leading-tight">
              of members improve their<br />biological age within the<br />first 12 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 