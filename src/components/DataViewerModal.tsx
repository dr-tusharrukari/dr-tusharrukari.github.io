import React, { useState } from 'react';
import { X, Code, Copy, Check, FileJson, Download } from 'lucide-react';
import { motion } from 'motion/react';
import portfolioData from '../data/portfolioData.json';

interface DataViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataViewerModal({ isOpen, onClose }: DataViewerModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const jsonString = JSON.stringify(portfolioData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolioData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-4xl h-[85vh] flex flex-col glass-panel shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl glass-badge shrink-0 text-brand-primary">
              <Code className="w-5 h-5 font-mono" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Database JSON Code</h3>
              <p className="text-xs text-gray-400 font-mono">Location: /src/data/portfolioData.json</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Editor Viewport */}
        <div className="flex-1 overflow-auto bg-[#030712]/90 p-6 font-mono text-[11px] sm:text-xs text-gray-300 leading-relaxed border-b border-white/10">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        {/* Footer controls */}
        <div className="p-6 bg-[#030712]/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FileJson className="w-4 h-4 text-brand-primary shrink-0" />
            <span>Plain JSON database file ready for offline updates.</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="gemini-btn !px-4 !py-2.5 !text-xs !rounded-xl font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy database</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="gemini-btn !px-5 !py-2.5 !text-xs !rounded-xl font-semibold text-white cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .json file</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
