import React, { useState } from 'react';
import { 
  Award, 
  GraduationCap, 
  MapPin, 
  Milestone, 
  BookOpen, 
  Users, 
  FolderCheck, 
  ArrowDownRight, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { PersonalInfo, AcademicCredential } from '../types';

interface HeroProps {
  personal: PersonalInfo;
  credentials: AcademicCredential[];
  onExploreClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ personal, credentials, onExploreClick, onContactClick }: HeroProps) {
  const candidateUrls = React.useMemo(() => {
    const custom = localStorage.getItem('profile_photo_url');
    const list: string[] = [];
    if (custom) list.push(custom);
    if (personal.profileImage) list.push(personal.profileImage);
    list.push(
      './profile.jpg',
      './books/profile.jpg',
      '/profile.jpg',
      '/books/profile.jpg',
      'https://raw.githubusercontent.com/dr-tusharrukari/dr-tusharrukari/main/public/books/profile.jpg',
      'https://raw.githubusercontent.com/dr-tusharrukari/dr-tusharrukari/main/public/profile.jpg'
    );
    return Array.from(new Set(list));
  }, [personal.profileImage]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imgLoadFailed, setImgLoadFailed] = useState(false);

  const photo = candidateUrls[candidateIndex] || '';

  const handleImageError = () => {
    if (candidateIndex + 1 < candidateUrls.length) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setImgLoadFailed(true);
    }
  };
  // Stat items with premium indigo/purple/pink/emerald/cyan aesthetic
  const stats = [
    {
      label: 'Teaching Experience',
      value: `${personal.experienceYears}+ Yrs`,
      icon: Milestone,
      color: 'from-blue-500/20 to-indigo-500/10',
      textColor: 'text-blue-400',
    },
    {
      label: 'Research Publications',
      value: `${personal.publicationsCount}+`,
      icon: BookOpen,
      color: 'from-violet-500/20 to-purple-500/10',
      textColor: 'text-violet-400',
    },
    {
      label: 'Patents Filed/Granted',
      value: `${personal.patentsCount}`,
      icon: Award,
      color: 'from-pink-500/20 to-fuchsia-500/10',
      textColor: 'text-pink-400',
    },
    {
      label: 'Guided UG Projects',
      value: `${personal.guidedUG}+ Group`,
      icon: Users,
      color: 'from-cyan-500/20 to-teal-500/10',
      textColor: 'text-cyan-400',
    },
    {
      label: 'Research Grants',
      value: personal.grantsAmount,
      icon: FolderCheck,
      color: 'from-emerald-500/20 to-green-500/10',
      textColor: 'text-emerald-400',
    },
  ];

  const handleScrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="relative pt-32 pb-20 md:py-36 overflow-hidden">
      {/* Abstract Glowing Aura Orbs (Gemini Inspired) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-primary/10 blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-brand-accent/15 blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Profile Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
              
              {/* Profile Photo Container */}
              <div className="relative group shrink-0 gemini-profile-glow">
                <div 
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900/40 dark:bg-slate-950/40 border border-brand-accent/20 shadow-xl transition-all duration-500"
                >
                  {photo && !imgLoadFailed ? (
                    <img 
                      src={photo} 
                      alt={personal.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4">
                      {/* Futuristic/Cosmic Academic Icon Placeholder */}
                      <svg className="w-12 h-12 text-brand-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Badge block */}
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-badge text-xs font-mono font-medium">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                  </span>
                  <span>Active Research Portfolio</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-none">
                  {personal.name}
                </h1>
                <p className="text-xl sm:text-2xl font-medium bg-gradient-to-r dark:from-indigo-200 dark:via-purple-200 dark:to-pink-200 from-indigo-900 via-purple-800 to-indigo-950 bg-clip-text text-transparent">
                  {personal.title}
                </p>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>{personal.institution}, {personal.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed max-w-2xl">
              <p className="text-lg">{personal.bio}</p>
              <div className="border-l-2 border-brand-accent/40 pl-4 py-1 italic text-gray-400 text-sm">
                "{personal.aboutStatement}"
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="gemini-btn group relative inline-flex items-center gap-2 px-6 py-3.5 cursor-pointer"
              >
                <span>View Publications</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onContactClick}
                className="gemini-btn px-6 py-3.5 cursor-pointer"
              >
                <span>Get in Touch</span>
              </button>
            </div>
          </div>

          {/* Academic Credentials Box (Right Column) */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl overflow-hidden gemini-border-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl glass-badge-purple shrink-0">
                  <GraduationCap className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">Academic Qualifications</h3>
                  <p className="text-xs font-mono text-gray-400">Credentials Summary</p>
                </div>
              </div>

              <div className="space-y-6">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {/* timeline connector dot */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shadow-sm shadow-brand-accent"></div>
                      {idx !== credentials.length - 1 && (
                        <div className="w-[1px] h-full bg-white/10 mt-2"></div>
                      )}
                    </div>
                    
                    <div className="space-y-1 pb-4">
                      <span className="inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded-md glass-badge-purple">
                        {cred.year}
                      </span>
                      <h4 className="font-medium text-sm text-gray-200">{cred.degree}</h4>
                      <p className="text-xs text-brand-primary font-medium">{cred.field}</p>
                      <p className="text-xs text-gray-400">{cred.institution}</p>
                      {cred.details && (
                        <p className="text-xs text-gray-500 italic mt-1 leading-relaxed">{cred.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bento-style Glow Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative group p-5 rounded-2xl glass-card glass-card-hover overflow-hidden transition-all duration-300 ${
                  index === 4 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                {/* Micro hover shadow glow */}
                <div className={`absolute -inset-2 bg-gradient-to-tr ${stat.color} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-mono text-gray-400 font-medium">{stat.label}</span>
                  <div className={`p-2 rounded-lg bg-gray-900 border border-gray-800 ${stat.textColor || 'text-brand-primary'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                    <span>Verified</span>
                    <span className="text-brand-primary">●</span>
                    <span>Database</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
