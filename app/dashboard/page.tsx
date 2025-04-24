"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Zap, Bell, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Suspense, useEffect, useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import QuickActions from '@/components/dashboard/QuickActions';
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import Loading from './loading';

// User profile interface
interface UserProfile {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at?: string;
  role?: number;
}

// Intake form interface (simplified version with just what we need)
interface IntakeForm {
  id: number;
  user_id: number;
  full_name: string;
  // other fields omitted for brevity
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [intakeForm, setIntakeForm] = useState<IntakeForm | null>(null);
  const [streak, setStreak] = useState(14);
  const [lastUpdated, setLastUpdated] = useState("Today, 9:45 AM");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('access_token');
        
        // Fetch user profile
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);
        }
        
        // Fetch intake form
        const intakeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/intake-form`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (intakeResponse.ok) {
          const intakeData = await intakeResponse.json();
          setIntakeForm(intakeData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to default values if fetch fails
        if (!userProfile) {
          setUserProfile({
            id: 1,
            email: "user@example.com",
            username: "User",
            created_at: new Date().toISOString()
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Get user name from intake form or fall back to username from profile
  const userName = intakeForm?.full_name || userProfile?.username || "User";
  
  // Get initials for avatar
  const userInitials = userName
    ? userName.split(' ').map(n => n[0]).join('')
    : "U";

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex justify-center items-center">
        <div className="animate-pulse text-xl font-bold text-primary">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            {userInitials}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, {userName}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🔥 {streak} day streak</span>
              <span className="text-xs">•</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<div className="text-center py-4">Loading stats...</div>}>
          <DashboardStats />
        </Suspense>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="text-center py-4">Loading analytics...</div>}>
              <AnalyticsChart />
            </Suspense>
          </div>
          
          <div className="space-y-6">
            <QuickActions />
            <Suspense fallback={<div className="text-center py-4">Loading activity...</div>}>
              <RecentActivity />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

