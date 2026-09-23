import React, { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react';
import { sendGmailEmail, getAccessToken } from '../services/googleGmailAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { User } from 'firebase/auth';

interface SendEmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  ccEmail?: string;
  subject: string;
  htmlContent: string;
  user: User | null;
  hasToken: boolean;
  onSuccess: (messageId: string) => void;
}

export const SendEmailConfirmationModal: React.FC<SendEmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  recipientEmail,
  ccEmail,
  subject,
  htmlContent,
  user,
  hasToken,
  onSuccess,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmSend = async () => {
    setErrorMessage(null);
    setIsSending(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Google authorization is required. Please connect your Google account below.');
        setIsSending(false);
        return;
      }

      const result = await sendGmailEmail({
        to: recipientEmail,
        cc: ccEmail,
        subject,
        htmlBody: htmlContent,
      });

      if (result.success && result.messageId) {
        onSuccess(result.messageId);
        onClose();
      } else {
        setErrorMessage(result.error || 'Failed to dispatch email via Gmail API.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred while sending email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Confirm Real Email Dispatch via Gmail
              </h3>
              <p className="text-xs text-slate-400">
                Send official Universal Orlando briefing directly to your inbox.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Description Details */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-500">Destination Recipient:</span>
            <span className="font-mono font-semibold text-emerald-400">{recipientEmail}</span>
          </div>
          {ccEmail && (
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">CC:</span>
              <span className="font-mono text-slate-300">{ccEmail}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-500">Subject:</span>
            <span className="font-mono text-slate-200 text-right truncate max-w-[280px]">
              {subject}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Format:</span>
            <span className="text-slate-300">Clean HTML Briefing + Party Price Matrix</span>
          </div>
        </div>

        {/* Google Authentication Status */}
        {!hasToken ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-300">
                  Google Account Permission Required
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  To send this email directly to your inbox via Google Workspace, please sign in with your Google account.
                </p>
              </div>
            </div>
            <div className="pt-1">
              <GoogleSignInButton />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2 text-xs text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Sending from connected Google Account: <strong>{user?.email}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons (Strict User Confirmation requirements) */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSend}
            disabled={isSending || !hasToken}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending via Gmail...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Confirm & Send via Gmail</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
