import { EmailBriefingData } from '../types/tickets';
import { formatDualCurrency } from './priceAnalyzer';

/**
 * Generates the clean markdown/plain-text representation matching the exact prompt structure
 */
export const generatePlainTextEmail = (data: EmailBriefingData): string => generateMarkdownEmail(data);

export function generateMarkdownEmail(data: EmailBriefingData): string {
  const { reportDate, travelWindow, party, bestDeals, matrixRows, keyTakeaways, activePromosSummary } = data;

  const b2p5 = bestDeals.twoPark.fiveDay;
  const b2p7 = bestDeals.twoPark.sevenDay;
  const b3p5 = bestDeals.threePark.fiveDay;
  const b3p7 = bestDeals.threePark.sevenDay;
  const b4p5 = bestDeals.fourPark.fiveDay;
  const b4p7 = bestDeals.fourPark.sevenDay;

  let md = `Subject Line: "Weekly Universal Orlando Ticket Price Briefing - ${reportDate}"\n\n`;
  md += `--------------------------------------------------\n`;
  md += `WEEKLY UNIVERSAL TICKET PRICE REPORT\n`;
  md += `Travel Window: ${travelWindow}\n`;
  md += `Party: ${party}\n`;
  md += `--------------------------------------------------\n\n`;

  md += `### BEST DEALS OVERVIEW (Lowest Price Found Across All Vendors)\n\n`;

  md += `#### 1. TWO-PARK PASSES (Universal Studios + Islands of Adventure)\n`;
  md += `- 5-Day Pass: Best Price ${formatDualCurrency(b2p5.totalEur, b2p5.totalPriceLocal, b2p5.localCurrencySymbol)} (${b2p5.vendorName} - Start Date: ${b2p5.startDate})\n`;
  md += `  - Breakdown: 2x Adult ${formatDualCurrency(b2p5.adultPriceEur, b2p5.adultPriceLocal, b2p5.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b2p5.childPriceEur, b2p5.childPriceLocal, b2p5.localCurrencySymbol)}\n`;
  md += `- 7-Day Pass: Best Price ${formatDualCurrency(b2p7.totalEur, b2p7.totalPriceLocal, b2p7.localCurrencySymbol)} (${b2p7.vendorName} - Start Date: ${b2p7.startDate})\n`;
  md += `  - Breakdown: 2x Adult ${formatDualCurrency(b2p7.adultPriceEur, b2p7.adultPriceLocal, b2p7.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b2p7.childPriceEur, b2p7.childPriceLocal, b2p7.localCurrencySymbol)}\n\n`;

  md += `#### 2. THREE-PARK PASSES (US + Islands of Adventure + Volcano Bay / Epic)\n`;
  md += `- 5-Day Pass: Best Price ${formatDualCurrency(b3p5.totalEur, b3p5.totalPriceLocal, b3p5.localCurrencySymbol)} (${b3p5.vendorName} - Start Date: ${b3p5.startDate})\n`;
  md += `  - Breakdown: 2x Adult ${formatDualCurrency(b3p5.adultPriceEur, b3p5.adultPriceLocal, b3p5.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b3p5.childPriceEur, b3p5.childPriceLocal, b3p5.localCurrencySymbol)}\n`;
  md += `- 7-Day Pass / 14-Day Explorer: Best Price ${formatDualCurrency(b3p7.totalEur, b3p7.totalPriceLocal, b3p7.localCurrencySymbol)} (${b3p7.vendorName} - Start Date: ${b3p7.startDate})\n`;
  md += `  - Breakdown: 2x Adult ${formatDualCurrency(b3p7.adultPriceEur, b3p7.adultPriceLocal, b3p7.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b3p7.childPriceEur, b3p7.childPriceLocal, b3p7.localCurrencySymbol)}\n\n`;

  md += `#### 3. FOUR-PARK / ALL-PARKS PASSES (Including Epic Universe & Water Park)\n`;
  md += `- 5-Day / Multi-Day Option: Best Price ${formatDualCurrency(b4p5.totalEur, b4p5.totalPriceLocal, b4p5.localCurrencySymbol)} (${b4p5.vendorName} - Start Date: ${b4p5.startDate})\n`;
  md += `  - Breakdown: 2x Adult ${formatDualCurrency(b4p5.adultPriceEur, b4p5.adultPriceLocal, b4p5.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b4p5.childPriceEur, b4p5.childPriceLocal, b4p5.localCurrencySymbol)}\n`;
  md += `- 7-Day / 14-Day Explorer Option: Best Price ${formatDualCurrency(b4p7.totalEur, b4p7.totalPriceLocal, b4p7.localCurrencySymbol)} (${b4p7.vendorName} - Start Date: ${b4p7.startDate})\n`;
  md += `  - Breakdown: 2x Adult ${formatDualCurrency(b4p7.adultPriceEur, b4p7.adultPriceLocal, b4p7.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b4p7.childPriceEur, b4p7.childPriceLocal, b4p7.localCurrencySymbol)}\n\n`;

  md += `--------------------------------------------------\n`;
  md += `### VENDOR COMPARISON MATRIX (TOTAL COST FOR 3 PEOPLE)\n\n`;
  md += `| Vendor | Ticket Duration | Park Tier | Best Start Date | Total Price (€) |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  matrixRows.forEach((row) => {
    const formattedPrice = formatDualCurrency(row.totalEur, row.totalPriceLocal, row.localCurrencySymbol);
    md += `| ${row.vendorName} | ${row.durationLabel} | ${row.parkTier} | ${row.startDate} | ${formattedPrice} |\n`;
  });

  md += `\nKey Takeaway / Price Trend:\n`;
  keyTakeaways.forEach((t) => {
    md += `- ${t}\n`;
  });
  activePromosSummary.forEach((p) => {
    md += `- ${p.vendor}: ${p.promo}\n`;
  });

  return md;
}

/**
 * Generates email-client certified inline-styled responsive HTML email
 */
export function generateCleanHtmlEmail(data: EmailBriefingData): string {
  const { reportDate, travelWindow, party, subjectLine, bestDeals, matrixRows, keyTakeaways, activePromosSummary } = data;

  const b2p5 = bestDeals.twoPark.fiveDay;
  const b2p7 = bestDeals.twoPark.sevenDay;
  const b3p5 = bestDeals.threePark.fiveDay;
  const b3p7 = bestDeals.threePark.sevenDay;
  const b4p5 = bestDeals.fourPark.fiveDay;
  const b4p7 = bestDeals.fourPark.sevenDay;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>${subjectLine}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #0f172a;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .email-container {
      max-width: 680px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .tabular {
      font-variant-numeric: tabular-nums;
      font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace;
    }
    @media only screen and (max-width: 620px) {
      .mobile-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
      }
      .mobile-hide {
        display: none !important;
      }
      .mobile-text-sm {
        font-size: 13px !important;
      }
      .mobile-price-lg {
        font-size: 18px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #f1f5f9;">

  <!-- Main Container -->
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center">

        <table role="presentation" class="email-container" width="680" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 680px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">

          <!-- Preheader / Top Utility Bar -->
          <tr>
            <td style="background-color: #0a1128; padding: 12px 28px; border-bottom: 2px solid #d97706;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
                    Universal Orlando Resort · Automated Price Monitor
                  </td>
                  <td align="right" style="color: #cbd5e1; font-size: 11px; font-weight: 500;">
                    Scheduled Friday Briefing · ${reportDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td class="mobile-padding" style="background-color: #0f172a; padding: 32px 28px 28px 28px; color: #ffffff;">
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; line-height: 1.25;">
                WEEKLY UNIVERSAL TICKET PRICE REPORT
              </h1>
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 14px; background-color: #1e293b; border-radius: 6px; border: 1px solid #334155;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="mobile-stack" style="padding: 4px 0; font-size: 13px; color: #cbd5e1;">
                          <strong style="color: #f8fafc;">Travel Window:</strong> ${travelWindow}
                        </td>
                        <td class="mobile-stack" align="right" style="padding: 4px 0; font-size: 13px; color: #cbd5e1;">
                          <strong style="color: #f8fafc;">Party:</strong> ${party}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section Divider Line -->
          <tr>
            <td style="height: 1px; background-color: #e2e8f0;"></td>
          </tr>

          <!-- BEST DEALS OVERVIEW -->
          <tr>
            <td class="mobile-padding" style="padding: 28px 28px 8px 28px;">
              <h2 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">
                BEST DEALS OVERVIEW (Lowest Price Found Across All Vendors)
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">
                Calculated for 2 Adults + 1 Child (Age 9) across all authorized brokers and official channels.
              </p>

              <!-- Category 1: TWO-PARK PASSES -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                      1. TWO-PARK PASSES (Universal Studios + Islands of Adventure)
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <!-- 5-Day Pass -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 14px; color: #0f172a; line-height: 1.4;">
                        <strong>5-Day Pass:</strong> Best Price <span style="font-size: 16px; font-weight: 700; color: #059669;" class="tabular">${formatDualCurrency(b2p5.totalEur, b2p5.totalPriceLocal, b2p5.localCurrencySymbol)}</span>
                        <span style="color: #475569;">(${b2p5.vendorName} - Start Date: ${b2p5.startDate})</span>
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 12px; border-left: 2px solid #cbd5e1;">
                        Breakdown: 2x Adult ${formatDualCurrency(b2p5.adultPriceEur, b2p5.adultPriceLocal, b2p5.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b2p5.childPriceEur, b2p5.childPriceLocal, b2p5.localCurrencySymbol)}
                      </div>
                    </div>
                    <!-- 7-Day Pass -->
                    <div>
                      <div style="font-size: 14px; color: #0f172a; line-height: 1.4;">
                        <strong>7-Day Pass:</strong> Best Price <span style="font-size: 16px; font-weight: 700; color: #059669;" class="tabular">${formatDualCurrency(b2p7.totalEur, b2p7.totalPriceLocal, b2p7.localCurrencySymbol)}</span>
                        <span style="color: #475569;">(${b2p7.vendorName} - Start Date: ${b2p7.startDate})</span>
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 12px; border-left: 2px solid #cbd5e1;">
                        Breakdown: 2x Adult ${formatDualCurrency(b2p7.adultPriceEur, b2p7.adultPriceLocal, b2p7.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b2p7.childPriceEur, b2p7.childPriceLocal, b2p7.localCurrencySymbol)}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Category 2: THREE-PARK PASSES -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                      2. THREE-PARK PASSES (US + Islands of Adventure + Volcano Bay / Epic)
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <!-- 5-Day Pass -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 14px; color: #0f172a; line-height: 1.4;">
                        <strong>5-Day Pass:</strong> Best Price <span style="font-size: 16px; font-weight: 700; color: #059669;" class="tabular">${formatDualCurrency(b3p5.totalEur, b3p5.totalPriceLocal, b3p5.localCurrencySymbol)}</span>
                        <span style="color: #475569;">(${b3p5.vendorName} - Start Date: ${b3p5.startDate})</span>
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 12px; border-left: 2px solid #cbd5e1;">
                        Breakdown: 2x Adult ${formatDualCurrency(b3p5.adultPriceEur, b3p5.adultPriceLocal, b3p5.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b3p5.childPriceEur, b3p5.childPriceLocal, b3p5.localCurrencySymbol)}
                      </div>
                    </div>
                    <!-- 7-Day / 14-Day Explorer Pass -->
                    <div>
                      <div style="font-size: 14px; color: #0f172a; line-height: 1.4;">
                        <strong>7-Day Pass / 14-Day Explorer:</strong> Best Price <span style="font-size: 16px; font-weight: 700; color: #059669;" class="tabular">${formatDualCurrency(b3p7.totalEur, b3p7.totalPriceLocal, b3p7.localCurrencySymbol)}</span>
                        <span style="color: #475569;">(${b3p7.vendorName} - Start Date: ${b3p7.startDate})</span>
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 12px; border-left: 2px solid #cbd5e1;">
                        Breakdown: 2x Adult ${formatDualCurrency(b3p7.adultPriceEur, b3p7.adultPriceLocal, b3p7.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b3p7.childPriceEur, b3p7.childPriceLocal, b3p7.localCurrencySymbol)}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Category 3: FOUR-PARK / ALL-PARKS PASSES -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                      3. FOUR-PARK / ALL-PARKS PASSES (Including Epic Universe & Water Park)
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <!-- 5-Day / Multi-Day Option -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 14px; color: #0f172a; line-height: 1.4;">
                        <strong>5-Day / Multi-Day Option:</strong> Best Price <span style="font-size: 16px; font-weight: 700; color: #059669;" class="tabular">${formatDualCurrency(b4p5.totalEur, b4p5.totalPriceLocal, b4p5.localCurrencySymbol)}</span>
                        <span style="color: #475569;">(${b4p5.vendorName} - Start Date: ${b4p5.startDate})</span>
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 12px; border-left: 2px solid #cbd5e1;">
                        Breakdown: 2x Adult ${formatDualCurrency(b4p5.adultPriceEur, b4p5.adultPriceLocal, b4p5.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b4p5.childPriceEur, b4p5.childPriceLocal, b4p5.localCurrencySymbol)}
                      </div>
                    </div>
                    <!-- 7-Day / 14-Day Explorer Option -->
                    <div>
                      <div style="font-size: 14px; color: #0f172a; line-height: 1.4;">
                        <strong>7-Day / 14-Day Explorer Option:</strong> Best Price <span style="font-size: 16px; font-weight: 700; color: #059669;" class="tabular">${formatDualCurrency(b4p7.totalEur, b4p7.totalPriceLocal, b4p7.localCurrencySymbol)}</span>
                        <span style="color: #475569;">(${b4p7.vendorName} - Start Date: ${b4p7.startDate})</span>
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 12px; border-left: 2px solid #cbd5e1;">
                        Breakdown: 2x Adult ${formatDualCurrency(b4p7.adultPriceEur, b4p7.adultPriceLocal, b4p7.localCurrencySymbol)}, 1x Child ${formatDualCurrency(b4p7.childPriceEur, b4p7.childPriceLocal, b4p7.localCurrencySymbol)}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Section Divider Line -->
          <tr>
            <td style="height: 1px; background-color: #e2e8f0;"></td>
          </tr>

          <!-- VENDOR COMPARISON MATRIX -->
          <tr>
            <td class="mobile-padding" style="padding: 24px 28px 24px 28px;">
              <h2 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">
                VENDOR COMPARISON MATRIX (TOTAL COST FOR 3 PEOPLE)
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b;">
                Ranked by vendor pricing in Euros (€) with native currency conversion ($ or £) in brackets.
              </p>

              <!-- Comparison Table -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; font-size: 13px;">
                <thead>
                  <tr style="background-color: #0f172a; color: #ffffff;">
                    <th align="left" style="padding: 10px 12px; font-weight: 600; font-size: 12px;">Vendor</th>
                    <th align="left" style="padding: 10px 12px; font-weight: 600; font-size: 12px;">Ticket Duration</th>
                    <th align="left" style="padding: 10px 12px; font-weight: 600; font-size: 12px;">Park Tier</th>
                    <th align="left" style="padding: 10px 12px; font-weight: 600; font-size: 12px;">Best Start Date</th>
                    <th align="right" style="padding: 10px 12px; font-weight: 600; font-size: 12px;">Total Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  ${matrixRows
                    .map((row, idx) => {
                      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                      const formatted = formatDualCurrency(row.totalEur, row.totalPriceLocal, row.localCurrencySymbol);
                      const isBestDeal = [b2p5, b2p7, b3p5, b3p7, b4p5, b4p7].some((b) => b.id === row.id);
                      return `
                  <tr style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 12px; font-weight: ${isBestDeal ? '600' : '500'}; color: #0f172a;">
                      ${row.vendorName}
                      ${isBestDeal ? '<span style="font-size: 10px; color: #059669; margin-left: 4px; font-weight: 700;">★ BEST</span>' : ''}
                    </td>
                    <td style="padding: 10px 12px; color: #334155;">${row.durationLabel}</td>
                    <td style="padding: 10px 12px; color: #334155;">${row.parkTier}</td>
                    <td style="padding: 10px 12px; color: #475569;" class="tabular">${row.startDate}</td>
                    <td align="right" style="padding: 10px 12px; font-weight: 700; color: ${isBestDeal ? '#059669' : '#0f172a'};" class="tabular">
                      ${formatted}
                    </td>
                  </tr>`;
                    })
                    .join('')}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Section Divider Line -->
          <tr>
            <td style="height: 1px; background-color: #e2e8f0;"></td>
          </tr>

          <!-- Key Takeaway / Price Trend -->
          <tr>
            <td class="mobile-padding" style="padding: 24px 28px 28px 28px; background-color: #f8fafc;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                Key Takeaway / Price Trend:
              </h3>
              <ul style="margin: 0 0 16px 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
                ${keyTakeaways.map((t) => `<li style="margin-bottom: 6px;">${t}</li>`).join('')}
              </ul>

              <h4 style="margin: 12px 0 8px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                Active Vendor Promos & Booking Perks:
              </h4>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
                ${activePromosSummary.map((p) => `<li style="margin-bottom: 6px;"><strong>${p.vendor}:</strong> ${p.promo}</li>`).join('')}
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 28px; color: #94a3b8; font-size: 11px; line-height: 1.5; border-top: 1px solid #1e293b;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-weight: 600; color: #cbd5e1;">
                      AUTOMATED TICKET MONITOR · DISPATCH NOTICE
                    </p>
                    <p style="margin: 0 0 8px 0;">
                      This report is generated automatically every <strong>Friday at 09:00 AM</strong>. Monitored for 2 Adults + 1 Child (Age 9), June 20 – July 01, 2027. Prices reflect verified gate and broker rates at time of scan and include all mandatory taxes & fees.
                    </p>
                    <p style="margin: 0; color: #64748b;">
                      Universal Studios Florida · Universal's Islands of Adventure · Universal Volcano Bay · Universal Epic Universe
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
