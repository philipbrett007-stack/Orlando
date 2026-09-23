import React from 'react';
import { Calendar, Clock, Mail, Bell, Settings, ArrowRight, Send } from 'lucide-react';
import { ScheduledReportConfig } from '../types/tickets';

interface SchedulerBarProps {
  config: ScheduledReportConfig;
  onOpenSchedulerSettings: () => void;
}

export const SchedulerBar: React.FC<SchedulerBarProps> = ({ config, onOpenSchedulerSettings }) => {
  return (
    <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 sm:px-6 lg:px-8 text-xs text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Automated Friday Briefing: Active</span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Cadence: <strong>Every Friday @ 09:00 AM</strong></span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Next Run: <span className="text-amber-300 font-medium">{config.nextRunDate}</span></span>
          </div>

          <span className="hidden md:inline text-slate-600">|</span>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Recipient: <span className="text-emerald-300 font-mono font-medium">{config.recipientEmail}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onOpenSchedulerSettings}
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <Send className="h-3 w-3" />
            <span>Send / Export Briefing</span>
          </button>

          <button
            onClick={onOpenSchedulerSettings}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors font-medium"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Schedule Settings</span>
            <ArrowRight className="h-3 w-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
