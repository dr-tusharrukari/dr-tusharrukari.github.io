import React from 'react';

interface ShimmerLoaderProps {
  type: 'card' | 'timeline' | 'grid' | 'hero';
}

export default function ShimmerLoader({ type }: ShimmerLoaderProps) {
  if (type === 'hero') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12 animate-pulse">
        <div className="flex-1 space-y-6">
          <div className="h-4 w-32 rounded-full gemini-loader"></div>
          <div className="h-12 w-3/4 rounded-lg gemini-loader"></div>
          <div className="h-6 w-2/3 rounded-lg gemini-loader"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded-lg gemini-loader"></div>
            <div className="h-4 w-5/6 rounded-lg gemini-loader"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-32 rounded-lg gemini-loader"></div>
            <div className="h-10 w-32 rounded-lg gemini-loader"></div>
          </div>
        </div>
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full gemini-loader border border-gray-700/50"></div>
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="space-y-8 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6 relative">
            <div className="w-4 h-4 rounded-full gemini-loader shrink-0 mt-1"></div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-48 rounded gemini-loader"></div>
                <div className="h-4 w-24 rounded gemini-loader"></div>
              </div>
              <div className="h-4 w-36 rounded gemini-loader"></div>
              <div className="h-12 w-full rounded gemini-loader"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
            <div className="h-4 w-12 rounded-full gemini-loader"></div>
            <div className="h-6 w-5/6 rounded gemini-loader"></div>
            <div className="h-4 w-2/3 rounded gemini-loader"></div>
            <div className="h-12 w-full rounded gemini-loader"></div>
          </div>
        ))}
      </div>
    );
  }

  // default card shimmer
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-6 w-3/4 rounded gemini-loader"></div>
        <div className="h-5 w-16 rounded-full gemini-loader"></div>
      </div>
      <div className="h-4 w-1/2 rounded gemini-loader"></div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded gemini-loader"></div>
        <div className="h-3 w-5/6 rounded gemini-loader"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-4 w-16 rounded-full gemini-loader"></div>
        <div className="h-4 w-16 rounded-full gemini-loader"></div>
      </div>
    </div>
  );
}
