// =====================================================================
// SUPABASE EDGE FUNCTION: VERCEL DEPLOYMENT WEBHOOK HANDLER
// Path: supabase/functions/vercel-webhook/index.ts
// Runtime: Deno / TypeScript (Supabase Edge Runtime)
// Description: Ingests Vercel deployment events and updates PostgreSQL deployments table
// =====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const VERCEL_WEBHOOK_SECRET = Deno.env.get("VERCEL_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Verify Vercel SHA-1 HMAC Webhook Signature
async function verifyVercelSignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const hexSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hexSignature === signature;
}

serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-vercel-signature",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-vercel-signature");

    if (VERCEL_WEBHOOK_SECRET) {
      const isValid = await verifyVercelSignature(rawBody, signature, VERCEL_WEBHOOK_SECRET);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid Vercel signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const payload = JSON.parse(rawBody);
    const { type, payload: deploymentData } = payload;

    // Map Vercel deployment statuses
    let deploymentStatus = "BUILDING";
    if (type === "deployment.succeeded") deploymentStatus = "READY";
    else if (type === "deployment.error") deploymentStatus = "ERROR";
    else if (type === "deployment.canceled") deploymentStatus = "CANCELED";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find linked project by project name or alias
    const deploymentId = deploymentData?.deployment?.id || deploymentData?.id;
    const projectUrl = deploymentData?.deployment?.url || deploymentData?.url;
    const projectName = deploymentData?.project?.name;

    if (deploymentId && projectUrl) {
      // Find matching project in ProSpace
      const { data: projectRecord } = await supabase
        .from("projects")
        .select("id, workspace_id")
        .ilike("name", `%${projectName}%`)
        .limit(1)
        .single();

      if (projectRecord) {
        // Upsert deployment record
        await supabase.from("deployments").upsert(
          {
            project_id: projectRecord.id,
            vercel_deployment_id: deploymentId,
            url: `https://${projectUrl}`,
            status: deploymentStatus as any,
            commit_hash: deploymentData?.meta?.githubCommitSha?.substring(0, 7) || null,
            commit_message: deploymentData?.meta?.githubCommitMessage || null,
            branch: deploymentData?.meta?.githubCommitRef || "main",
            creator_name: deploymentData?.creator?.username || "Vercel CI/CD",
            deployed_at: new Date().toISOString(),
          },
          { onConflict: "vercel_deployment_id" }
        );

        // Record activity
        await supabase.from("activities").insert({
          workspace_id: projectRecord.workspace_id,
          project_id: projectRecord.id,
          user_id: projectRecord.workspace_id, // System activity
          action_type: `vercel_deployment_${deploymentStatus.toLowerCase()}`,
          entity_type: "deployment",
          entity_id: projectRecord.id,
          metadata: {
            deployment_id: deploymentId,
            url: `https://${projectUrl}`,
            status: deploymentStatus,
          },
        });
      }
    }

    return new Response(JSON.stringify({ status: "success", deploymentStatus }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
