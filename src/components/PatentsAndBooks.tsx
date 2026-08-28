import React, { useState } from 'react';
import { 
  Award, 
  BookOpenCheck, 
  Calendar, 
  ShieldCheck, 
  Scale, 
  FileSpreadsheet, 
  User, 
  Info, 
  FileText, 
  ExternalLink, 
  Maximize2, 
  X, 
  Sparkles, 
  BookOpen
} from 'lucide-react';
import { PatentItem, BookItem } from '../types';

interface PatentsAndBooksProps {
  patents: PatentItem[];
  books: BookItem[];
}

export default function PatentsAndBooks({ patents, books }: PatentsAndBooksProps) {
  const [activeTab, setActiveTab] = useState<'patents' | 'books'>('patents');
  const [previewBook, setPreviewBook] = useState<BookItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const sortedPatents = React.useMemo(() => {
    return [...patents].sort((a, b) => b.date.localeCompare(a.date));
  }, [patents]);

  const sortedBooks = React.useMemo(() => {
    return [...books].sort((a, b) => b.year.localeCompare(a.year));
  }, [books]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Granted':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          indicator: 'bg-amber-400',
          label: 'Patent Granted',
        };
      case 'Published':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          indicator: 'bg-blue-400',
          label: 'Patent Published',
        };
      default: // Filed
        return {
          bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
          indicator: 'bg-purple-400',
          label: 'Patent Filed',
        };
    }
  };

  const getBookCoverTheme = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('python')) {
      return {
        bg: 'from-amber-950/70 via-orange-950/50 to-slate-900',
        border: 'border-orange-500/30 group-hover:border-orange-400/60',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        accentColor: 'text-orange-400',
        icon: '🐍'
      };
    }
    if (lower.includes('biochemistry') || lower.includes('pathology')) {
      return {
        bg: 'from-emerald-950/70 via-teal-950/50 to-slate-900',
        border: 'border-teal-500/30 group-hover:border-teal-400/60',
        badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        accentColor: 'text-teal-400',
        icon: '🧪'
      };
    }
    if (lower.includes('biopharmaceutics') || lower.includes('pharmacokinetics')) {
      return {
        bg: 'from-amber-950/60 via-yellow-950/40 to-slate-900',
        border: 'border-amber-500/30 group-hover:border-amber-400/60',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentColor: 'text-amber-400',
        icon: '💊'
      };
    }
    return {
      bg: 'from-blue-950/70 via-indigo-950/50 to-slate-900',
      border: 'border-blue-500/30 group-hover:border-blue-400/60',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      accentColor: 'text-blue-400',
      icon: '🔬'
    };
  };

  return (
    <section id="patents" className="py-8 relative animate-fade-in">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Controls Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>Intellectual Property & Literature</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Patents & Authored Books
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-xl">
              Showcase of proprietary pharmaceutical inventions filed and granted with patent authorities, alongside published academic textbooks and research monographs.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl backdrop-blur-md">
            <button
              id="tab-patents"
              onClick={() => setActiveTab('patents')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer border border-transparent ${
                activeTab === 'patents'
                  ? 'bg-white dark:bg-white/10 text-brand-primary dark:text-white shadow-md border-slate-200/50 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Patents ({patents.length})</span>
            </button>
            <button
              id="tab-books"
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer border border-transparent ${
                activeTab === 'books'
                  ? 'bg-white dark:bg-white/10 text-brand-primary dark:text-white shadow-md border-slate-200/50 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Authored Books ({books.length})</span>
            </button>
          </div>
        </div>

        {/* Content Panel */}
        {activeTab === 'patents' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedPatents.map((pat) => {
              const statusStyle = getStatusStyle(pat.status);
              return (
                <div
                  key={pat.registrationNo}
                  id={`patent-card-${pat.registrationNo.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  className="group relative p-6 sm:p-8 rounded-3xl glass-card glass-card-hover transition-all duration-300 shadow-xl shadow-black/5 dark:shadow-black/20 flex flex-col justify-between overflow-hidden"
                >
                  {/* Status Indicator Tag */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${statusStyle.bg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.indicator} animate-pulse`}></span>
                      <span>{statusStyle.label}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-gray-500 font-bold uppercase tracking-wider">
                      {pat.type}
                    </span>
                  </div>

                  <div className="space-y-4 flex-1 mb-6">
                    <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white group-hover:text-brand-accent transition-colors leading-snug">
                      {pat.title}
                    </h3>

                    {/* Meta numbers */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-200 dark:border-white/10 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-gray-500 block uppercase font-mono tracking-wider">Reg / Application No</span>
                        <span className="font-mono text-slate-800 dark:text-gray-300 font-bold">{pat.registrationNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-gray-500 block uppercase font-mono tracking-wider">Date Published / Filed</span>
                        <span className="font-mono text-slate-800 dark:text-gray-300 font-bold">{pat.date}</span>
                      </div>
                    </div>

                    {/* Inventors */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
                      <User className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Inventors: <strong className="text-slate-800 dark:text-gray-200">{pat.inventors}</strong></span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                      {pat.description}
                    </p>
                  </div>

                  {/* bottom card panel */}
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Scale className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Indian Patent Office (IPO)</span>
                    </div>
                    {pat.link && (
                      <a
                        href={pat.link}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-brand-primary hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Official Entry</span>
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedBooks.map((book) => {
              const theme = getBookCoverTheme(book.title);
              const effectiveCover = book.coverImage;
              const hasImage = effectiveCover && !failedImages[book.isbn];

              return (
                <div
                  key={book.isbn}
                  id={`book-card-${book.isbn.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  className="group relative p-6 sm:p-8 rounded-3xl glass-card glass-card-hover transition-all duration-300 shadow-xl shadow-black/5 dark:shadow-black/20"
                >
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                    
                    {/* Left Column: Book Cover Presentation */}
                    <div className="w-full sm:w-64 md:w-72 lg:w-80 shrink-0">
                      <div
                        onClick={() => setPreviewBook({ ...book, coverImage: effectiveCover })}
                        className="relative group/cover cursor-pointer overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800/80 bg-slate-950/95 shadow-xl transition-all duration-300 hover:scale-[1.01] h-64 sm:h-72 md:h-80 flex items-center justify-center p-2.5"
                      >
                        {hasImage ? (
                          <>
                            <img
                              src={effectiveCover}
                              alt={book.title}
                              referrerPolicy="no-referrer"
                              onError={() => setFailedImages((prev) => ({ ...prev, [book.isbn]: true }))}
                              className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-md group-hover/cover:scale-[1.02] transition-transform duration-300"
                            />
                            {/* Hover Overlay with Preview */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 text-xs text-white font-semibold backdrop-blur-xs p-3 z-20 rounded-2xl">
                              <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold shadow-md">
                                <Maximize2 className="w-4 h-4 text-brand-accent" />
                                <span>View Full Cover</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          // High-fidelity fallback cover illustration
                          <div className={`relative z-10 flex flex-col justify-between w-full h-full text-left p-4 rounded-xl bg-gradient-to-b ${theme.bg}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xl">{theme.icon}</span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-gray-300 border border-white/10">
                                {book.year}
                              </span>
                            </div>
                            <div className="space-y-1.5 my-auto py-2">
                              <h4 className="font-display font-bold text-sm text-white leading-tight line-clamp-3">
                                {book.title}
                              </h4>
                              <p className="text-xs text-gray-300 font-mono line-clamp-1">
                                {book.coAuthors?.[0] || 'Dr. Tushar Rukari'}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-gray-400 truncate max-w-[120px]">
                                {book.publisher.split('(')[0]}
                              </span>
                              <Maximize2 className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                            </div>
                          </div>
                        )}

                        <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[10px] font-mono text-brand-accent font-bold z-10 border border-white/10">
                          {book.year}
                        </span>
                      </div>

                      {/* Action Bar under Cover: Zoom Button */}
                      <div className="mt-2.5">
                        <button
                          type="button"
                          onClick={() => setPreviewBook({ ...book, coverImage: effectiveCover })}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-brand-accent" />
                          <span>View Full Cover</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Book Metadata and Scope Description */}
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md glass-badge">
                              {book.role}
                            </span>
                            <span className={`inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                              Published {book.year}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors leading-tight">
                            {book.title}
                          </h3>
                        </div>
                        
                        <div className="text-left sm:text-right text-xs shrink-0">
                          <span className="text-slate-500 dark:text-gray-500 block uppercase font-mono tracking-wider">ISBN Number</span>
                          <span className="font-mono text-slate-800 dark:text-gray-300 font-bold bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 inline-block mt-0.5">
                            {book.isbn}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                        {book.description}
                      </p>

                      {/* Book Metadata footer block */}
                      <div className="flex flex-wrap items-center justify-between gap-y-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-gray-400">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                          <div>
                            <span className="text-slate-500 dark:text-gray-500 font-mono block uppercase text-[10px]">Publisher</span>
                            <span className="text-slate-800 dark:text-gray-200 font-medium">{book.publisher}</span>
                          </div>
                          {book.coAuthors && book.coAuthors.length > 0 && (
                            <div>
                              <span className="text-slate-500 dark:text-gray-500 font-mono block uppercase text-[10px]">Authors / Editors</span>
                              <span className="text-slate-800 dark:text-gray-200 font-medium">{book.coAuthors.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPreviewBook({ ...book, coverImage: effectiveCover })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white border border-slate-200 dark:border-white/10 font-medium text-xs transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-brand-accent" />
                            <span>Quick Preview</span>
                          </button>
                          {book.link && (
                            <a
                              href={book.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 hover:border-brand-primary/40 font-medium text-xs transition-colors"
                            >
                              <span>Publisher Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fullscreen Book Cover Lightbox Modal */}
        {previewBook && (
          <div
            className="fixed inset-0 z-50 bg-black/75 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            onClick={() => setPreviewBook(null)}
          >
            <div
              className="relative max-w-4xl lg:max-w-5xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-primary dark:text-brand-accent uppercase tracking-wider">
                      {previewBook.role} • {previewBook.year}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 font-semibold border border-slate-200 dark:border-white/10">
                      Full Cover View
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 dark:text-white text-lg sm:text-2xl leading-tight">
                    {previewBook.title}
                  </h4>
                </div>
                <button
                  onClick={() => setPreviewBook(null)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-7 space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl h-[45vh] sm:h-[60vh] flex items-center justify-center p-3 relative">
                    {previewBook.coverImage && !failedImages[previewBook.isbn] ? (
                      <img
                        src={previewBook.coverImage}
                        alt={previewBook.title}
                        referrerPolicy="no-referrer"
                        onError={() => setFailedImages((prev) => ({ ...prev, [previewBook.isbn]: true }))}
                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-2xl"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-3">
                        <BookOpenCheck className="w-16 h-16 text-brand-primary mx-auto" />
                        <p className="font-display font-semibold text-white text-base">{previewBook.title}</p>
                        <p className="text-xs font-mono text-gray-400">{previewBook.isbn}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-5 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] tracking-wider">Authors & Contributors</span>
                    <p className="text-slate-900 dark:text-white font-semibold text-sm leading-snug">
                      {previewBook.coAuthors?.join(', ') || 'Dr. Tushar G. Rukari'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-200 dark:border-white/10">
                    <div>
                      <span className="text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] block tracking-wider">ISBN Number</span>
                      <span className="text-slate-900 dark:text-gray-200 font-mono font-bold text-xs">{previewBook.isbn}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] block tracking-wider">Publication Year</span>
                      <span className="text-brand-primary dark:text-brand-accent font-mono font-bold text-xs">{previewBook.year}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] tracking-wider">Publisher</span>
                    <p className="text-slate-800 dark:text-gray-200 font-medium text-sm">{previewBook.publisher}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] tracking-wider">Academic Scope & Curriculum</span>
                    <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed max-h-52 overflow-y-auto pr-2 bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                      {previewBook.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
