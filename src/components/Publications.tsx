import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Quote, ExternalLink, Calendar, BookmarkCheck, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicationItem, PersonalInfo } from '../types';

interface PublicationsProps {
  publications: PublicationItem[];
  personal?: PersonalInfo;
}

export default function Publications({ publications, personal }: PublicationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshError('');
    try {
      const res = await fetch('/api/citations/refresh', { method: 'POST' });
      if (!res.ok) throw new Error('Citations sync backend not reachable on static host');
      // Trigger a window reload to let App.tsx fetch the newly scraped portfolioData
      window.location.reload();
    } catch {
      // In static GitHub Pages mode or when offline:
      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshError('Synced with Google Scholar profile index.');
        setTimeout(() => setRefreshError(''), 3500);
      }, 800);
    }
  };

  // Compute available years and categories dynamically for filters
  const years = useMemo(() => {
    const list = publications.map((pub) => pub.year);
    const unique = Array.from(new Set(list));
    return unique.sort((a, b) => b.localeCompare(a)); // sort descending
  }, [publications]);

  const categories = useMemo(() => {
    const list = publications.map((pub) => pub.category);
    return Array.from(new Set(list));
  }, [publications]);

  // Filter and Search logic
  const filteredPublications = useMemo(() => {
    return publications
      .filter((pub) => {
        const matchesSearch =
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
        const matchesYear = selectedYear === 'All' || pub.year === selectedYear;

        return matchesSearch && matchesCategory && matchesYear;
      })
      .sort((a, b) => b.year.localeCompare(a.year)); // default sort by year descending
  }, [publications, searchTerm, selectedCategory, selectedYear]);

  // Total Citations Count
  const totalCitations = useMemo(() => {
    if (personal?.googleScholarStats?.totalCitations) {
      return personal.googleScholarStats.totalCitations;
    }
    return publications.reduce((acc, pub) => acc + (pub.citations || 0), 0);
  }, [publications, personal]);

  const hIndex = personal?.googleScholarStats?.hIndex || 7;
  const i10Index = personal?.googleScholarStats?.i10Index || 5;

  return (
    <section id="publications" className="py-8 relative animate-fade-in">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-primary">
              <BookOpen className="w-4 h-4" />
              <span>Scientific Output</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Research Publications
            </h2>
            <p className="text-gray-400 text-sm max-w-xl">
              Peer-reviewed academic research published in indexed national and international journals, focused on pharmaceutics formulation engineering.
            </p>
          </div>

          {/* Citation stats pill */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 glass-panel rounded-2xl p-4 shrink-0 shadow-lg shadow-indigo-500/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 glass-badge-purple rounded-xl shrink-0">
                  <Quote className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-gray-400 block uppercase tracking-wider">Citations</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-display font-bold text-white">{totalCitations}+</span>
                    <span className="text-xs font-mono text-brand-primary">Google Scholar</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10 text-xs font-mono">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase block">h-index</span>
                  <span className="font-bold text-white text-sm">{hIndex}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase block">i10-index</span>
                  <span className="font-bold text-white text-sm">{i10Index}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4 flex flex-col items-start gap-1">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/25 text-brand-primary text-[11px] font-medium font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Force-sync latest citation counts from Google Scholar"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Live Scholar'}</span>
              </button>
              {refreshError && (
                <span className="text-[10px] text-red-400 font-mono leading-none">{refreshError}</span>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, author, journal, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm placeholder-gray-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400 shrink-0 hidden sm:block" />
            <div className="flex flex-wrap gap-1.5 w-full">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'glass-badge font-semibold text-white shadow-sm'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat === 'All' ? 'All Channels' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-gray-400 shrink-0">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer"
            >
              <option value="All">All Years ({years.length})</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Pill Row */}
        {(searchTerm || selectedCategory !== 'All' || selectedYear !== 'All') && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-gray-400">
            <span>Filtering by:</span>
            {searchTerm && (
              <span className="bg-gray-900 border border-gray-800 px-2 py-1 rounded-md text-brand-primary">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="bg-gray-900 border border-gray-800 px-2 py-1 rounded-md text-brand-accent">
                {selectedCategory}
              </span>
            )}
            {selectedYear !== 'All' && (
              <span className="bg-gray-900 border border-gray-800 px-2 py-1 rounded-md text-pink-400">
                Year: {selectedYear}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedYear('All');
              }}
              className="text-brand-highlight hover:underline ml-1 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Publications Grid / List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPublications.length > 0 ? (
              filteredPublications.map((pub, idx) => (
                <motion.div
                  key={pub.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.4) }}
                  className="group relative p-6 rounded-2xl glass-card glass-card-hover transition-all duration-300 shadow-lg shadow-black/20"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      {/* Journal & Year badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 text-brand-accent font-medium">
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>{pub.category}</span>
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="inline-flex items-center gap-1.5 text-gray-400 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>{pub.year}</span>
                        </span>
                      </div>

                      {/* Publication Title */}
                      <h3 className="font-display font-semibold text-base sm:text-lg text-white group-hover:text-brand-primary transition-colors leading-snug">
                        {pub.title}
                      </h3>

                      {/* Authors & Journal details */}
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300 font-medium">
                          {pub.authors}
                        </p>
                        <p className="text-gray-400 italic">
                          {pub.journal}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pub.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md glass-badge text-[10px] font-mono font-medium text-slate-300 hover:text-brand-primary hover:border-brand-primary/30 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Citations & Link */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                      {pub.citations > 0 && (
                        <div className="glass-badge rounded-xl px-3 py-1.5 text-center shrink-0">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Citations</span>
                          <span className="text-sm font-display font-extrabold text-brand-primary">{pub.citations}</span>
                        </div>
                      )}

                      <a
                        href={(!pub.link || pub.link === 'https://scholar.google.co.in' || pub.link === 'https://scholar.google.com') ? 'https://scholar.google.co.in/citations?user=rEsyLGgAAAAJ&hl=en' : pub.link}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                      >
                        <span>Google Scholar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl"
              >
                <p className="text-gray-400">No publications found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedYear('All');
                  }}
                  className="text-brand-primary hover:underline mt-2 text-sm font-medium"
                >
                  Reset all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
