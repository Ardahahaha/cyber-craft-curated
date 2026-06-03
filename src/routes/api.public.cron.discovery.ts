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
          const result = await runDiscovery();
          const daily = await rotateDailyTool();
          return Response.json({ ok: true, ...result, dailyToolId: daily.chosen });
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
