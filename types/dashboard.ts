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

export interface Meal {
  id: number;
  user_id: number;
  name: string;
  image_url: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  consumed_at: string;
  created_at: string;
  updated_at: string;
}
