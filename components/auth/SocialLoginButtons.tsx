'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SocialLoginButtons() {
  const router = useRouter();
  
  const handleGoogleLogin = async () => {
    // Logic for Google login
    router.push('/api/auth/google');
  };
  
  const handleGithubLogin = async () => {
    // Logic for GitHub login
    router.push('/api/auth/github');
  };
  
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
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
      
      <Button 
        variant="outline" 
        onClick={handleGithubLogin}
        className="w-full"
      >
        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          {/* GitHub icon SVG */}
        </svg>
        GitHub
      </Button>
    </div>
  );
} 