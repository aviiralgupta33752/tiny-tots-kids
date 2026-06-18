// Supabase Edge Function: weekly-report
// Sends a weekly progress report email to every parent who has a child profile,
// using stats synced to user_metadata by the app (see syncStatsToSupabase.ts).
//
// Trigger this weekly using a free cron service like cron-job.org, pointed at:
//   https://<your-project-ref>.supabase.co/functions/v1/weekly-report
// with header: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY or anon key with proper RLS>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  try {
    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing required environment secrets" }), { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      const meta = user.user_metadata || {};
      const childName = meta.child_name;
      const stats = meta.stats;
      const email = user.email;

      if (!email || !childName || !stats) {
        skipped++;
        continue;
      }

      const html = buildReportHtml(childName, stats);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Tiny Tots <reports@tinytotskids.app>",
          to: [email],
          subject: `${childName}'s Weekly Learning Report 🌈`,
          html,
        }),
      });

      if (res.ok) {
        sent++;
      } else {
        const errText = await res.text();
        console.error(`Failed to send to ${email}:`, errText);
        skipped++;
      }
    }

    return new Response(JSON.stringify({ sent, skipped }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});

function buildReportHtml(childName: string, stats: any): string {
  const rows = [
    ["⭐ Total Stars", stats.stars ?? 0],
    ["🔥 Day Streak", stats.streak ?? 0],
    ["✍️ Words Spelled", stats.spellWords ?? 0],
    ["➕ Math Problems Solved", stats.mathCorrect ?? 0],
    ["🎵 Rhymes Found", stats.rhymeCorrect ?? 0],
    ["🔢 Counting Correct", stats.countCorrect ?? 0],
    ["✏️ Letters Traced", stats.lettersTraced ?? 0],
    ["📖 Stories Read", stats.storiesRead ?? 0],
    ["🐾 Animals Explored", stats.animalsHeard ?? 0],
  ];

  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f3e8ff;">${label}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f3e8ff;text-align:right;font-weight:700;">${value}</td>
    </tr>
  `).join("");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${childName}'s Weekly Report</title>
  </head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);max-width:600px;width:100%;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:40px 32px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:28px;letter-spacing:-0.5px;">🌈 Tiny Tots</h1>
                <p style="margin:8px 0 0;font-size:16px;opacity:0.92;">${childName}'s Weekly Report</p>
              </td>
            </tr>
            <!-- Stats -->
            <tr>
              <td style="padding:32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tbody>
                    ${rowsHtml}
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- Message -->
            <tr>
              <td style="padding:0 32px 32px;text-align:center;color:#475569;font-size:15px;line-height:1.6;">
                <p>Great work this week, ${childName}! Keep practicing every day to earn more stars and unlock new badges. 🎉</p>
              </td>
            </tr>
            <!-- CTA -->
            <tr>
              <td style="padding:0 32px 32px;text-align:center;">
                <a href="https://tiny-tots-kids.lovable.app" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;font-size:15px;">Open Tiny Tots →</a>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px;background:#f8fafc;text-align:center;color:#94a3b8;font-size:12px;">
                <p style="margin:0;">You're receiving this because you signed up for Tiny Tots. No ads, no spam — just your child's progress.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
