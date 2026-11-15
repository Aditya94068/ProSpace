// =====================================================================
// SUPABASE EDGE FUNCTION: GITHUB WEBHOOK HANDLER
// Path: supabase/functions/github-webhook/index.ts
// Runtime: Deno / TypeScript (Supabase Edge Runtime)
// Description: Ingests GitHub webhook events with HMAC-SHA256 signature verification
// =====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const GITHUB_WEBHOOK_SECRET = Deno.env.get("GITHUB_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Verify GitHub HMAC-SHA256 Webhook Signature
async function verifySignature(payload: string, signatureHeader: string | null, secret: string): Promise<boolean> {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }
  const expectedSignature = signatureHeader.replace("sha256=", "");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
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

  return hexSignature === expectedSignature;
}

serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Hub-Signature-256, X-GitHub-Event",
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
    const signature = req.headers.get("X-Hub-Signature-256");
    const eventType = req.headers.get("X-GitHub-Event") || "ping";

    // Enforce HMAC-SHA256 signature verification when secret is configured
    if (GITHUB_WEBHOOK_SECRET) {
      const isValid = await verifySignature(rawBody, signature, GITHUB_WEBHOOK_SECRET);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const payload = JSON.parse(rawBody);

    // Initial Ping event from GitHub
    if (eventType === "ping") {
      return new Response(JSON.stringify({ message: "ProSpace webhook connection verified", zen: payload.zen }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase Admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Process Push event
    if (eventType === "push") {
      const repoFullName = payload.repository?.full_name;
      const ref = payload.ref; // e.g. "refs/heads/main"
      const branch = ref?.replace("refs/heads/", "");
      const headCommit = payload.head_commit;

      if (repoFullName && headCommit) {
        // Find linked project repository
        const { data: repoRecord } = await supabase
          .from("github_repositories")
          .select("id, workspace_id, project_id")
          .eq("full_name", repoFullName)
          .single();

        if (repoRecord) {
          // Update last synced timestamp
          await supabase
            .from("github_repositories")
            .update({
              last_synced_at: new Date().toISOString(),
              default_branch: payload.repository?.default_branch || branch,
            })
            .eq("id", repoRecord.id);

          // Log workspace activity
          await supabase.from("activities").insert({
            workspace_id: repoRecord.workspace_id,
            project_id: repoRecord.project_id,
            user_id: payload.sender?.id?.toString() || repoRecord.workspace_id,
            action_type: "github_push",
            entity_type: "integration",
            entity_id: repoRecord.id,
            metadata: {
              commit_id: headCommit.id?.substring(0, 7),
              commit_message: headCommit.message,
              author: headCommit.author?.name || payload.sender?.login,
              branch,
              url: headCommit.url,
            },
          });
        }
      }
    }

    return new Response(JSON.stringify({ status: "processed", event: eventType }), {
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
