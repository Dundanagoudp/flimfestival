// Dashboard Overview
export interface DashboardOverviewResponse {
  success: boolean;
  data: {
    totalUsers: DashboardMetric;
    activeSessions: DashboardMetric;
    pageViews: DashboardMetric;
    bounceRate: DashboardMetric;
  };
  period: string;
  lastUpdated: string;
  stats: {
    totalSubmissions: number;
    totalRegistrations: number;
    totalBlogs: number;
    totalEvents: number;
    totalAwards: number;
    totalGuests: number;
  };
}

export interface DashboardMetric {
  value: number;
  change: number | string;
  trend: 'up' | 'down';
}

// Area/Bar Chart
export interface DashboardChartResponse {
  success: boolean;
  data: {
    labels: string[];
    datasets: DashboardChartDataset[];
  };
  trend?: string;
  period?: string;
}

export interface DashboardChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
  borderWidth?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
}

// Pie Chart
export interface DashboardPieChartResponse {
  success: boolean;
  data: {
    labels: string[];
    datasets: DashboardPieChartDataset[];
  };
  totalSubmissions?: number;
  period?: string;
}

export interface DashboardPieChartDataset {
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

// Radar Chart (same as area/bar, but with extra point properties)
export type DashboardRadarChartResponse = DashboardChartResponse;

// Quick Actions
export interface DashboardQuickActionResponse {
  success: boolean;
  data: DashboardQuickAction[];
}

// Alternative Quick Actions response (when success field is missing)
export type DashboardQuickActionArray = DashboardQuickAction[];

export interface DashboardQuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  order: number;
}

// Settings
export interface DashboardSettingsResponse {
  success: boolean;
  data: {
    refreshInterval: number;
    chartTypes: {
      areaChart: boolean;
      barChart: boolean;
      pieChart: boolean;
      radarChart: boolean;
    };
    isActive: boolean;
  };
}

export interface DashboardSettingsPut {
  refreshInterval: number;
  chartTypes: {
    areaChart: boolean;
    barChart: boolean;
    pieChart: boolean;
    radarChart: boolean;
  };
  isActive: boolean;
}
