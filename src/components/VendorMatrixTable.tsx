import React, { useState, useMemo } from 'react';
import { TicketPriceRecord, ParkTier, TicketDuration } from '../types/tickets';
import { formatDualCurrency, formatEurOnly } from '../utils/priceAnalyzer';
import { Search, Filter, ArrowUpDown, ArrowDownRight, ArrowUpRight, Minus, Star, Info, Tag } from 'lucide-react';

interface VendorMatrixTableProps {
  records: TicketPriceRecord[];
  bestDealIds: string[];
}

export const VendorMatrixTable: React.FC<VendorMatrixTableProps> = ({ records, bestDealIds }) => {
  const [selectedTier, setSelectedTier] = useState<'All' | ParkTier>('All');
  const [selectedDuration, setSelectedDuration] = useState<'All' | TicketDuration>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'price' | 'vendor' | 'date'>('price');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<TicketPriceRecord | null>(null);

  const filteredAndSorted = useMemo(() => {
    return records
      .filter((r) => {
        if (selectedTier !== 'All' && r.parkTier !== selectedTier) return false;
        if (selectedDuration !== 'All' && r.ticketDuration !== selectedDuration) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            r.vendorName.toLowerCase().includes(q) ||
            r.ticketOptionTitle.toLowerCase().includes(q) ||
            r.activePromos.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'price') {
          return sortAsc ? a.totalEur - b.totalEur : b.totalEur - a.totalEur;
        }
        if (sortField === 'vendor') {
          return sortAsc ? a.vendorName.localeCompare(b.vendorName) : b.vendorName.localeCompare(a.vendorName);
        }
        if (sortField === 'date') {
          return sortAsc ? a.startDate.localeCompare(b.startDate) : b.startDate.localeCompare(a.startDate);
        }
        return 0;
      });
  }, [records, selectedTier, selectedDuration, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: 'price' | 'vendor' | 'date') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Matrix Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        {/* Tier & Duration Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <span className="px-2 text-slate-500 font-medium">Tier:</span>
            {(['All', '2-Park', '3-Park', '4-Park'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedTier === tier
                    ? 'bg-slate-800 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <span className="px-2 text-slate-500 font-medium">Duration:</span>
            {(['All', '5-Day', '7-Day'] as const).map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedDuration === dur
                    ? 'bg-slate-800 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dur}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter vendor, promo, or ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="border-b border-slate-800 bg-slate-950/60 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Vendor Comparison Matrix (Total Cost for 3 People)
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredAndSorted.length} ticket options calibrated for 2 Adults + 1 Child (Age 9).
            </p>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Star className="h-3 w-3 fill-emerald-400" /> Best in category
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th
                  onClick={() => toggleSort('vendor')}
                  className="cursor-pointer px-4 py-3 font-semibold hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Vendor</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-600" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold">Ticket Duration</th>
                <th className="px-4 py-3 font-semibold">Park Tier</th>
                <th
                  onClick={() => toggleSort('date')}
                  className="cursor-pointer px-4 py-3 font-semibold hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Best Start Date</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-600" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('price')}
                  className="cursor-pointer px-4 py-3 font-semibold text-right hover:text-slate-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Price (€) [Local]</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-600" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-center">Trend (WoW)</th>
                <th className="px-4 py-3 font-semibold">Promos & Terms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredAndSorted.map((row) => {
                const isBest = bestDealIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRecord(row)}
                    className={`cursor-pointer transition-colors hover:bg-slate-800/50 ${
                      isBest ? 'bg-emerald-950/15' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        {isBest && <Star className="h-3 w-3 fill-emerald-400 text-emerald-400 shrink-0" />}
                        <span>{row.vendorName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{row.ticketOptionTitle}</div>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-300">{row.durationLabel}</td>
                    <td className="px-4 py-3 font-sans">
                      <span
                        className={`inline-block text-[11px] font-medium ${
                          row.parkTier === '4-Park'
                            ? 'text-amber-300'
                            : row.parkTier === '3-Park'
                            ? 'text-sky-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {row.parkTier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 tabular-nums">{row.startDate}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">
                      <span className={isBest ? 'text-emerald-400 text-sm' : 'text-slate-100'}>
                        {formatEurOnly(row.totalEur)}
                      </span>
                      <span className="ml-1.5 text-[11px] font-normal text-slate-400">
                        ({row.localCurrencySymbol}{row.totalPriceLocal.toLocaleString()})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.deltaEur < 0 ? (
                        <span className="inline-flex items-center text-[10px] text-emerald-400">
                          <ArrowDownRight className="h-3 w-3 mr-0.5" /> -€{Math.abs(row.deltaEur)}
                        </span>
                      ) : row.deltaEur > 0 ? (
                        <span className="inline-flex items-center text-[10px] text-rose-400">
                          <ArrowUpRight className="h-3 w-3 mr-0.5" /> +€{row.deltaEur}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-slate-500">
                          <Minus className="h-3 w-3 mr-0.5" /> 0
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-sans text-[11px] text-slate-400 max-w-xs truncate">
                      {row.activePromos}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Ticket Modal Drawer */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase text-amber-400 tracking-wider">
                  Ticket Rate Details
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  {selectedRecord.vendorName} · {selectedRecord.durationLabel}
                </h3>
                <p className="text-xs text-slate-400">{selectedRecord.ticketOptionTitle}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-500 font-sans">Total Cost (Party of 3)</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {formatDualCurrency(
                    selectedRecord.totalEur,
                    selectedRecord.totalPriceLocal,
                    selectedRecord.localCurrencySymbol
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-sans">Best Start Date</div>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">{selectedRecord.startDate}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-sans">2x Adult Breakdown</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {formatDualCurrency(
                    selectedRecord.adultPriceEur,
                    selectedRecord.adultPriceLocal,
                    selectedRecord.localCurrencySymbol
                  )}{' '}
                  each
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-sans">1x Child (Age 9)</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {formatDualCurrency(
                    selectedRecord.childPriceEur,
                    selectedRecord.childPriceLocal,
                    selectedRecord.localCurrencySymbol
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-amber-400" />
                <span>Active Vendor Promotion & Policy:</span>
              </div>
              <p className="rounded bg-slate-950 p-3 text-slate-300 leading-relaxed border border-slate-800">
                {selectedRecord.activePromos}
              </p>
              {selectedRecord.notes && (
                <p className="text-[11px] text-slate-400 italic">Note: {selectedRecord.notes}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
