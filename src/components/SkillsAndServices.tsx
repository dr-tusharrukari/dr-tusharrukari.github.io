import React from 'react';
import { Settings, Award, Layers, ShieldAlert, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { SkillCategory, AwardItem, ResponsibilityItem, ConferenceItem } from '../types';

interface SkillsAndServicesProps {
  skills: SkillCategory[];
  awards: AwardItem[];
  responsibilities: ResponsibilityItem[];
  conferences?: ConferenceItem[];
}

export default function SkillsAndServices({ skills, awards, responsibilities, conferences }: SkillsAndServicesProps) {
  return (
    <section id="skills" className="py-8 relative animate-fade-in">
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-accent/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout: Grid for Skills and Responsibilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* SKILLS BOX (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-primary">
                <Settings className="w-4 h-4" />
                <span>Competencies</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                Technical Skills & Expertise
              </h2>
              <p className="text-gray-400 text-sm">
                A scientific toolbox focusing on specialized pharmaceutics delivery methods, laboratory diagnostics instrumentation, and academic modeling software.
              </p>
            </div>

            {/* Categorized Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((category, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl glass-card glass-card-hover space-y-4 transition-all duration-300"
                >
                  <h3 className="font-display font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-white/10 pb-2">
                    {category.category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESPONSIBILITIES BOX (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-accent">
                <Layers className="w-4 h-4" />
                <span>Leadership</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                Roles & Leadership
              </h2>
              <p className="text-gray-400 text-sm">
                Administrative roles held in the college innovation councils, accreditation workflows, and departmental steering committees.
              </p>
            </div>

            <div className="space-y-4">
              {responsibilities.map((resp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl glass-card glass-card-hover space-y-2 transition-all duration-300"
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-display font-semibold text-sm text-white leading-snug">
                      {resp.title}
                    </h4>
                    <span className="text-[10px] font-mono text-brand-accent px-2 py-0.5 rounded glass-badge-purple shrink-0">
                      {resp.duration}
                    </span>
                  </div>
                  <p className="text-xs text-brand-primary font-medium">{resp.organization}</p>
                  <p className="text-xs text-gray-400 leading-relaxed pt-1">
                    {resp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AWARDS & RECOGNITIONS ROW (Full-width grid) */}
        <div className="pt-16 border-t border-white/10 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-highlight">
              <Award className="w-4 h-4" />
              <span>Honorary Milestones</span>
            </div>
            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Awards & Achievements
            </h2>
            <p className="text-gray-400 text-sm max-w-xl">
              Honorable recognitions received from international forums, pharmaceutical education societies, and institutional trust boards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card glass-card-hover flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
              >
                {/* corner highlight aura */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-highlight/5 rounded-full blur-xl group-hover:bg-brand-highlight/10 transition-colors pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="p-2.5 rounded-xl glass-badge shrink-0 text-brand-highlight">
                      <Award className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded glass-badge-purple">
                      {award.year}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-brand-highlight transition-colors leading-snug">
                      {award.title}
                    </h3>
                    <p className="text-xs text-brand-accent font-medium">{award.agency}</p>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONFERENCES & SEMINARS ROW (Full-width grid) */}
        {conferences && conferences.length > 0 && (
          <div className="pt-16 border-t border-white/10 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-primary">
                <Compass className="w-4 h-4" />
                <span>Scholarly Interactions</span>
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                Conferences & Expert Talks
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                Invited expert lectures delivered, organizing chair roles held, and seminar participations at leading pharmaceutical forums.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conferences.map((conf, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-card glass-card-hover flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl group-hover:bg-brand-primary/10 transition-colors pointer-events-none"></div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded glass-badge text-brand-primary">
                        {conf.role}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded glass-badge-purple">
                        {conf.year}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-sm text-white group-hover:text-brand-primary transition-colors leading-snug">
                        {conf.title}
                      </h3>
                      <p className="text-xs text-brand-accent font-medium">{conf.organizer} • {conf.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
