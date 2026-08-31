import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Publications from './components/Publications';
import PatentsAndBooks from './components/PatentsAndBooks';
import ExperienceAndGrants from './components/ExperienceAndGrants';
import SkillsAndServices from './components/SkillsAndServices';
import Contact from './components/Contact';
import Engagements from './components/Engagements';
import MobileBottomNav from './components/MobileBottomNav';
import { VisitorModal } from './components/VisitorModal';
import ShimmerLoader from './components/ShimmerLoader';
import portfolioData from './data/portfolioData.json';
import visitorStatsData from './data/visitorStats.json';
import { PortfolioData, VisitorStats } from './types';
import { getCachedVisitorStats, fetchSynchronizedVisitorStats, recordVisitorHitEvent } from './utils/visitorService';
import { Sparkles, MapPin, Mail, ExternalLink, Lock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isVisitorLoading, setIsVisitorLoading] = useState(false);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => {
    return getCachedVisitorStats();
  });
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // 1. Check if user manually saved an explicit theme preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // 2. Otherwise auto-detect device/browser system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark');
    }
  }, [theme]);

  // Listen for device / OS system display theme changes in real-time if no explicit user override is stored
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const hasUserOverride = localStorage.getItem('theme_user_selected');
      if (!hasUserOverride) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    localStorage.setItem('theme_user_selected', 'true');
  };

  // Synchronize and record live visitor hit in real-time
  const recordVisitorHit = useCallback(async () => {
    try {
      const stats = await recordVisitorHitEvent();
      setVisitorStats(stats);
    } catch (err) {
      console.warn('Visitor hit tracking error:', err);
    }
  }, []);

  const refreshVisitorStats = useCallback(async () => {
    setIsVisitorLoading(true);
    try {
      const stats = await fetchSynchronizedVisitorStats();
      setVisitorStats(stats);
    } catch (err) {
      console.warn('Visitor stats refresh error:', err);
    } finally {
      setTimeout(() => setIsVisitorLoading(false), 300);
    }
  }, []);

  useEffect(() => {
    // Record initial page impression
    recordVisitorHit();

    // Periodic real-time visitor count synchronization every 45 seconds
    const visitorInterval = setInterval(() => {
      fetchSynchronizedVisitorStats()
        .then((latest) => setVisitorStats(latest))
        .catch(() => {});
    }, 45000);

    // Sync on tab re-focus or visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSynchronizedVisitorStats()
          .then((latest) => setVisitorStats(latest))
          .catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fetch live portfolio data with updated citations from Google Scholar
    fetch('/api/citations')
      .then((res) => {
        if (!res.ok) throw new Error("API status not ok");
        return res.json();
      })
      .then((liveData) => {
        if (liveData && liveData.publications) {
          setData(liveData as unknown as PortfolioData);
        } else {
          setData(portfolioData as unknown as PortfolioData);
        }
      })
      .catch((err) => {
        console.warn("Live academic database sync unavailable; using cached fallback.", err);
        setData(portfolioData as unknown as PortfolioData);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      clearInterval(visitorInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [recordVisitorHit]);

  const handleExplore = () => {
    setActiveSection('publications');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContact = () => {
    setActiveSection('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-transparent text-gray-100 flex flex-col justify-between py-12">
        {/* Shimmer loading layout matching visual dashboard blocks */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex justify-between items-center h-12 border-b border-white/10 pb-4">
            <div className="h-6 w-36 gemini-loader rounded"></div>
            <div className="h-6 w-48 gemini-loader rounded hidden sm:block"></div>
          </div>
          <ShimmerLoader type="hero" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12">
            <div className="lg:col-span-7">
              <ShimmerLoader type="timeline" />
            </div>
            <div className="lg:col-span-5">
              <ShimmerLoader type="grid" />
            </div>
          </div>
        </div>
        <div className="text-center text-xs font-mono text-gray-600 mt-12 animate-pulse flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Synchronizing Dr. Rukari's Academic Database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-100 selection:bg-brand-primary/20 selection:text-white relative overflow-x-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

      {/* Dynamic Ambient Multitone Shmear (glowing spots) */}
      <div className="bg-shmear-container">
        <div className="shmear-blob shmear-1"></div>
        <div className="shmear-blob shmear-2"></div>
        <div className="shmear-blob shmear-3"></div>
        <div className="shmear-blob shmear-4"></div>
      </div>

      <Header
        personal={data.personal}
        visitorStats={visitorStats}
        onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="pt-24 pb-24 lg:pb-12 min-h-[75vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeSection === 'about' && (
              <Hero
                personal={data.personal}
                credentials={data.credentials}
                onExploreClick={handleExplore}
                onContactClick={handleContact}
              />
            )}

            {activeSection === 'experience' && (
              <ExperienceAndGrants
                experience={data.experience}
                grants={[]}
                guidance={data.researchGuidance}
                view="timeline"
              />
            )}

            {activeSection === 'grants' && (
              <ExperienceAndGrants
                experience={[]}
                grants={data.grants}
                guidance={[]}
                view="grants"
              />
            )}

            {activeSection === 'publications' && (
              <Publications publications={data.publications} personal={data.personal} />
            )}

            {activeSection === 'patents' && (
              <PatentsAndBooks patents={data.patents} books={data.books} />
            )}

            {activeSection === 'skills' && (
              <SkillsAndServices
                skills={data.skills}
                awards={data.awards}
                responsibilities={data.responsibilities}
                conferences={data.conferences}
              />
            )}

            {activeSection === 'engagements' && (
              <Engagements engagements={data.engagements || []} />
            )}

            {activeSection === 'contact' && (
              <Contact personal={data.personal} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 glass-panel py-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="font-display font-semibold text-sm text-gray-200">
                {data.personal.name}
              </span>
            </div>
            <p className="max-w-md leading-relaxed text-gray-400">
              Academic and IPR Dashboard compiled using modern offline-first structures. Designed for rapid updates and search-optimized citation listing.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col sm:flex-row sm:items-center justify-end gap-4 sm:gap-6 text-gray-400">
            {/* Live Visitor Counter Button / Badge */}
            <button
              onClick={() => setIsVisitorModalOpen(true)}
              className="gemini-btn !px-3.5 !py-2 !text-xs !rounded-xl font-mono text-slate-700 dark:text-slate-300 hover:!text-slate-900 dark:hover:!text-white flex items-center gap-2.5 transition-all duration-300 shadow-sm cursor-pointer self-start sm:self-auto"
              title="Click to view live visitor statistics"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Eye className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-slate-500 dark:text-slate-400">Live Visitors:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {visitorStats?.totalVisits ? visitorStats.totalVisits.toLocaleString() : '1,584'}
              </span>
            </button>

            <div className="flex items-center gap-1.5 text-gray-500 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Academic Portfolio</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600">
          <p>© {new Date().getFullYear()} Dr. Tushar Ganpat Rukari. All rights reserved.</p>
          <div className="flex gap-4">
            <a href={data.personal.linkedin} target="_blank" className="hover:text-gray-400 transition-colors">LinkedIn</a>
            <a href={data.personal.googleScholar} target="_blank" className="hover:text-gray-400 transition-colors">Scholar</a>
            <a href={data.personal.orcid} target="_blank" className="hover:text-gray-400 transition-colors">ORCID</a>
            <a href={data.personal.scopus} target="_blank" className="hover:text-gray-400 transition-colors">Scopus</a>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Bottom Navigation */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={(s) => setActiveSection(s)}
        onOpenFullMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* MODALS */}
      <VisitorModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        stats={visitorStats}
        isLoading={isVisitorLoading}
        onRefresh={refreshVisitorStats}
      />
    </div>
  );
}
