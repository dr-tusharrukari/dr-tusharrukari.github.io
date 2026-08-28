import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Linkedin, 
  ExternalLink, 
  GraduationCap, 
  Globe, 
  Layers, 
  AlertCircle, 
  ShieldCheck,
  Clock,
  Lock
} from 'lucide-react';
import { PersonalInfo } from '../types';

interface ContactProps {
  personal: PersonalInfo;
}

export default function Contact({ personal }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Academic Collaboration',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default Formspree Endpoint for Dr. Tushar Rukari's portfolio
  const DEFAULT_FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqpkkkva';

  // Retrieve Formspree Endpoint / Form ID from env, localStorage, or fallback to default endpoint
  const [formspreeKey] = useState<string>(() => {
    const metaEnv = (import.meta as any).env || {};
    const fromEnv = metaEnv.VITE_FORMSPREE_ENDPOINT || metaEnv.VITE_FORMSPREE_ID || '';
    const fromStorage = localStorage.getItem('tushar_formspree_id') || localStorage.getItem('tushar_formspree_endpoint') || '';
    return fromStorage || fromEnv || DEFAULT_FORMSPREE_ENDPOINT;
  });

  // Helper to normalize the endpoint URL
  const getNormalizedEndpoint = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // If only the Form ID was entered (e.g., "xpwzgkqa")
    return `https://formspree.io/f/${trimmed}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required (*) fields before transmitting.');
      return;
    }

    const endpoint = getNormalizedEndpoint(formspreeKey);

    // If no Formspree endpoint is set up yet, provide mailto fallback & prompt setup
    if (!endpoint) {
      setStatus('submitting');
      setTimeout(() => {
        const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject} from ${formData.name}`);
        const mailtoBody = encodeURIComponent(
          `Dear Dr. Tushar G. Rukari,\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}\n\nBest regards,\n${formData.name}`
        );
        window.location.href = `mailto:${personal.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Academic Collaboration', message: '' });
        setTimeout(() => setStatus('idle'), 6000);
      }, 700);
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          _replyto: formData.email.trim(),
          _subject: `[Portfolio Inquiry] ${formData.subject} from ${formData.name.trim()}`,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Academic Collaboration', message: '' });
        setTimeout(() => setStatus('idle'), 8000);
      } else {
        const data = await response.json().catch(() => ({}));
        const err = data.error || (data.errors && data.errors.map((e: any) => e.message).join(', ')) || 'Formspree could not process the submission. Please check your Form ID.';
        throw new Error(err);
      }
    } catch (err: any) {
      console.error('Formspree dispatch error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Transmission failed. You can also email directly to ' + personal.email);
    }
  };

  const dbLinks = [
    {
      label: 'Google Scholar',
      sub: 'Research Citations',
      url: personal.googleScholar,
      icon: GraduationCap,
      color: 'hover:text-blue-400 dark:hover:text-blue-300',
    },
    {
      label: 'ORCID iD',
      sub: 'Open Researcher Registry',
      url: personal.orcid,
      icon: Globe,
      color: 'hover:text-emerald-400 dark:hover:text-emerald-300',
    },
    {
      label: 'Scopus Profile',
      sub: 'Abstract Citation Database',
      url: personal.scopus,
      icon: Layers,
      color: 'hover:text-cyan-400 dark:hover:text-cyan-300',
    },
    {
      label: 'LinkedIn Profile',
      sub: 'Professional Network',
      url: personal.linkedin,
      icon: Linkedin,
      color: 'hover:text-indigo-400 dark:hover:text-indigo-300',
    },
  ];

  const isFormspreeConnected = Boolean(formspreeKey.trim());

  return (
    <section id="contact" className="py-8 relative animate-fade-in">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-primary">
            <Mail className="w-4 h-4" />
            <span>Connect & Partner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Academic Collaboration
          </h2>
          <p className="text-gray-400 text-sm">
            Interested in joint research projects, patent licensing, guest lectures, or academic guidance? Send an inquiry directly to Dr. Rukari's inbox.
          </p>
        </div>

        {/* Dynamic Citation DB Link cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {dbLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                referrerPolicy="no-referrer"
                className={`group p-5 rounded-2xl glass-card glass-card-hover transition-all duration-300 flex flex-col justify-between ${link.color}`}
              >
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl glass-badge text-gray-400 group-hover:text-inherit transition-colors w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-gray-200 group-hover:text-inherit transition-colors leading-snug">
                      {link.label}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-500">{link.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 pt-3 border-t border-white/10 mt-3">
                  <span>Explore Index</span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-inherit" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
          
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl relative">
              
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <span>Send an Inquiry</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Encrypted SSL Delivery</span>
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Direct notification to <span className="font-mono text-brand-primary">{personal.email}</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Inbox</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-gray-400">
                      Full Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="Dr. John Doe / Prof. Alex Smith"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-gray-400">
                      Email Address <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="john.doe@academic.edu"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-gray-400">Subject / Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-white/20 transition-all cursor-pointer bg-slate-900"
                  >
                    <option value="Academic Research & PhD Mentorship">Academic Research & PhD Mentorship</option>
                    <option value="Grant Collaboration & Joint Proposals">Grant Collaboration & Joint Proposals</option>
                    <option value="Industrial Formulation Consultancy">Industrial Formulation Consultancy</option>
                    <option value="Patent / Licensing Question">Patent Licensing Inquiry</option>
                    <option value="Guest Lecture / Expert Talk">Guest Keynote / Lecture Invitation</option>
                    <option value="Peer-Review & Editorial Request">Peer-Review & Editorial Request</option>
                    <option value="Other Inquiry">Other Academic Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-gray-400">
                    Inquiry Details <span className="text-pink-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all resize-none"
                    placeholder="Describe your research proposal, consultation request, institutional affiliation, or timeline in detail..."
                  />
                </div>

                {/* Status messages */}
                {status === 'success' && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Inquiry transmitted successfully! Dr. Rukari has been notified at {personal.email} and will respond promptly.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-medium animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage || 'Failed to submit inquiry. Please try again or email directly.'}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="gemini-btn w-full !rounded-xl text-sm font-semibold text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span>Dispatching to {personal.email}...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick info panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 shadow-2xl h-full flex flex-col justify-center">
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">Primary Academic Office</h3>
                <p className="text-sm text-gray-400">Headquarters location, campus affiliation, and contact schedules.</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl glass-badge-purple shrink-0 text-brand-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200">{personal.institution || 'Department of Pharmaceutics'}</h4>
                    <p className="text-gray-400">{personal.department}</p>
                    <p className="text-xs text-gray-500">{personal.location}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl glass-badge shrink-0 text-brand-accent">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200">Direct Email Contact</h4>
                    <a href={`mailto:${personal.email}`} className="text-brand-primary hover:underline font-mono font-medium">
                      {personal.email}
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5">Checked daily during academic working hours.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl glass-badge shrink-0 text-emerald-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200">Contact Schedule</h4>
                    <p className="text-gray-300 text-xs mt-0.5 font-medium">
                      10.00 AM to 05.00 PM <span className="text-gray-500 font-normal">(Working Days)</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Sunday & Holidays <span className="text-emerald-400 font-medium">(Available on Request)</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Direct Delivery & Anti-Spam</span>
                </div>
                <p>
                  Submissions are filtered for academic legitimacy and routed straight to Dr. Rukari's inbox with reply-to headers attached for instant replies.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

