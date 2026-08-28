import React from 'react';
import { X, HelpCircle, FileJson, CheckCircle2, RefreshCw, Settings2, Sparkles, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      title: 'Locate the Database File',
      desc: 'All website content is saved inside a single plain-text JSON database file. Open the file explorer and go to:',
      code: '/src/data/portfolioData.json',
      icon: FileJson,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Modify or Add Records',
      desc: 'To update content, simply replace the text values. To add a new Publication or Patent, copy an existing block (bracket to bracket) and paste it inside the list. For example, to add a patent:',
      code: `"patents": [\n  {\n    "title": "My New Patent Title",\n    "status": "Granted",\n    "registrationNo": "IN-123456",\n    "date": "2026-07-19",\n    "inventors": "Dr. Tushar Ganpat Rukari",\n    "description": "Short description of my new invention...",\n    "type": "Formulation Science"\n  },\n  ...`,
      icon: Settings2,
      color: 'text-violet-400 bg-violet-500/10',
    },
    {
      title: 'Automatic Sorting & Calculations',
      desc: 'No coding is required for metadata. The dashboard automatically calculates your Total Publications, Patents Count, total Citations count, and sorts publications chronologically by year.',
      icon: Database,
      color: 'text-pink-400 bg-pink-500/10',
    },
    {
      title: 'Instant Build & Launch',
      desc: 'Once you save your changes, the build system automatically recompiles and deploys your updated portfolio instantly. No server restarts are required for content updates.',
      icon: RefreshCw,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-3xl h-[85vh] flex flex-col glass-panel shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl glass-badge shrink-0 text-brand-accent">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Non-Coder Update Guide</h3>
              <p className="text-xs text-gray-400 font-mono">Easily manage your academic profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              Congratulations on your professional academic portfolio! This website uses an <strong>offline-first, zero-database architecture</strong>. This means you do not need to configure any complex hosting SQL servers, cloud schemas, or APIs. All content lives in a clean, human-readable data file.
            </span>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-xl border border-white/10 shrink-0 ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-display font-semibold text-sm sm:text-base text-white">
                      Step {idx + 1}: {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                    {step.code && (
                      <pre className="p-3.5 rounded-xl border border-white/10 bg-white/5 font-mono text-[11px] text-gray-300 overflow-x-auto">
                        {step.code}
                      </pre>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick theme colors instructions */}
          <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
            <h4 className="font-display font-bold text-xs text-brand-primary uppercase tracking-wider">How to Customize Theme Colors Globally</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              If you wish to change the background colors, font style, or accent glows, open the stylesheet at <code className="font-mono text-gray-300">/src/index.css</code>. Under the <code className="font-mono text-brand-accent">@theme</code> block, you can modify primary variables like brand color gradients to perfectly match your institutional branding.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/10 bg-[#030712]/95 flex items-center justify-end">
          <button
            onClick={onClose}
            className="gemini-btn !px-5 !py-2.5 !text-sm !rounded-xl font-medium text-white cursor-pointer"
          >
            I Understand, Got It!
          </button>
        </div>
      </motion.div>
    </div>
  );
}
