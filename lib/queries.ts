import { useQuery } from '@tanstack/react-query';
import { DashboardStats } from '@/types/dashboard';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
} 