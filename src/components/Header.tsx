import React from 'react';
import { Mail, RefreshCw, Send, Check, Copy } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';

interface HeaderProps {
  activeTab: 'email-preview' | 'deals' | 'matrix' | 'raw-data' | 'schedule';
  setActiveTab: (tab: 'email-preview' | 'deals' | 'matrix' | 'raw-data' | 'schedule') => void;
  onCopyHtml: () => void;
  copied: boolean;
  onSendTest: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onCopyHtml,
  copied,
  onSendTest,
  onRefreshData,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('email-preview');
            }}
            className="font-display text-lg font-bold tracking-tight text-white transition-colors hover:text-amber-400"
          >
            Universal Price Briefing
          </a>
          <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            Friday 09:00 AM Active
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('email-preview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'email-preview'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Email Preview
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'deals'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Best Deals
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'matrix'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => setActiveTab('raw-data')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'raw-data'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Price Feed & Quotes
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'schedule'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Schedule & Dispatch
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Auth */}
        <div className="flex items-center gap-2">
          {/* Google Sign-in / status button */}
          <div className="hidden lg:block">
            <GoogleSignInButton compact />
          </div>

          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Scan ticket broker APIs now"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'Scanning...' : 'Scan Rates'}</span>
          </button>

          <button
            onClick={onCopyHtml}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? 'HTML Copied' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={onSendTest}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400 active:bg-amber-600 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Real Email</span>
          </button>
        </div>
      </div>
    </header>
  );
};
