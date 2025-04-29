import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-4">
      <div className="flex-1 flex items-center justify-start">
        <Link href="/" className="text-sm font-medium text-white/90 px-4">
          SHOP
        </Link>
        <Link href="/" className="text-sm font-medium text-white/90 px-4">
          SCIENCE
        </Link>
        <Link href="/" className="text-sm font-medium text-white/90 px-4">
          LEARN
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-end">
        <Link href="/login" className="text-sm font-medium text-white/90 px-4">
          LOG IN
        </Link>
      </div>
    </nav>
  );
} 