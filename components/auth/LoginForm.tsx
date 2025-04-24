'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

// Get API URL from environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    // Only check auth if user was redirected here
    const referrer = document.referrer;
    if (!referrer || window.location.pathname === '/login') {
      return;
    }

    const token = localStorage.getItem('access_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    console.log('Login - Auth Check:', {
      hasToken: !!token,
      isAuthenticated: isAuthenticated === 'true',
      referrer
    });

    if (token && isAuthenticated === 'true') {
      console.log('Valid authentication found, redirecting to dashboard...');
      window.location.replace(`${window.location.origin}/dashboard`);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login...');
      
      // Create form data
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await fetch(`${API_URL}/api/auth/token`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      const data = await response.json();
      console.log('Login response:', { status: response.status, data });
      
      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422) {
          throw new Error('Invalid email or password format');
        }
        throw new Error(data.detail || data.message || 'Login failed');
      }
      
      // Store the access token and authentication state
      if (data.access_token) {
        console.log('Token received:', data.access_token.substring(0, 20) + '...');
        
        // Store in localStorage for client-side checks
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user_email', email);
        
        // Store in cookies for middleware
        document.cookie = `access_token=${data.access_token}; path=/`;
        
        // Verify token was stored
        const storedToken = localStorage.getItem('access_token');
        console.log('Auth state after login:', {
          tokenStored: !!storedToken,
          tokenPrefix: storedToken ? storedToken.substring(0, 20) : null,
          cookieSet: document.cookie.includes('access_token')
        });
        
        // Force a complete page reload and navigation
        console.log('Forcing page reload and redirect to dashboard...');
        window.location.replace(`${window.location.origin}/dashboard`);
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded flex items-center text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
} 