import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Sun, Moon, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalInfo, VisitorStats } from '../types';

interface HeaderProps {
  personal: PersonalInfo;
  visitorStats?: VisitorStats | null;
  onOpenVisitorModal?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export default function Header({
  personal,
  visitorStats,
  onOpenVisitorModal,
  theme,
  onToggleTheme,
  activeSection,
  setActiveSection,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: HeaderProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isMobileMenuOpen !== undefined ? isMobileMenuOpen : internalIsOpen;
  const setIsOpen = setIsMobileMenuOpen || setInternalIsOpen;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Timeline' },
    { id: 'publications', label: 'Publications' },
    { id: 'patents', label: 'Patents & Authored Books' },
    { id: 'grants', label: 'Grants' },
    { id: 'skills', label: 'Expertise' },
    { id: 'engagements', label: 'Engagements' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    setActiveSection(id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel border-b border-white/10 shadow-lg shadow-indigo-500/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-4 xl:gap-6 h-20">
          {/* Logo Brand */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/10 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-brand-primary to-brand-accent rounded-xl blur-sm opacity-30 -z-10 animate-pulse"></div>
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight whitespace-nowrap bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-slate-400 from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                {personal.name}
              </span>
              <p className="text-[10px] font-mono tracking-wider text-brand-primary uppercase whitespace-nowrap">
                Academic Dashboard
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`gemini-nav-btn px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 relative cursor-pointer hover:scale-[1.03] active:scale-95 whitespace-nowrap ${
                  activeSection === item.id
                    ? 'active text-brand-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Medium screen compact nav (1024px - 1280px) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-0.5 shrink-0">
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  activeSection === item.id
                    ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setIsOpen(true)}
              className="px-2 py-1 rounded-lg text-xs font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors"
            >
              More...
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Live Visitor Count Button */}
            <button
              onClick={onOpenVisitorModal}
              className="gemini-btn !px-3 !py-1.5 !text-xs !rounded-lg font-mono text-slate-700 dark:text-slate-300 hover:!text-slate-900 dark:hover:!text-white hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
              title="Live Academic Visitor Analytics - Click for full stats"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Eye className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {visitorStats?.totalVisits ? visitorStats.totalVisits.toLocaleString() : '1,584'}
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:scale-105"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-primary" />}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-1.5 shrink-0">
            {/* Live Visitor Mobile Badge */}
            <button
              onClick={onOpenVisitorModal}
              className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-1.5"
              title="Live Visitors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <Eye className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-semibold text-xs">
                {visitorStats?.totalVisits ? visitorStats.totalVisits.toLocaleString() : '1,584'}
              </span>
            </button>

            {/* Theme Toggle Button Mobile */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-lg transition-all duration-300 shrink-0"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-primary" />}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600/20 focus:outline-none transition-all duration-300 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-b border-slate-200 dark:border-white/10 glass-panel backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-indigo-600 dark:text-white border-l-2 border-brand-primary pl-3'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2.5 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenVisitorModal && onOpenVisitorModal();
                  }}
                  className="w-full gemini-btn !px-4 !py-2.5 !text-xs font-mono text-slate-700 dark:text-slate-200 hover:!text-slate-900 dark:hover:!text-white flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Eye className="w-4 h-4 text-brand-primary" />
                    <span>Live Visitor Analytics</span>
                  </div>
                  <span className="font-semibold text-brand-primary dark:text-indigo-300">
                    {visitorStats?.totalVisits ? visitorStats.totalVisits.toLocaleString() : '1,582'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
