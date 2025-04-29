import Image from "next/image";
import Link from "next/link";

export default function FooterSection() {
  return (
    <div className="bg-[#f8f5f2] pb-8">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Email subscription */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 border-b border-gray-300">
          <div className="text-xs text-gray-700 mb-4 md:mb-0">
            Age slower. Live better.
          </div>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="email"
              className="bg-transparent border-b border-gray-400 px-2 py-1 text-xs text-gray-700 focus:outline-none w-24 sm:w-32"
            />
            <button className="ml-2 text-xs text-gray-700">→</button>
          </div>
        </div>
        
        {/* KWILT Logo */}
        <div className="py-8 mb-4">
          <div className="relative h-20 w-full max-w-md">
            <Image
              src="/images/assets/kwilt_brown logo.png"
              alt="KWILT"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">kwilt ©2025</p>
          <p className="text-xs text-gray-600">A new era of aging for women.</p>
        </div>
        
        {/* Footer links */}
        <div className="grid grid-cols-4 gap-6 border-t border-gray-300 pt-6 pb-4">
          <div>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Home</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Shop</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Science</Link>
          </div>
          <div>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Membership</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Contact Us</Link>
          </div>
          <div>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Terms</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">FAQs</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Support</Link>
          </div>
          <div>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Press</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Blog</Link>
            <Link href="/" className="block text-xs text-gray-700 mb-1.5">Affiliates</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 