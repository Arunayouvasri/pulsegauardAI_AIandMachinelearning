import { HealthInput } from "./health-utils";

let _healthData: HealthInput | null = null;
const _listeners = new Set<() => void>();

export function setHealthData(data: HealthInput) {
  _healthData = data;
  // Store in localStorage for persistence
  localStorage.setItem("pulseguard_health_data", JSON.stringify(data));
  _listeners.forEach((fn) => fn());
}

export function getHealthData(): HealthInput | null {
  if (_healthData) return _healthData;
  const stored = localStorage.getItem("pulseguard_health_data");
  if (stored) {
    _healthData = JSON.parse(stored);
    return _healthData;
  }
  return null;
}

export function addProgressEntry(data: HealthInput) {
  const history = getProgressHistory();
  history.push({ ...data, date: new Date().toISOString() });
  localStorage.setItem("pulseguard_progress", JSON.stringify(history.slice(-30)));
}

export function getProgressHistory(): (HealthInput & { date: string })[] {
  const stored = localStorage.getItem("pulseguard_progress");
  return stored ? JSON.parse(stored) : [];
}

export function useHealthData(): HealthInput | null {
  // This is a simple hook that reads from localStorage
  return getHealthData();
}
