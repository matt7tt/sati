export interface InsightRow {
  id: number;
  user_id: number;
  issue: string;
  recommendation: string;
  updated_at: string;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  activePrompts: number;
  completionRate: number;
  averageScore: number;
} 