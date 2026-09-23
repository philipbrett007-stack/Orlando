export type ParkTier = '2-Park' | '3-Park' | '4-Park';

export type TicketDuration = '5-Day' | '7-Day';

export interface Vendor {
  id: string;
  name: string;
  website: string;
  baseCurrency: 'EUR' | 'USD' | 'GBP';
  exchangeRateToEur: number; // e.g., USD: 1.09 (EUR = USD / 1.09), GBP: 0.84 (EUR = GBP / 0.84)
  trustScore: number;
  perks: string[];
}

export interface TicketPriceRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  parkTier: ParkTier;
  parkTierName: string; // e.g., "Universal Studios + Islands of Adventure"
  ticketDuration: TicketDuration;
  durationLabel: string; // e.g., "5-Day Pass" or "7-Day Pass / 14-Day Explorer"
  ticketOptionTitle: string; // e.g., "2-Park 5-Day Park-to-Park Dated Ticket"
  startDate: string; // "DD/MM/YYYY" e.g., "22/06/2027"
  adultPriceEur: number;
  childPriceEur: number; // Age 9
  totalEur: number; // 2 * adult + child
  localCurrencySymbol: string; // '$', '£', or '€'
  localCurrencyCode: 'USD' | 'GBP' | 'EUR';
  adultPriceLocal: number;
  childPriceLocal: number;
  totalPriceLocal: number;
  previousWeekTotalEur: number; // Price from 7 days ago
  deltaEur: number; // totalEur - previousWeekTotalEur
  activePromos: string;
  includesEpicUniverse: boolean;
  parkHopper: boolean;
  refundable: boolean;
  notes?: string;
}

export interface BestDealCategory {
  title: string;
  tier: ParkTier;
  duration: TicketDuration;
  label: string;
  record: TicketPriceRecord;
}

export interface EmailBriefingData {
  reportDate: string; // e.g. "25 September 2026"
  travelWindow: string; // "June 20, 2027 – July 01, 2027"
  party: string; // "2 Adults + 1 Child (Age 9)"
  subjectLine: string;
  bestDeals: {
    twoPark: {
      fiveDay: TicketPriceRecord;
      sevenDay: TicketPriceRecord;
    };
    threePark: {
      fiveDay: TicketPriceRecord;
      sevenDay: TicketPriceRecord;
    };
    fourPark: {
      fiveDay: TicketPriceRecord;
      sevenDay: TicketPriceRecord;
    };
  };
  matrixRows: TicketPriceRecord[];
  keyTakeaways: string[];
  activePromosSummary: { vendor: string; promo: string }[];
}

export interface ScheduledReportConfig {
  enabled: boolean;
  scheduleDay: 'Friday';
  scheduleTime: '09:00 AM';
  cronExpression: string;
  recipientEmail: string;
  ccEmail?: string;
  nextRunDate: string;
  lastRunDate?: string;
  alertOnDropOverEur: number;
}
