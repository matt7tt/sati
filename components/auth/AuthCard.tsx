import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <span className="text-xl font-bold text-primary">KWILT</span>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
        
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
} 