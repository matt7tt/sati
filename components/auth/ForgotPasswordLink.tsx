import Link from 'next/link';

export default function ForgotPasswordLink() {
  return (
    <Link 
      href="/forgot-password" 
      className="text-sm font-medium text-blue-600 hover:text-blue-500"
    >
      Forgot your password?
    </Link>
  );
} 