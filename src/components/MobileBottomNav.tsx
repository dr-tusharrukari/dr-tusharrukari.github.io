import React from 'react';
import { User, Clock, BookOpen, Award, Mail, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  onOpenFullMenu: () => void;
}

export default function MobileBottomNav({
  activeSection,
  onSelectSection,
  onOpenFullMenu
}: MobileBottomNavProps) {
  const quickTabs = [
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Timeline', icon: Clock },
    { id: 'publications', label: 'Pubs', icon: BookOpen },
    { id: 'patents', label: 'Patents', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto max-w-md w-full glass-panel bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/40 px-2 py-1.5 flex items-center justify-around">
        {quickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectSection(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer min-w-[52px] ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileBottomActive"
                  className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-accent rounded-xl -z-10 shadow-md shadow-brand-primary/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More / All sections button */}
        <button
          onClick={onOpenFullMenu}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer min-w-[52px]"
          title="All Sections"
        >
          <Menu className="w-4 h-4 mb-0.5 text-slate-400" />
          <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
            All
          </span>
        </button>
      </nav>
    </div>
  );
}
