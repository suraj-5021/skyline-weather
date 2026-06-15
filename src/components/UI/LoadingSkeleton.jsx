import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Top Current Weather & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card Skeleton */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-glass border border-white/10 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-slate-200/20 dark:bg-slate-800/30 rounded-lg skeleton-pulse" />
            <div className="h-10 w-2/3 bg-slate-200/20 dark:bg-slate-800/30 rounded-xl skeleton-pulse" />
            <div className="h-6 w-1/2 bg-slate-200/20 dark:bg-slate-800/30 rounded-lg skeleton-pulse" />
          </div>
          <div className="flex justify-between items-end mt-8">
            <div className="h-20 w-20 bg-slate-200/20 dark:bg-slate-800/30 rounded-2xl skeleton-pulse" />
            <div className="space-y-2 w-2/5">
              <div className="h-10 bg-slate-200/20 dark:bg-slate-800/30 rounded-xl skeleton-pulse" />
              <div className="h-5 bg-slate-200/20 dark:bg-slate-800/30 rounded-lg skeleton-pulse" />
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between">
            <div className="h-5 w-1/3 bg-slate-200/20 dark:bg-slate-800/30 rounded skeleton-pulse" />
            <div className="h-5 w-1/4 bg-slate-200/20 dark:bg-slate-800/30 rounded skeleton-pulse" />
          </div>
        </div>

        {/* Weather Metrics Grid Skeleton */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-glass border border-white/10 flex flex-col justify-between min-h-[120px]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-slate-200/20 dark:bg-slate-800/30 rounded-xl skeleton-pulse" />
                <div className="h-4 w-1/2 bg-slate-200/20 dark:bg-slate-800/30 rounded skeleton-pulse" />
              </div>
              <div className="h-8 w-3/4 bg-slate-200/20 dark:bg-slate-800/30 rounded-xl skeleton-pulse mt-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="p-6 rounded-3xl bg-glass border border-white/10 space-y-4">
        <div className="h-6 w-1/4 bg-slate-200/20 dark:bg-slate-800/30 rounded-lg skeleton-pulse" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="min-w-[95px] flex-1 p-4 rounded-2xl bg-white/5 dark:bg-slate-900/10 border border-white/5 flex flex-col items-center gap-3">
              <div className="h-4 w-2/3 bg-slate-200/20 dark:bg-slate-800/30 rounded skeleton-pulse" />
              <div className="h-10 w-10 bg-slate-200/20 dark:bg-slate-800/30 rounded-full skeleton-pulse" />
              <div className="h-5 w-1/2 bg-slate-200/20 dark:bg-slate-800/30 rounded skeleton-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
