import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Presentation,
  Mic,
  Scale,
  Trophy,
  ShieldAlert,
  FileCheck,
  Building2,
  BookmarkCheck,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EngagementItem } from '../types';

interface EngagementsProps {
  engagements: EngagementItem[];
}

export default function Engagements({ engagements = [] }: EngagementsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interactive statistics computations
  const stats = useMemo(() => {
    const counts = {
      representation: 0,
      workshop_fdp: 0,
      expert_talk: 0,
      evaluator_judge: 0,
      felicitation: 0,
      governance: 0,
      certificate: 0
    };

    engagements.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [engagements]);

  // Tab definitions
  const tabs = [
    { id: 'All', label: 'All Activities', icon: Sparkles, color: 'text-brand-primary' },
    { id: 'representation', label: 'Conferences/Presentations', icon: Presentation, count: stats.representation, color: 'text-indigo-400' },
    { id: 'workshop_fdp', label: 'FDPs & Workshops', icon: GraduationCap, count: stats.workshop_fdp, color: 'text-purple-400' },
    { id: 'expert_talk', label: 'Expert Lectures', icon: Mic, count: stats.expert_talk, color: 'text-pink-400' },
    { id: 'evaluator_judge', label: 'Evaluations & Juries', icon: Scale, count: stats.evaluator_judge, color: 'text-emerald-400' },
    { id: 'felicitation', label: 'Felicitations & Awards', icon: Trophy, count: stats.felicitation, color: 'text-amber-400' },
    { id: 'governance', label: 'Univ Governance', icon: ShieldAlert, count: stats.governance, color: 'text-cyan-400' },
    { id: 'certificate', label: 'Certifications', icon: FileCheck, count: stats.certificate, color: 'text-rose-400' }
  ];

  // Filter and search logic
  const filteredEngagements = useMemo(() => {
    // Helper to assign chronological weight to custom date strings for reverse sorting (latest first)
    const getChronologicalWeight = (dateStr: string): number => {
      if (!dateStr) return 0;
      const lower = dateStr.toLowerCase();

      // Check for ongoing/present/current (including peer review, since it indicates an ongoing active role)
      const isOngoing = lower.includes('present') || lower.includes('ongoing') || lower.includes('reviewed');

      // Extract all 4-digit numbers as years
      const years = dateStr.match(/\b\d{4}\b/g);
      let startYear = 0;
      let endYear = 0;

      if (years && years.length > 0) {
        startYear = parseInt(years[0], 10);
        endYear = parseInt(years[years.length - 1], 10);
      }

      // Set endYear to very high number if ongoing
      let effectiveEndYear = isOngoing ? 9999 : endYear;
      if (!effectiveEndYear) {
        effectiveEndYear = isOngoing ? 9999 : 0;
      }

      // Month mapping to break ties
      const months = [
        { name: 'december', short: 'dec', val: 12 },
        { name: 'november', short: 'nov', val: 11 },
        { name: 'october', short: 'oct', val: 10 },
        { name: 'september', short: 'sep', val: 9 },
        { name: 'august', short: 'aug', val: 8 },
        { name: 'july', short: 'jul', val: 7 },
        { name: 'june', short: 'jun', val: 6 },
        { name: 'may', short: 'may', val: 5 },
        { name: 'april', short: 'apr', val: 4 },
        { name: 'march', short: 'mar', val: 3 },
        { name: 'february', short: 'feb', val: 2 },
        { name: 'january', short: 'jan', val: 1 }
      ];

      let monthVal = 0;
      for (const m of months) {
        if (lower.includes(m.name) || lower.includes(m.short)) {
          monthVal = m.val;
          break;
        }
      }

      // Day mapping to break ties
      const dayMatch = dateStr.match(/\b\d{1,2}\b/g);
      let dayVal = 1;
      if (dayMatch && dayMatch.length > 0) {
        const validDays = dayMatch
          .map(d => parseInt(d, 10))
          .filter(d => d >= 1 && d <= 31);
        if (validDays.length > 0) {
          dayVal = validDays[validDays.length - 1]; // take the latest day of range
        }
      }

      // Weight formula
      return effectiveEndYear * 10000 + monthVal * 100 + dayVal;
    };

    const term = (searchTerm || '').trim().toLowerCase();

    return engagements
      .filter((item) => {
        if (!item) return false;
        const matchesSearch =
          !term ||
          (item.title && item.title.toLowerCase().includes(term)) ||
          (item.organizer && item.organizer.toLowerCase().includes(term)) ||
          (item.role && item.role.toLowerCase().includes(term)) ||
          (item.location && item.location.toLowerCase().includes(term)) ||
          (item.description && item.description.toLowerCase().includes(term));

        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => getChronologicalWeight(b.date || '') - getChronologicalWeight(a.date || ''));
  }, [engagements, searchTerm, selectedCategory]);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'representation':
        return 'glass-badge-purple';
      case 'workshop_fdp':
        return 'glass-badge-emerald';
      case 'expert_talk':
        return 'glass-badge-purple';
      case 'evaluator_judge':
        return 'glass-badge-emerald';
      case 'felicitation':
        return 'glass-badge-amber';
      case 'governance':
        return 'glass-badge';
      case 'certificate':
        return 'glass-badge-amber';
      default:
        return 'glass-badge';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'representation':
        return <Presentation className="w-4 h-4" />;
      case 'workshop_fdp':
        return <GraduationCap className="w-4 h-4" />;
      case 'expert_talk':
        return <Mic className="w-4 h-4" />;
      case 'evaluator_judge':
        return <Scale className="w-4 h-4" />;
      case 'felicitation':
        return <Trophy className="w-4 h-4" />;
      case 'governance':
        return <ShieldAlert className="w-4 h-4" />;
      case 'certificate':
        return <FileCheck className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'representation':
        return 'Conference Presentation';
      case 'workshop_fdp':
        return 'FDP & Workshop';
      case 'expert_talk':
        return 'Invited / Expert Talk';
      case 'evaluator_judge':
        return 'Jury & Evaluation';
      case 'felicitation':
        return 'Felicitation & Recognition';
      case 'governance':
        return 'University Governance';
      case 'certificate':
        return 'Certificate Course';
      default:
        return 'Academic Activity';
    }
  };

  return (
    <section id="engagements" className="py-8 relative animate-fade-in">
      {/* Decorative ambient glowing spot */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Elegant Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-primary">
              <Sparkles className="w-4 h-4" />
              <span>Professional Footprint</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Academic & Scholarly Engagements
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-2xl leading-relaxed">
              Explore Dr. Rukari's dynamic profile beyond classroom lecturing: representing research internationally, delivering state-wide professional trainings, judging national competitions, and steering university examination bodies.
            </p>
          </div>
        </div>

        {/* Premium Bento Stats Grid with Glowing Borders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-slate-200/60 dark:border-white/5">
            <div className="absolute -right-2 -bottom-2 text-indigo-500/10 group-hover:scale-110 transition-transform duration-500">
              <Presentation className="w-24 h-24" />
            </div>
            <div className="p-2.5 bg-indigo-500/10 rounded-xl w-fit mb-4">
              <Presentation className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Conference Papers</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">{stats.representation} Delivered</span>
          </div>

          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-slate-200/60 dark:border-white/5">
            <div className="absolute -right-2 -bottom-2 text-purple-500/10 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="w-24 h-24" />
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-xl w-fit mb-4">
              <GraduationCap className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider block">FDPs & Trainings</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">{stats.workshop_fdp} Completed</span>
          </div>

          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-slate-200/60 dark:border-white/5">
            <div className="absolute -right-2 -bottom-2 text-pink-500/10 group-hover:scale-110 transition-transform duration-500">
              <Mic className="w-24 h-24" />
            </div>
            <div className="p-2.5 bg-pink-500/10 rounded-xl w-fit mb-4">
              <Mic className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Expert Talks Delivered</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">{stats.expert_talk} Guest Sessions</span>
          </div>

          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-slate-200/60 dark:border-white/5">
            <div className="absolute -right-2 -bottom-2 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
              <Scale className="w-24 h-24" />
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit mb-4">
              <Scale className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Judging & Referees</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">{stats.evaluator_judge} Panels</span>
          </div>
        </div>

        {/* Search Bar Block */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search workshops, conferences, awards, governance, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none transition-all"
          />
        </div>

        {/* Sub-tab Navigation (Responsive Layout with horizontal scroll) */}
        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border-brand-primary text-brand-primary dark:text-white shadow-lg shadow-brand-primary/5'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${tab.color}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== 'All') && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-slate-600 dark:text-gray-400">
            <span>Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-2.5 py-1 rounded-md text-brand-primary font-mono">
                Category: {tabs.find(t => t.id === selectedCategory)?.label}
              </span>
            )}
            {searchTerm && (
              <span className="bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-2.5 py-1 rounded-md text-brand-accent font-mono">
                Query: "{searchTerm}"
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-brand-highlight hover:underline ml-1 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEngagements.length > 0 ? (
              filteredEngagements.map((item, idx) => (
                <motion.div
                  key={item.title + item.date + idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                  className="group relative p-6 rounded-2xl glass-card glass-card-hover transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-4 min-w-0">
                    {/* Header badge & icon - Stacks cleanly on mobile, side-by-side on desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-brand-primary group-hover:text-brand-accent transition-colors duration-300 shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                          {getCategoryTitle(item.category)}
                        </span>
                      </div>
                      <div className="self-start sm:self-auto">
                        <span className={`inline-block px-3 py-1 text-[11px] font-mono font-semibold rounded-full ${getCategoryBadgeColor(item.category)}`}>
                          {item.role}
                        </span>
                      </div>
                    </div>

                    {/* Engagement Title */}
                    <h3 className="font-display font-semibold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors duration-300 leading-snug break-words">
                      {item.title}
                    </h3>

                    {/* Institutional Organizer / Host */}
                    <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <Building2 className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed break-words">{item.organizer}</span>
                    </div>
                  </div>

                  {/* Metadata: Date and Location */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-5 border-t border-slate-200/60 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
                      <span>{item.date}</span>
                    </span>

                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16 bg-white/5 border border-white/10 rounded-2xl space-y-3"
              >
                <div className="p-3 bg-white/5 rounded-full w-fit mx-auto">
                  <Sparkles className="w-6 h-6 text-slate-500" />
                </div>
                <h4 className="font-display font-bold text-slate-900 dark:text-white">No engagements matched</h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                  We couldn't find any activities matching "{searchTerm}" under this category. Try adjusting your query or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 hover:border-brand-primary/40 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300"
                >
                  Reset search filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
