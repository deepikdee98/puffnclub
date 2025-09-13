// Dashboard data types
export interface DashboardMetrics {
  revenue: {
    today: number;
    week: number;
    month: number;
    growth: number;
    trend: string;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    growth: number;
    trend: string;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
    trend: string;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
    growth: number;
    trend: string;
  };
}

export interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  stock: number;
  image: string;
}

export interface SalesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: string;
}