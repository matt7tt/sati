'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SocialLoginButtons() {
  const router = useRouter();
  
  const handleGoogleLogin = async () => {
    // Logic for Google login
    router.push('/api/auth/google');
  };
  
  return (
    <div className="mt-6">
      <Button 
        variant="outline" 
        onClick={handleGoogleLogin}
        className="w-full"
      >
        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          {/* Google icon SVG */}
        </svg>
        Google
      </Button>
    </div>
  );
} 