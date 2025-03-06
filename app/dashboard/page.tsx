"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Suspense } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import QuickActions from '@/components/dashboard/QuickActions';
import Loading from './loading';

// The API returns an array of objects with these properties
interface InsightRow {
  id: number
  user_id: number
  issue: string
  recommendation: string
  updated_at: string
  created_at: string
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader title="Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Suspense fallback={<div className="col-span-3">Loading stats...</div>}>
          <DashboardStats />
        </Suspense>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading analytics...</div>}>
            <AnalyticsChart />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          <Suspense fallback={<div>Loading activity...</div>}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

