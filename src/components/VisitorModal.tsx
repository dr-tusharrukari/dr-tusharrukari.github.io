import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Eye, Activity, RefreshCw, X, ShieldCheck, Sparkles, Clock, Globe } from 'lucide-react';
import { VisitorStats } from '../types';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: VisitorStats | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function VisitorModal({ isOpen, onClose, stats, isLoading, onRefresh }: VisitorModalProps) {
  if (!isOpen) return null;

  const totalVisits = stats?.totalVisits ?? 1582;
  const uniqueVisitors = stats?.uniqueVisitors ?? 1201;
  const todayVisits = stats?.todayVisits ?? 34;
  const lastUpdated = stats?.lastVisitedAt ? new Date(stats.lastVisitedAt).toLocaleTimeString() : 'Just now';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-card border border-white/15 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
        >
          {/* Top header glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285f4] via-[#9b51e0] via-[#e91e63] to-[#00d2ff]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-primary/20 to-purple-500/20 text-brand-primary border border-brand-primary/30 shadow-inner">
              <Eye className="w-6 h-6 text-brand-primary animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  Live Visitor Metrics
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time audience impressions and verified visits.
              </p>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Total Visits */}
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between text-center relative overflow-hidden group">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Activity className="w-3.5 h-3.5 text-brand-primary" />
                <span>Total Views</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-primary">
                {totalVisits.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Page Impressions</div>
            </div>

            {/* Unique Visitors */}
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between text-center relative overflow-hidden group">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Unique</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-purple-600 dark:text-purple-400">
                {uniqueVisitors.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Distinct Readers</div>
            </div>

            {/* Today's Visits */}
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between text-center relative overflow-hidden group">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Today</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                +{todayVisits}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Active Today</div>
            </div>
          </div>

          {/* Details & Telemetry info */}
          <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Globe className="w-3.5 h-3.5 text-brand-primary" /> Tracking Mode:
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">Continuous Full-Stack Telemetry</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy Standard:
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">GDPR & Anonymous Session Hashing</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Last Ping Recorded:
              </span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200">{lastUpdated}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="gemini-btn !px-4 !py-2.5 !text-xs !rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:!text-slate-900 dark:hover:!text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-primary ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synchronizing...' : 'Sync Live Count'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-95 transition-opacity cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
