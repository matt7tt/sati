import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <nav className="relative flex items-center justify-between px-8 py-4 bg-background">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-[#8A6A5E]">
          KWILT<sup className="text-xs">®</sup>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm" className="rounded-full text-[#8A6A5E] border-[#8A6A5E]">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="default" size="sm" className="rounded-full bg-[#FC6B6B] hover:bg-[#FC6B6B]/90 text-white">
          <Link href="/signup">Join Now</Link>
        </Button>
      </div>
    </nav>
  );
} 