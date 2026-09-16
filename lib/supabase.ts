import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase is used ONLY for aggregate analytics (game_sessions).
// It is entirely optional: if env vars are missing or requests fail,
// the game still works perfectly. No auth required.

let client: SupabaseClient | null = null;
let attempted = false;

function getClient(): SupabaseClient | null {
  if (attempted) return client;
  attempted = true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    client = createClient(url, anon, { auth: { persistSession: false } });
  } catch {
    client = null;
  }
  return client;
}

export interface SessionRow {
  id: string;
  game_id: string;
  started_at: string;
  completed_at?: string | null;
  result_type?: string | null;
  share_clicked?: boolean;
  crux8_clicked?: boolean;
  referral_source?: string | null;
}

export async function recordSessionStart(row: SessionRow): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    await c.from("game_sessions").insert(row);
  } catch {
    /* analytics never blocks gameplay */
  }
}

export async function updateSession(
  id: string,
  patch: Partial<SessionRow>
): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    await c.from("game_sessions").update(patch).eq("id", id);
  } catch {
    /* ignore */
  }
}

// Returns the count of completed sessions, or null if unavailable.
export async function getPlayCount(): Promise<number | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const { count, error } = await c
      .from("game_sessions")
      .select("id", { count: "exact", head: true })
      .not("completed_at", "is", null);
    if (error) return null;
    return count ?? null;
  } catch {
    return null;
  }
}
