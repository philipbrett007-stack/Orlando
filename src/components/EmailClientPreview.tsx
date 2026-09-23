import React, { useState } from 'react';
import { Monitor, Smartphone, Code, FileText, Copy, Check, Download, Send, ExternalLink } from 'lucide-react';
import { EmailBriefingData } from '../types/tickets';
import { generateCleanHtmlEmail, generateMarkdownEmail } from '../utils/emailTemplateGenerator';

interface EmailClientPreviewProps {
  briefing: EmailBriefingData;
  onCopyHtml: () => void;
  copiedHtml: boolean;
  onSendTest: () => void;
}

export const EmailClientPreview: React.FC<EmailClientPreviewProps> = ({
  briefing,
  onCopyHtml,
  copiedHtml,
  onSendTest,
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code' | 'markdown'>('desktop');
  const [copiedMd, setCopiedMd] = useState(false);

  const htmlContent = generateCleanHtmlEmail(briefing);
  const markdownContent = generateMarkdownEmail(briefing);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Universal_Orlando_Briefing_${briefing.reportDate.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-sm">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'desktop'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop Email</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'mobile'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile (375px)</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'code'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>HTML Source</span>
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'markdown'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Plain Text / MD</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {viewMode === 'markdown' ? (
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copiedMd ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedMd ? 'Copied Text' : 'Copy Plain Text'}</span>
            </button>
          ) : (
            <button
              onClick={onCopyHtml}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copiedHtml ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedHtml ? 'Copied HTML' : 'Copy Clean HTML'}</span>
            </button>
          )}

          <button
            onClick={handleDownloadHtml}
            title="Download standalone HTML email file"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Download .html</span>
          </button>

          <button
            onClick={onSendTest}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Test Now</span>
          </button>
        </div>
      </div>

      {/* Email Client Shell */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Email Header Chrome */}
        <div className="border-b border-slate-800 bg-slate-950 p-4">
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="w-16 font-semibold text-slate-500">Subject:</span>
              <span className="font-semibold text-slate-100 font-mono text-sm">
                {briefing.subjectLine}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-16 font-semibold text-slate-500">From:</span>
              <span className="text-slate-300">
                Universal Orlando Price Bot &lt;<span className="text-amber-400/90">alerts@universal-tracker.internal</span>&gt;
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-16 font-semibold text-slate-500">To:</span>
              <span className="text-slate-300">philipbrett007@gmail.com</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-16 font-semibold text-slate-500">Schedule:</span>
              <span className="text-emerald-400">Automated dispatch every Friday at 09:00 AM</span>
            </div>
          </div>
        </div>

        {/* Viewport Render Body */}
        <div className="bg-slate-950/70 p-4 sm:p-6 flex justify-center items-start min-h-[680px]">
          {viewMode === 'desktop' && (
            <div className="w-full max-w-[700px] overflow-hidden rounded-lg border border-slate-700/60 shadow-2xl bg-[#f1f5f9]">
              <iframe
                title="Email Preview Desktop"
                srcDoc={htmlContent}
                className="w-full h-[900px] border-0"
              />
            </div>
          )}

          {viewMode === 'mobile' && (
            <div className="w-[375px] max-w-full overflow-hidden rounded-3xl border-4 border-slate-700 shadow-2xl bg-[#f1f5f9]">
              <div className="bg-slate-900 py-2 text-center text-[10px] text-slate-400 font-mono border-b border-slate-800">
                iPhone / Android Viewport (375px)
              </div>
              <iframe
                title="Email Preview Mobile"
                srcDoc={htmlContent}
                className="w-full h-[780px] border-0"
              />
            </div>
          )}

          {viewMode === 'code' && (
            <div className="w-full max-w-5xl">
              <div className="flex items-center justify-between pb-2 text-xs text-slate-400 font-mono">
                <span>Production HTML Email (Inline CSS, Table Layout, Responsive)</span>
                <span>{htmlContent.length.toLocaleString()} characters</span>
              </div>
              <pre className="h-[750px] w-full overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 selection:bg-amber-500/20">
                <code>{htmlContent}</code>
              </pre>
            </div>
          )}

          {viewMode === 'markdown' && (
            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-between pb-2 text-xs text-slate-400 font-mono">
                <span>Plain-Text Email Specification</span>
                <span>{markdownContent.length.toLocaleString()} characters</span>
              </div>
              <pre className="h-[750px] w-full overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-6 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/20">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
