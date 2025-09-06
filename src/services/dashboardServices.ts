import apiClient from '../apiClient';
import {
  DashboardOverviewResponse,
  DashboardChartResponse,
  DashboardPieChartResponse,
  DashboardRadarChartResponse,
  DashboardQuickActionResponse,
  DashboardQuickActionArray,
  DashboardSettingsResponse,
  DashboardSettingsPut
} from '../types/dashboardTypes';

export const getDashboardOverview = async () => {
  const res = await apiClient.get<DashboardOverviewResponse>('/dashboard/overview');
  return res.data;
};

export const getDashboardAreaChart = async () => {
  const res = await apiClient.get<DashboardChartResponse>('/dashboard/area-chart');
  return res.data;
};

export const getDashboardBarChart = async () => {
  const res = await apiClient.get<DashboardChartResponse>('/dashboard/bar-chart');
  return res.data;
};

export const getDashboardPieChart = async () => {
  const res = await apiClient.get<DashboardPieChartResponse>('/dashboard/pie-chart');
  return res.data;
};

export const getDashboardRadarChart = async () => {
  const res = await apiClient.get<DashboardRadarChartResponse>('/dashboard/radar-chart');
  return res.data;
};

export const getDashboardQuickActions = async () => {
  const res = await apiClient.get<DashboardQuickActionResponse | DashboardQuickActionArray>('/dashboard/quick-actions');
  return res.data;
};

export const getDashboardSettings = async () => {
  const res = await apiClient.get<DashboardSettingsResponse>('/dashboard/settings');
  return res.data;
};

export const putDashboardSettings = async (settings: DashboardSettingsPut) => {
  const res = await apiClient.put<DashboardSettingsResponse>('/dashboard/settings', settings);
  return res.data;
};
