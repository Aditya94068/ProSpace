// =====================================================================
// SUPABASE EDGE FUNCTION: VERCEL OAUTH TOKEN EXCHANGE
// Path: supabase/functions/vercel-oauth/index.ts
// Runtime: Deno / TypeScript (Supabase Edge Runtime)
// Description: Secure server-side exchange of Vercel OAuth code
// =====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const VERCEL_CLIENT_ID = Deno.env.get("VERCEL_CLIENT_ID") || "";
const VERCEL_CLIENT_SECRET = Deno.env.get("VERCEL_CLIENT_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { code, workspace_id, user_id, redirect_uri } = await req.json();

    if (!code || !workspace_id) {
      return new Response(JSON.stringify({ error: "Missing OAuth code or workspace_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Exchange code with Vercel API
    const params = new URLSearchParams();
    params.append("client_id", VERCEL_CLIENT_ID);
    params.append("client_secret", VERCEL_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", redirect_uri || "");

    const tokenResponse = await fetch("https://api.vercel.com/v2/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const teamId = tokenData.team_id || null;

    // Store in Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    await supabase.from("vercel_integrations").upsert(
      {
        workspace_id,
        team_id: teamId,
        team_name: tokenData.user_id || "Vercel Team",
        installed_by: user_id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        team_id: teamId,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
