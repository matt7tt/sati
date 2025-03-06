import { Suspense } from 'react';
import DashboardStatsDisplay from './DashboardStatsDisplay';
import { DashboardStats } from '@/types/dashboard';

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('https://your-api-url/api/dashboard/stats', { 
    cache: 'no-store' // or { next: { revalidate: 60 } } for ISR
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  
  return response.json();
}

export default async function DashboardStatsData() {
  const stats = await fetchDashboardStats();
  return <DashboardStatsDisplay stats={stats} />;
} 