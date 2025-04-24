import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-background">
      <Link href="/" className="text-2xl font-medium text-text">
        Zeal.health
      </Link>
      <div className="flex items-center gap-8">
        <Link href="#how-it-works" className="text-sm text-text hover:text-accent transition-colors">
          How it works
        </Link>
        <Link href="#whats-included" className="text-sm text-text hover:text-accent transition-colors">
          What's included
        </Link>
        <Link href="#faq" className="text-sm text-text hover:text-accent transition-colors">
          FAQ
        </Link>
        <Link href="#employers" className="text-sm text-text hover:text-accent transition-colors">
          Employers
        </Link>
        <Link href="#about" className="text-sm text-text hover:text-accent transition-colors">
          About
        </Link>
        <Button asChild variant="default" size="default">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="primary" size="default">
          <Link href="/onboarding">Start Optimization</Link>
        </Button>
      </div>
    </nav>
  );
} 