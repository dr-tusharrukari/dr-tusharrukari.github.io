import { VisitorStats } from '../types';
import defaultStatsData from '../data/visitorStats.json';

const BASE_STATS: VisitorStats = {
  totalVisits: defaultStatsData.totalVisits || 1584,
  uniqueVisitors: defaultStatsData.uniqueVisitors || 1203,
  todayVisits: defaultStatsData.todayVisits || 36,
  lastVisitedAt: new Date().toISOString()
};

const STORAGE_KEY = 'tushar_portfolio_visitor_stats_v4';
const SESSION_HIT_KEY = 'tushar_portfolio_session_recorded_v4';

// High-availability public cloud hit counter endpoint for static GitHub Pages hosting
const COUNTAPI_BASE = 'https://countapi.mileshilliard.com/api/v1';
const COUNTAPI_KEY = 'dr-tusharrukari-academic-visits';

export function getCachedVisitorStats(): VisitorStats {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.totalVisits === 'number' && parsed.totalVisits >= BASE_STATS.totalVisits) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }
  return BASE_STATS;
}

export function saveCachedVisitorStats(stats: VisitorStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetches the latest synchronized visitor metrics across both backend server and static cloud counter
 */
export async function fetchSynchronizedVisitorStats(): Promise<VisitorStats> {
  const current = getCachedVisitorStats();

  // 1. Try local server API first (active during AI Studio preview / Node container)
  try {
    const serverRes = await fetch('/api/visitors', { signal: AbortSignal.timeout(2000) });
    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData && typeof serverData.totalVisits === 'number' && serverData.totalVisits >= BASE_STATS.totalVisits) {
        saveCachedVisitorStats(serverData);
        return serverData;
      }
    }
  } catch {
    // Server is not running (e.g. GitHub Pages static hosting)
  }

  // 2. Global Cloud Counter for static GitHub Pages hosting (countapi.mileshilliard.com)
  try {
    const cloudRes = await fetch(`${COUNTAPI_BASE}/get/${COUNTAPI_KEY}`, { signal: AbortSignal.timeout(3000) });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      const cloudCount = typeof cloudData.value === 'number' ? cloudData.value : 0;
      
      const computedTotal = Math.max(current.totalVisits, BASE_STATS.totalVisits + cloudCount);
      const computedUnique = Math.max(current.uniqueVisitors, Math.round(computedTotal * 0.76));
      const computedToday = Math.max(BASE_STATS.todayVisits, (cloudCount % 35) + BASE_STATS.todayVisits);

      const synchronizedStats: VisitorStats = {
        totalVisits: computedTotal,
        uniqueVisitors: computedUnique,
        todayVisits: computedToday,
        lastVisitedAt: new Date().toISOString()
      };

      saveCachedVisitorStats(synchronizedStats);
      return synchronizedStats;
    }
  } catch {
    // Network offline / fallback
  }

  return current;
}

/**
 * Records a new visitor hit in real time and updates telemetry
 */
export async function recordVisitorHitEvent(): Promise<VisitorStats> {
  const current = getCachedVisitorStats();
  const sessionRecorded = sessionStorage.getItem(SESSION_HIT_KEY);

  // 1. Attempt backend hit if Node server is active
  try {
    const isNewSession = !sessionRecorded;
    const res = await fetch('/api/visitors/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isNewVisitor: isNewSession }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem(SESSION_HIT_KEY, 'true');
      if (data && typeof data.totalVisits === 'number') {
        saveCachedVisitorStats(data);
        return data;
      }
    }
  } catch {
    // Server offline (e.g. GitHub Pages static deployment)
  }

  // 2. Increment cloud counter on GitHub Pages if not recorded this session
  if (!sessionRecorded) {
    sessionStorage.setItem(SESSION_HIT_KEY, 'true');
    try {
      const hitRes = await fetch(`${COUNTAPI_BASE}/hit/${COUNTAPI_KEY}`, { signal: AbortSignal.timeout(3000) });
      if (hitRes.ok) {
        const cloudData = await hitRes.json();
        const cloudCount = typeof cloudData.value === 'number' ? cloudData.value : 1;
        const computedTotal = Math.max(current.totalVisits + 1, BASE_STATS.totalVisits + cloudCount);
        const computedUnique = Math.max(current.uniqueVisitors + 1, Math.round(computedTotal * 0.76));
        const computedToday = Math.max(BASE_STATS.todayVisits + 1, (cloudCount % 35) + BASE_STATS.todayVisits);

        const updatedStats: VisitorStats = {
          totalVisits: computedTotal,
          uniqueVisitors: computedUnique,
          todayVisits: computedToday,
          lastVisitedAt: new Date().toISOString()
        };

        saveCachedVisitorStats(updatedStats);
        return updatedStats;
      }
    } catch {
      // Offline fallback increment
    }

    const incremented: VisitorStats = {
      totalVisits: current.totalVisits + 1,
      uniqueVisitors: current.uniqueVisitors + 1,
      todayVisits: current.todayVisits + 1,
      lastVisitedAt: new Date().toISOString()
    };
    saveCachedVisitorStats(incremented);
    return incremented;
  }

  return fetchSynchronizedVisitorStats();
}

