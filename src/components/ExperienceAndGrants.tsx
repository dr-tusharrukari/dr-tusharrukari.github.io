import React from 'react';
import { Briefcase, FolderKanban, Users, TrendingUp } from 'lucide-react';
import { ExperienceItem, GrantItem, ResearchGuidanceItem } from '../types';

interface ExperienceAndGrantsProps {
  experience: ExperienceItem[];
  grants: GrantItem[];
  guidance: ResearchGuidanceItem[];
  view?: 'timeline' | 'grants';
}

export default function ExperienceAndGrants({ experience, grants, guidance, view = 'timeline' }: ExperienceAndGrantsProps) {
  const sortedGrants = React.useMemo(() => {
    return [...grants].sort((a, b) => b.year.localeCompare(a.year));
  }, [grants]);

  const sortedExperience = React.useMemo(() => {
    return [...experience].sort((a, b) => {
      const getYear = (dur: string) => {
        const match = dur.match(/\b\d{4}\b/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getYear(b.duration) - getYear(a.duration);
    });
  }, [experience]);

  if (view === 'grants') {
    return (
      <section id="grants" className="py-8 relative animate-fade-in">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-accent/5 rounded-full blur-[110px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-accent px-3 py-1 rounded-full bg-brand-accent/5 border border-brand-accent/10">
              <FolderKanban className="w-4 h-4" />
              <span>Research Backing</span>
            </div>
            <h2 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Grants & Funding
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm">
              Sponsored research projects and laboratory infrastructure funding backed by public and private councils.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGrants.map((grant, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card glass-card-hover space-y-5 shadow-lg border border-slate-200/50 dark:border-white/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                      grant.status === 'Ongoing'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {grant.status}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">AMOUNT</span>
                      <strong className="text-brand-primary text-sm font-display font-bold">{grant.amount}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {grant.title}
                    </h4>
                    <p className="text-xs text-brand-accent font-semibold">{grant.fundingAgency} • {grant.year}</p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                    {grant.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Otherwise show Timeline & Research Guidance (which are perfectly correlated)
  return (
    <section id="experience" className="py-8 relative animate-fade-in">
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Experience Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-primary px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10">
                <Briefcase className="w-4 h-4" />
                <span>Career Progression</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                Academic Experience
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                A 15-year career progression spanning pharmaceutics leadership, university education, laboratory management, and IPR development.
              </p>
            </div>

            {/* Vertical Timeline UI */}
            <div className="relative border-l border-slate-200 dark:border-gray-800 pl-6 sm:pl-8 ml-3 space-y-10">
              {sortedExperience.map((exp, index) => (
                <div key={index} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-brand-primary bg-[#030712] flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary transition-all duration-300 shadow-sm shadow-brand-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md glass-badge w-fit">
                        {exp.duration}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-gray-500 font-medium italic">
                        {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)} Assignment
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-brand-accent font-medium">
                        {exp.institution}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Research Guidance (5 cols) */}
          <div className="lg:col-span-5 space-y-12">
            {/* Research Guidance highlights */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-highlight px-3 py-1 rounded-full bg-brand-highlight/5 border border-brand-highlight/10">
                  <Users className="w-4 h-4" />
                  <span>Scholarly Mentoring</span>
                </div>
                <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">
                  Research Guidance
                </h3>
              </div>

              <div className="space-y-4">
                {guidance.map((guid, idx) => (
                  <div
                    key={idx}
                    className="relative p-5 rounded-2xl glass-card glass-card-hover overflow-hidden transition-all duration-300 border border-slate-200/50 dark:border-white/5"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-white/5 shrink-0 text-brand-highlight">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                          {guid.level} ({guid.count} Projects Guided)
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                          {guid.description}
                        </p>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 italic">
                          <strong className="text-brand-primary not-italic block uppercase text-[9px] font-mono tracking-widest mb-1">Key Accomplishment</strong>
                          "{guid.highlights}"
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
