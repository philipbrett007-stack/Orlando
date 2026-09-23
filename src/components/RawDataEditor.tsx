import React, { useState } from 'react';
import { TicketPriceRecord, ParkTier, TicketDuration } from '../types/tickets';
import { formatDualCurrency, formatEurOnly } from '../utils/priceAnalyzer';
import { Plus, Edit2, Trash2, RefreshCw, Check, AlertCircle, Database, FileJson } from 'lucide-react';

interface RawDataEditorProps {
  records: TicketPriceRecord[];
  onUpdateRecords: (records: TicketPriceRecord[]) => void;
  onRefreshCrawl: () => void;
  isRefreshing: boolean;
}

export const RawDataEditor: React.FC<RawDataEditorProps> = ({
  records,
  onUpdateRecords,
  onRefreshCrawl,
  isRefreshing,
}) => {
  const [editingRecord, setEditingRecord] = useState<TicketPriceRecord | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [jsonView, setJsonView] = useState(false);

  // New ticket state
  const [formData, setFormData] = useState<Partial<TicketPriceRecord>>({
    vendorName: 'AttractionTickets.com',
    parkTier: '3-Park',
    parkTierName: 'Universal Studios + Islands of Adventure + Volcano Bay',
    ticketDuration: '7-Day',
    durationLabel: '7-Day Pass / 14-Day Explorer',
    ticketOptionTitle: 'Universal 3-Park Explorer Ticket',
    startDate: '22/06/2027',
    adultPriceEur: 470,
    childPriceEur: 455,
    localCurrencySymbol: '£',
    localCurrencyCode: 'GBP',
    adultPriceLocal: 395,
    childPriceLocal: 382,
    activePromos: 'Special online promotional discount',
    refundable: true,
    parkHopper: true,
    includesEpicUniverse: false,
  });

  const handleEditClick = (record: TicketPriceRecord) => {
    setEditingRecord(record);
    setFormData(record);
    setIsAddingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const adultEur = Number(formData.adultPriceEur) || 0;
    const childEur = Number(formData.childPriceEur) || 0;
    const totalEur = 2 * adultEur + childEur;

    const adultLoc = Number(formData.adultPriceLocal) || Math.round(adultEur * 1.09);
    const childLoc = Number(formData.childPriceLocal) || Math.round(childEur * 1.09);
    const totalLoc = 2 * adultLoc + childLoc;

    if (editingRecord) {
      const updated = records.map((r) =>
        r.id === editingRecord.id
          ? ({
              ...r,
              ...formData,
              adultPriceEur: adultEur,
              childPriceEur: childEur,
              totalEur,
              adultPriceLocal: adultLoc,
              childPriceLocal: childLoc,
              totalPriceLocal: totalLoc,
              deltaEur: totalEur - (r.previousWeekTotalEur || totalEur),
            } as TicketPriceRecord)
          : r
      );
      onUpdateRecords(updated);
      setEditingRecord(null);
    } else if (isAddingNew) {
      const newRec: TicketPriceRecord = {
        id: `custom-${Date.now()}`,
        vendorId: (formData.vendorName || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        vendorName: formData.vendorName || 'Custom Vendor',
        parkTier: (formData.parkTier as ParkTier) || '3-Park',
        parkTierName: formData.parkTierName || 'Universal Resort',
        ticketDuration: (formData.ticketDuration as TicketDuration) || '5-Day',
        durationLabel: formData.durationLabel || `${formData.ticketDuration} Pass`,
        ticketOptionTitle: formData.ticketOptionTitle || 'Custom Ticket Option',
        startDate: formData.startDate || '22/06/2027',
        adultPriceEur: adultEur,
        childPriceEur: childEur,
        totalEur,
        localCurrencySymbol: formData.localCurrencySymbol || '$',
        localCurrencyCode: (formData.localCurrencyCode as 'USD' | 'GBP' | 'EUR') || 'USD',
        adultPriceLocal: adultLoc,
        childPriceLocal: childLoc,
        totalPriceLocal: totalLoc,
        previousWeekTotalEur: totalEur,
        deltaEur: 0,
        activePromos: formData.activePromos || '',
        includesEpicUniverse: Boolean(formData.includesEpicUniverse),
        parkHopper: Boolean(formData.parkHopper),
        refundable: Boolean(formData.refundable),
      };
      onUpdateRecords([...records, newRec]);
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    if (records.length <= 6) {
      alert('Cannot delete: A minimum of 6 quotes are needed to preserve all briefing categories.');
      return;
    }
    onUpdateRecords(records.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Database className="h-3.5 w-3.5" />
            <span>Underlying Data Stream</span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-white font-display">
            Raw Ticket Price Feeds & Crawler Logs
          </h2>
          <p className="text-xs text-slate-400">
            Real-time feed captured for 2 Adults + 1 Child (Age 9), June 20, 2027 – July 01, 2027.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setJsonView(!jsonView)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <FileJson className="h-3.5 w-3.5" />
            <span>{jsonView ? 'Table View' : 'JSON Feed'}</span>
          </button>

          <button
            onClick={onRefreshCrawl}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Crawling Brokers...' : 'Simulate API Re-Scan'}</span>
          </button>

          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditingRecord(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Price Quote</span>
          </button>
        </div>
      </div>

      {jsonView ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex justify-between items-center pb-2 text-xs text-slate-400 font-mono">
            <span>Raw JSON Ingest ({records.length} records)</span>
            <span>Formatted for Friday 09:00 AM briefing processor</span>
          </div>
          <pre className="h-[600px] overflow-auto text-xs text-slate-300 font-mono p-4 rounded bg-slate-900 border border-slate-800">
            {JSON.stringify(records, null, 2)}
          </pre>
        </div>
      ) : (
        /* Table of Raw Records */
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Vendor & Title</th>
                  <th className="px-4 py-3 font-semibold">Tier & Duration</th>
                  <th className="px-4 py-3 font-semibold">Start Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Adult / Child (€)</th>
                  <th className="px-4 py-3 font-semibold text-right">Total Party (€)</th>
                  <th className="px-4 py-3 font-semibold text-right">Local Eq.</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="font-semibold text-slate-200">{r.vendorName}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{r.ticketOptionTitle}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className="text-amber-300 font-medium">{r.parkTier}</span> · {r.durationLabel}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{r.startDate}</td>
                    <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                      €{r.adultPriceEur} / €{r.childPriceEur}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400 tabular-nums">
                      €{r.totalEur}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 tabular-nums">
                      {r.localCurrencySymbol}{r.totalPriceLocal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditClick(r)}
                          title="Edit this quote"
                          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          title="Remove quote"
                          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {(editingRecord || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveForm}
            className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {isAddingNew ? 'Add Ticket Price Quote' : `Edit Quote: ${editingRecord?.vendorName}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Updates propagate immediately into the email briefing calculations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingRecord(null);
                  setIsAddingNew(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Vendor Name</label>
                <input
                  type="text"
                  required
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Park Tier</label>
                <select
                  value={formData.parkTier}
                  onChange={(e) => setFormData({ ...formData, parkTier: e.target.value as ParkTier })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                >
                  <option value="2-Park">2-Park</option>
                  <option value="3-Park">3-Park</option>
                  <option value="4-Park">4-Park / All-Parks (Epic)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Duration</label>
                <select
                  value={formData.ticketDuration}
                  onChange={(e) => setFormData({ ...formData, ticketDuration: e.target.value as TicketDuration })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                >
                  <option value="5-Day">5-Day Pass</option>
                  <option value="7-Day">7-Day / 14-Day Explorer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Best Start Date (DD/MM/YYYY)</label>
                <input
                  type="text"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Adult Price (€)</label>
                <input
                  type="number"
                  required
                  value={formData.adultPriceEur}
                  onChange={(e) => setFormData({ ...formData, adultPriceEur: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Child Price (€, Age 9)</label>
                <input
                  type="number"
                  required
                  value={formData.childPriceEur}
                  onChange={(e) => setFormData({ ...formData, childPriceEur: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Local Currency</label>
                <select
                  value={formData.localCurrencyCode}
                  onChange={(e) => {
                    const code = e.target.value as 'USD' | 'GBP' | 'EUR';
                    const symbol = code === 'USD' ? '$' : code === 'GBP' ? '£' : '€';
                    setFormData({ ...formData, localCurrencyCode: code, localCurrencySymbol: symbol });
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Total Party (2A + 1C)</label>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold">
                  €{(2 * (Number(formData.adultPriceEur) || 0) + (Number(formData.childPriceEur) || 0))}
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 mb-1 font-medium">Active Vendor Promo / Notes</label>
              <input
                type="text"
                value={formData.activePromos}
                onChange={(e) => setFormData({ ...formData, activePromos: e.target.value })}
                placeholder='e.g., "Buy 3 Days Get 2 Free" or "€25 low deposit"'
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingRecord(null);
                  setIsAddingNew(false);
                }}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
              >
                Save Rate Quote
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
