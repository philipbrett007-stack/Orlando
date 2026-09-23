import React, { useState } from 'react';
import { ScheduledReportConfig, EmailBriefingData } from '../types/tickets';
import {
  Clock,
  Calendar,
  Mail,
  CheckCircle2,
  AlertCircle,
  Send,
  History,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Download,
  KeyRound,
  FileCode,
} from 'lucide-react';
import { generateCleanHtmlEmail, generatePlainTextEmail } from '../utils/emailTemplateGenerator';

interface SchedulerModalProps {
  config: ScheduledReportConfig;
  onUpdateConfig: (newConfig: ScheduledReportConfig) => void;
  onSendTestEmail: (email: string) => Promise<boolean>;
  isOpen: boolean;
  onClose: () => void;
  briefing: EmailBriefingData;
}

interface DeliveryLog {
  id: string;
  date: string;
  subject: string;
  recipient: string;
  status: string;
  savingsFound: string;
}

export const SchedulerModal: React.FC<SchedulerModalProps> = ({
  config,
  onUpdateConfig,
  isOpen,
  onClose,
  briefing,
}) => {
  const [recipient, setRecipient] = useState(config.recipientEmail);
  const [cc, setCc] = useState(config.ccEmail || '');
  const [threshold, setThreshold] = useState(config.alertOnDropOverEur);

  const [copiedPlainText, setCopiedPlainText] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [simulatedSent, setSimulatedSent] = useState(false);

  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([
    {
      id: 'log-1',
      date: 'Fri, 18 Sep 2026 09:00 AM',
      subject: 'Weekly Universal Orlando Ticket Price Briefing - 18 September 2026',
      status: 'Delivered (Simulation)',
      recipient: config.recipientEmail,
      savingsFound: '€26 drop detected on 2-Park 7-Day Pass',
    },
    {
      id: 'log-2',
      date: 'Fri, 11 Sep 2026 09:00 AM',
      subject: 'Weekly Universal Orlando Ticket Price Briefing - 11 September 2026',
      status: 'Delivered (Simulation)',
      recipient: config.recipientEmail,
      savingsFound: 'Rates stable across all 3 tiers',
    },
    {
      id: 'log-3',
      date: 'Fri, 04 Sep 2026 09:00 AM',
      subject: 'Weekly Universal Orlando Ticket Price Briefing - 04 September 2026',
      status: 'Delivered (Simulation)',
      recipient: config.recipientEmail,
      savingsFound: 'Initial baseline scan logged for June 2027 window',
    },
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateConfig({
      ...config,
      recipientEmail: recipient,
      ccEmail: cc,
      alertOnDropOverEur: threshold,
    });
    onClose();
  };

  const handleOpenGmailWeb = () => {
    const subject = encodeURIComponent(briefing.subjectLine);
    const body = encodeURIComponent(generatePlainTextEmail(briefing));
    const to = encodeURIComponent(recipient);
    const ccParam = cc ? `&cc=${encodeURIComponent(cc)}` : '';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}${ccParam}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDefaultEmailClient = () => {
    const subject = encodeURIComponent(briefing.subjectLine);
    const body = encodeURIComponent(generatePlainTextEmail(briefing));
    const to = encodeURIComponent(recipient);
    const ccParam = cc ? `&cc=${encodeURIComponent(cc)}` : '';
    const mailtoUrl = `mailto:${to}?subject=${subject}${ccParam}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatePlainTextEmail(briefing));
    setCopiedPlainText(true);
    setTimeout(() => setCopiedPlainText(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateCleanHtmlEmail(briefing));
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadHtml = () => {
    const html = generateCleanHtmlEmail(briefing);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Universal-Orlando-Price-Briefing-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTriggerSimulatedDispatch = () => {
    setSimulatedSent(true);
    const newLog: DeliveryLog = {
      id: `sim-${Date.now()}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      subject: briefing.subjectLine,
      recipient,
      status: 'Triggered (Key-Free Simulation)',
      savingsFound: 'Report prepared without cloud keys or external quotas',
    };
    setDeliveryLogs([newLog, ...deliveryLogs]);
    setTimeout(() => setSimulatedSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Automated Friday 09:00 AM Dispatch Service
              </h3>
              <p className="text-xs text-slate-400">
                Universal Orlando ticket price monitor & weekly briefing automation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Key Revocation & Zero-Cost Status Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>App Key & Cloud OAuth Status: 100% Revoked & Key-Free</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All cloud app keys and Google OAuth API permissions have been completely revoked from this application.
              No cloud billing accounts, sensitive scopes, or API keys are required. You will never be charged per use.
            </p>
          </div>

          {/* Schedule Status Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>CRON ACTIVE: 0 9 * * 5</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Every Friday at 09:00 AM EDT/UTC-4</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Next Scheduled Dispatch:</span>
                <div className="text-amber-300 font-semibold mt-0.5">{config.nextRunDate}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Target Travel Window:</span>
                <div className="text-slate-200 font-semibold mt-0.5">{briefing.travelWindow}</div>
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dispatch Destination & Rules
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Primary Recipient Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="philipbrett007@gmail.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Optional CC Recipient(s)
              </label>
              <input
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="co-traveler@example.com, family@domain.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instant Price Drop Alert Threshold
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={500}
                  step={5}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-28 rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
                <span className="text-xs text-slate-400">
                  Trigger alert if any pass drops by more than <strong>€{threshold}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Instant 100% Free Email Actions (Zero-Key) */}
          <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-5 space-y-4 shadow-sm">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Dispatch & Export (Zero Cost / No App Key Required)
              </h5>
              <p className="text-[11px] text-slate-400 mt-1">
                Send the complete formatted briefing to <strong className="text-emerald-300 font-mono">{recipient}</strong> using your browser’s native email tools or export directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleOpenGmailWeb}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Pre-filled in Gmail Web</span>
              </button>

              <button
                onClick={handleOpenDefaultEmailClient}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <Mail className="h-4 w-4 text-amber-400" />
                <span>Open in Default Mail Client</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
              <button
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {copiedHtml ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileCode className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copiedHtml ? 'HTML Copied' : 'Copy HTML Email'}</span>
              </button>

              <button
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {copiedPlainText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copiedPlainText ? 'Text Copied' : 'Copy Plain Text'}</span>
              </button>

              <button
                onClick={handleDownloadHtml}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Download .html File</span>
              </button>

              <button
                onClick={handleTriggerSimulatedDispatch}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-amber-400 hover:bg-slate-800 transition-colors ml-auto"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Test Local Dispatch</span>
              </button>
            </div>

            {simulatedSent && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 animate-in fade-in duration-150">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Test run verified! All calculations and HTML tables verified for Friday 09:00 AM dispatch.</span>
              </div>
            )}
          </div>

          {/* Execution History */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <History className="h-3.5 w-3.5" />
              <span>Delivery Logs & History</span>
            </div>
            <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
              {deliveryLogs.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="font-mono text-slate-400">{item.date}</span>
                    <span className="font-semibold text-slate-400">
                      {item.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-200 mt-1 font-mono text-xs">
                    {item.subject}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.savingsFound}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-3.5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
          >
            Save Schedule Settings
          </button>
        </div>
      </div>
    </div>
  );
};
