import { apiRequest } from '../api-service';
import { STRINGS } from '../../constants/strings';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface StatItem {
  id: string;
  value: string;
  label: string;
  desc: string;
  lightBg: string;
  lightBorder: string;
  darkBorder: string;
  valueColor: { light: string; dark: string };
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_STATS: StatItem[] = [
  {
    id: 'active',
    value: '1,240',
    label: STRINGS.STAT_ACTIVE_STUDENTS_LABEL,
    desc: STRINGS.STAT_ACTIVE_STUDENTS_DESC,
    lightBg: '#eff6ff',
    lightBorder: '#dbeafe',
    darkBorder: '#3b82f6',
    valueColor: { light: '#1d4ed8', dark: '#60a5fa' },
  },
  {
    id: 'inactive',
    value: '86',
    label: STRINGS.STAT_INACTIVE_STUDENTS_LABEL,
    desc: STRINGS.STAT_INACTIVE_STUDENTS_DESC,
    lightBg: '#f0fdf4',
    lightBorder: '#dcfce7',
    darkBorder: '#10b981',
    valueColor: { light: '#15803d', dark: '#34d399' },
  },
  {
    id: 'modules',
    value: '34',
    label: STRINGS.STAT_ACTIVE_MODULES_LABEL,
    desc: STRINGS.STAT_ACTIVE_MODULES_DESC,
    lightBg: '#fff7ed',
    lightBorder: '#ffedd5',
    darkBorder: '#f59e0b',
    valueColor: { light: '#b45309', dark: '#fbbf24' },
  },
  {
    id: 'users',
    value: '58',
    label: STRINGS.STAT_STAFF_LABEL,
    desc: STRINGS.STAT_STAFF_DESC,
    lightBg: '#f5f3ff',
    lightBorder: '#ede9fe',
    darkBorder: '#8b5cf6',
    valueColor: { light: '#7c3aed', dark: '#a78bfa' },
  },
];

/**
 * Fetch dashboard stats.
 * Falls back to mock data when the backend endpoint is unavailable.
 */
export async function fetchDashboardStats(): Promise<StatItem[]> {
  try {
    const res = await apiRequest('/dashboard/summary');
    if (!res) return MOCK_STATS;
    return MOCK_STATS;
  } catch {
    return MOCK_STATS;
  }
}
