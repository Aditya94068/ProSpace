// =====================================================================
// SUPABASE EDGE FUNCTION: GITHUB OAUTH TOKEN EXCHANGE
// Path: supabase/functions/github-oauth/index.ts
// Runtime: Deno / TypeScript (Supabase Edge Runtime)
// Description: Secure server-side exchange of OAuth code for access token
// =====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID") || "";
const GITHUB_CLIENT_SECRET = Deno.env.get("GITHUB_CLIENT_SECRET") || "";
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
    const { code, workspace_id, user_id } = await req.json();

    if (!code || !workspace_id) {
      return new Response(JSON.stringify({ error: "Missing OAuth code or workspace_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Exchange code with GitHub API
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const accessToken = tokenData.access_token;

    // Fetch GitHub User profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "ProSpace-SaaS",
      },
    });

    const ghUser = await userResponse.json();

    // Store in Supabase securely (Token is never returned to frontend)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    await supabase.from("github_integrations").upsert(
      {
        workspace_id,
        account_login: ghUser.login,
        account_avatar_url: ghUser.avatar_url,
        installed_by: user_id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id" }
    );

    // Return safe public identity only
    return new Response(
      JSON.stringify({
        success: true,
        account_login: ghUser.login,
        account_avatar_url: ghUser.avatar_url,
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
