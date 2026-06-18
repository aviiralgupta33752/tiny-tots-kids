
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
      <td style="padding:10px 0;font-size:15px;color:#444;">${label}</td>
      <td style="padding:10px 0;font-size:15px;font-weight:700;text-align:right;color:#ff8fab;">${value}</td>
    </tr>
  `).join("");

  return `
  <div style="font-family:'Nunito',Arial,sans-serif;max-width:480px;margin:0 auto;background:#fffbf5;padding:32px;border-radius:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:40px;">🌈</div>
      <h1 style="color:#ff8fab;font-size:24px;margin:8px 0 0;">Tiny Tots</h1>
      <p style="color:#888;font-size:14px;margin:4px 0 0;">${childName}'s Weekly Report</p>
    </div>
    <div style="background:white;border-radius:16px;padding:20px 24px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rowsHtml}
      </table>
    </div>
    <p style="text-align:center;color:#666;font-size:14px;line-height:1.6;">
      Great work this week, ${childName}! Keep practicing every day to earn more stars and unlock new badges. 🎉
    </p>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://tiny-tots-kids.lovable.app" style="background:#ff8fab;color:white;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:700;font-size:14px;">Open Tiny Tots →</a>
    </div>
    <p style="text-align:center;color:#aaa;font-size:11px;margin-top:24px;">
      You're receiving this because you signed up for Tiny Tots. No ads, no spam — just your child's progress.
    </p>
  </div>
  `;
}
