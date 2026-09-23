import React from 'react';
import { Loader2, CheckCircle, Radio } from 'lucide-react';

interface CrawlerProgressBannerProps {
  progress: number;
  currentVendor: string;
}

export const CrawlerProgressBanner: React.FC<CrawlerProgressBannerProps> = ({ progress, currentVendor }) => {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Radio className="h-4 w-4 animate-pulse text-amber-400 shrink-0" />
          <div>
            <span className="font-semibold text-white">Live Broker Scrape in Progress:</span>{' '}
            <span className="text-amber-300 font-mono">{currentVendor}</span>
          </div>
        </div>
        <div className="font-mono text-xs text-amber-400 font-bold">{progress}%</div>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-amber-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>Target Travel Window: 20/06/2027 – 01/07/2027</span>
        <span>Querying 2 Adults + 1 Child (Age 9)</span>
      </div>
    </div>
  );
};
