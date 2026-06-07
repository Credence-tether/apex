export const BRAND = {
  name: "Apex Asset Management",
  shortName: "APEX",
  color: "#00c9b1",
  bg: "#060c1a",
  sender: "support@apxfund.xyz",
  dashboard: "https://apexroi.vercel.app/dashboard",
  support: "https://apexroi.vercel.app/contact",
  terms: "https://apexroi.vercel.app/terms",
  privacy: "https://apexroi.vercel.app/privacy",
  year: new Date().getFullYear(),
};

export function baseLayout({
  badge,
  heroLabel,
  heroTitle,
  heroSubtitle,
  body,
  footerNote,
  accentColor = BRAND.color,
  headerBg = BRAND.bg,
}: {
  badge: string;
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  body: string;
  footerNote?: string;
  accentColor?: string;
  headerBg?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:${headerBg};padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:20px;font-weight:700;color:${accentColor};letter-spacing:3px;">
                  ${BRAND.shortName}<span style="color:#e2e8f0;font-weight:300;"> ASSET</span>
                </td>
                <td align="right">
                  <span style="font-size:10px;letter-spacing:2px;color:${accentColor};background:rgba(0,201,177,0.1);border:1px solid rgba(0,201,177,0.25);padding:4px 12px;border-radius:20px;font-family:monospace;">
                    ${badge}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td style="background:linear-gradient(135deg,${headerBg} 0%,#0d1a2e 100%);padding:44px 40px 36px;border-bottom:1px solid rgba(0,201,177,0.12);">
            <p style="margin:0 0 12px;font-size:10px;letter-spacing:3px;color:${accentColor};text-transform:uppercase;font-family:monospace;">${heroLabel}</p>
            <h1 style="margin:0 0 14px;font-size:26px;font-weight:400;color:#f1f5f9;line-height:1.35;">${heroTitle}</h1>
            <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.65;">${heroSubtitle}</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 40px;background:#ffffff;">
            ${body}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:${headerBg};padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:16px;margin-bottom:14px;">
              <tr>
                <td style="font-size:14px;font-weight:700;color:${accentColor};letter-spacing:3px;">${BRAND.shortName}</td>
                <td align="right">
                  <a href="${BRAND.dashboard}" style="font-size:11px;color:#64748b;text-decoration:none;margin-left:16px;">Dashboard</a>
                  <a href="${BRAND.support}" style="font-size:11px;color:#64748b;text-decoration:none;margin-left:16px;">Support</a>
                  <a href="${BRAND.terms}" style="font-size:11px;color:#64748b;text-decoration:none;margin-left:16px;">Terms</a>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:11px;color:#475569;line-height:1.6;">
              © ${BRAND.year} ${BRAND.name} &middot;
              <a href="mailto:${BRAND.sender}" style="color:${accentColor};text-decoration:none;">${BRAND.sender}</a>
              ${footerNote ? `&middot; ${footerNote}` : ""}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Reusable HTML snippets ──────────────────────────────────────────

export function statGrid(stats: { label: string; value: string; green?: boolean }[]): string {
  const cells = stats
    .map(
      (s) => `
    <td width="${Math.floor(100 / stats.length)}%" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        <tr><td style="padding:14px 16px;">
          <p style="margin:0 0 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;font-family:monospace;">${s.label}</p>
          <p style="margin:0;font-size:${s.value.length > 10 ? "13px" : "20px"};font-weight:600;color:${s.green ? "#00c9b1" : "#060c1a"};font-family:${s.value.length > 10 ? "monospace" : "inherit"};">${s.value}</p>
        </td></tr>
      </table>
    </td>`
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>${cells}</tr></table>`;
}

export function refRow(label: string, value: string, right?: { label: string; value: string; pill?: string; pillColor?: string }): string {
  const rightHtml = right
    ? right.pill
      ? `<td align="right"><p style="margin:0 0 4px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;font-family:monospace;">${right.label}</p><span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${right.pillColor || "#d1fae5"};color:${right.pillColor ? "#fff" : "#065f46"};">${right.pill}</span></td>`
      : `<td align="right"><p style="margin:0 0 4px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;font-family:monospace;">${right.label}</p><p style="margin:0;font-size:12px;font-family:monospace;color:#060c1a;">${right.value}</p></td>`
    : "";
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:12px 0;">
    <tr><td style="padding:14px 18px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;font-family:monospace;">${label}</p>
      <p style="margin:0;font-size:13px;font-family:monospace;font-weight:500;color:#060c1a;">${value}</p>
    </td>${rightHtml}</tr>
  </table>`;
}

export function alertBox(text: string, type: "info" | "warning" | "danger" = "info"): string {
  const colors = {
    info: { bg: "#f0fdf9", border: "#a7f3d0", left: "#00c9b1" },
    warning: { bg: "#fffbeb", border: "#fcd34d", left: "#f59e0b" },
    danger: { bg: "#fef2f2", border: "#fca5a5", left: "#ef4444" },
  };
  const c = colors[type];
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
    <tr><td style="background:${c.bg};border:1px solid ${c.border};border-left:4px solid ${c.left};border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">${text}</p>
    </td></tr>
  </table>`;
}

export function ctaButton(text: string, url: string, color = "#00c9b1"): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;">
    <tr><td align="center">
      <a href="${url}" style="display:inline-block;background:${color};color:${color === "#00c9b1" ? "#060c1a" : "#ffffff"};padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">${text}</a>
    </td></tr>
  </table>`;
}

export function divider(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="height:1px;background:#e2e8f0;"></td></tr></table>`;
}

export function stepList(steps: { title: string; body: string }[]): string {
  return steps
    .map(
      (s, i) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
      <tr valign="top">
        <td width="36" style="padding-top:2px;">
          <div style="width:26px;height:26px;border-radius:50%;background:rgba(0,201,177,0.1);border:1px solid rgba(0,201,177,0.3);text-align:center;line-height:26px;font-size:12px;font-weight:700;color:#00c9b1;font-family:monospace;">${i + 1}</div>
        </td>
        <td style="padding-left:8px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#060c1a;">${s.title}</p>
          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">${s.body}</p>
        </td>
      </tr>
    </table>`
    )
    .join("");
}

export function earningsTable(
  rows: { label: string; apy: string; principal: string; earned: string }[],
  totals: { principal: string; earned: string }
): string {
  const rowsHtml = rows
    .map(
      (r) => `
    <tr>
      <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151;">${r.label}</td>
      <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151;">${r.apy}</td>
      <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151;font-family:monospace;">${r.principal}</td>
      <td style="padding:11px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#059669;font-family:monospace;font-weight:600;">${r.earned}</td>
    </tr>`
    )
    .join("");
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
    <tr style="background:#f1f5f9;">
      <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;font-family:monospace;font-weight:500;">Investment</th>
      <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;font-family:monospace;font-weight:500;">APY</th>
      <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;font-family:monospace;font-weight:500;">Principal</th>
      <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;font-family:monospace;font-weight:500;">Earned</th>
    </tr>
    ${rowsHtml}
    <tr style="background:#f8fafc;">
      <td colspan="2" style="padding:12px 14px;font-size:13px;font-weight:700;color:#060c1a;">Total This Week</td>
      <td style="padding:12px 14px;font-size:13px;font-family:monospace;font-weight:700;color:#060c1a;">${totals.principal}</td>
      <td style="padding:12px 14px;font-size:13px;font-family:monospace;font-weight:700;color:#059669;">${totals.earned}</td>
    </tr>
  </table>`;
}

export function statusPill(text: string, type: "approved" | "pending" | "rejected" | "sent"): string {
  const styles = {
    approved: "background:#d1fae5;color:#065f46;",
    sent: "background:#d1fae5;color:#065f46;",
    pending: "background:#fef3c7;color:#92400e;",
    rejected: "background:#fee2e2;color:#991b1b;",
  };
  return `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.5px;${styles[type]}">${text}</span>`;
}

export function bodyText(text: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.7;">${text}</p>`;
}
