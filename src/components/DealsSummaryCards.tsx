import React from 'react';
import { TicketPriceRecord, EmailBriefingData } from '../types/tickets';
import { formatDualCurrency, formatEurOnly } from '../utils/priceAnalyzer';
import { Sparkles, ArrowDownRight, ArrowUpRight, Minus, Calendar, Users, ShieldCheck, Ticket } from 'lucide-react';

interface DealsSummaryCardsProps {
  briefing: EmailBriefingData;
  onSelectTicket?: (ticket: TicketPriceRecord) => void;
}

export const DealsSummaryCards: React.FC<DealsSummaryCardsProps> = ({ briefing, onSelectTicket }) => {
  const { bestDeals } = briefing;

  const categories = [
    {
      number: '1',
      title: 'TWO-PARK PASSES',
      subtitle: 'Universal Studios Florida + Islands of Adventure',
      passes: [
        {
          label: '5-Day Pass',
          record: bestDeals.twoPark.fiveDay,
        },
        {
          label: '7-Day Pass',
          record: bestDeals.twoPark.sevenDay,
        },
      ],
      description: 'Ideal for classic attractions (Harry Potter Diagon Alley & Hogsmeade with Hogwarts Express).',
    },
    {
      number: '2',
      title: 'THREE-PARK PASSES',
      subtitle: 'Universal Studios + Islands of Adventure + Volcano Bay Water Theme Park',
      passes: [
        {
          label: '5-Day Pass',
          record: bestDeals.threePark.fiveDay,
        },
        {
          label: '7-Day Pass / 14-Day Explorer',
          record: bestDeals.threePark.sevenDay,
        },
      ],
      description: 'Includes full admission to Volcano Bay with TapuTapu virtual queue tech.',
    },
    {
      number: '3',
      title: 'FOUR-PARK / ALL-PARKS PASSES',
      subtitle: 'Including Universal Epic Universe & Volcano Bay Water Theme Park',
      passes: [
        {
          label: '5-Day / Multi-Day Option',
          record: bestDeals.fourPark.fiveDay,
        },
        {
          label: '7-Day / 14-Day Explorer Option',
          record: bestDeals.fourPark.sevenDay,
        },
      ],
      description: 'Features dedicated reservation access to the brand-new Universal Epic Universe park.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Context Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Lowest Rate Engine</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-white font-display">
              Best Deals Overview (Across All Monitored Vendors)
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Optimal price discovery for 2 Adults + 1 Child (Age 9) traveling {briefing.travelWindow}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-right">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Party Size</div>
              <div className="text-xs font-semibold text-slate-200">2 Adults + 1 Child (9)</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-right">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Date Window</div>
              <div className="text-xs font-semibold text-slate-200">20/06/2027 – 01/07/2027</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Category Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.number}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 shadow-md transition-all hover:border-slate-700"
          >
            {/* Category Header */}
            <div className="border-b border-slate-800 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">0{cat.number}.</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Tier Category
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-white font-display">{cat.title}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-1">{cat.subtitle}</p>
            </div>

            {/* Passes Comparison (5-Day vs 7-Day) */}
            <div className="flex-1 space-y-4 p-5">
              {cat.passes.map((pass, pIdx) => {
                const r = pass.record;
                return (
                  <div
                    key={pIdx}
                    onClick={() => onSelectTicket?.(r)}
                    className="group cursor-pointer rounded-lg border border-slate-800/90 bg-slate-950/60 p-4 transition-all hover:border-amber-500/40 hover:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-amber-300 transition-colors">
                          {pass.label}
                        </span>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {r.vendorName} · Start: <span className="font-mono text-slate-300">{r.startDate}</span>
                        </div>
                      </div>

                      {/* Delta badge */}
                      {r.deltaEur < 0 ? (
                        <span className="inline-flex items-center text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                          -€{Math.abs(r.deltaEur)}
                        </span>
                      ) : r.deltaEur > 0 ? (
                        <span className="inline-flex items-center text-[10px] font-mono font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          +€{r.deltaEur}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-mono text-slate-500">
                          <Minus className="h-3 w-3 mr-0.5" /> Stable
                        </span>
                      )}
                    </div>

                    {/* Total Price with Dual Currency */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-emerald-400 font-mono tracking-tight">
                        {formatEurOnly(r.totalEur)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({r.localCurrencySymbol}{r.totalPriceLocal.toLocaleString()})
                      </span>
                      <span className="ml-auto text-[10px] text-slate-400 font-medium">Party Total (3)</span>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-3 rounded border border-slate-800 bg-slate-900/70 p-2 text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between font-mono">
                        <span>2x Adult:</span>
                        <span className="text-slate-200">
                          {formatDualCurrency(r.adultPriceEur, r.adultPriceLocal, r.localCurrencySymbol)}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>1x Child (Age 9):</span>
                        <span className="text-slate-200">
                          {formatDualCurrency(r.childPriceEur, r.childPriceLocal, r.localCurrencySymbol)}
                        </span>
                      </div>
                    </div>

                    {/* Promo mention */}
                    {r.activePromos && (
                      <div className="mt-2.5 text-[10px] text-amber-400/90 line-clamp-2">
                        {r.activePromos}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Category Footer Note */}
            <div className="border-t border-slate-800/80 px-5 py-3 text-[11px] text-slate-400 bg-slate-950/30 rounded-b-xl">
              {cat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
