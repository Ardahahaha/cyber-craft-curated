import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cron/discovery")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey");
        if (!apiKey || apiKey !== process.env.SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { runDiscovery, rotateDailyTool } = await import("@/lib/discovery.server");
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // 1) Scrape GitHub and insert new pending tools
          const result = await runDiscovery();

          // 2) Auto-approve high-quality, non-sensitive tools so they can rotate publicly
          const { count: approvedCount } = await supabaseAdmin
            .from("discovered_tools")
            .update(
              { status: "approved", reviewed_at: new Date().toISOString() },
              { count: "exact" },
            )
            .eq("status", "pending")
            .eq("ethical", false)
            .gte("score", 70);

          // 3) Pick fresh daily tools (5 per day by default)
          const daily = await rotateDailyTool();

          return Response.json({
            ok: true,
            ...result,
            autoApproved: approvedCount ?? 0,
            dailyToolIds: daily.chosenIds,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return new Response(JSON.stringify({ ok: false, error: msg }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
