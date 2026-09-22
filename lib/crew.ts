import { getSupabase } from "./supabase";

// Real shared crew board, backed by Supabase (crews + crew_members tables).
// No auth: anyone with the /crew/CODE link can read and join. Codes are
// 6 chars from a confusable-free alphabet.

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function makeCrewCode(): string {
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  let s = "";
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
  return s;
}

export interface CrewMember {
  id: string;
  archetype_id: string;
  dna: number[];
  display_name: string | null;
  email: string | null;
  created_at: string;
}

export interface CrewIdentity {
  archetypeId: string;
  dna: number[];
  displayName: string;
  email: string | null;
}

// Last crew failure reason, for honest error messages instead of guessing.
// "not-configured" = Supabase env vars missing at build time (no request sent).
// Anything else = the request went out and Supabase (or the network) said no.
let lastCrewError: string | null = null;
export function getLastCrewError(): string | null {
  return lastCrewError;
}
function fail(reason: string): false {
  lastCrewError = reason;
  // Always log the real error — the UI message stays short, the console has truth.
  // eslint-disable-next-line no-console
  console.error("[crew]", reason);
  return false;
}

// Creates the crew and adds the creator as the first member.
export async function createCrew(
  code: string,
  archetypeId: string,
  dna: number[]
): Promise<boolean> {
  const c = getSupabase();
  if (!c) return fail("not-configured: Supabase env vars missing (no request sent)");
  try {
    const { error } = await c.from("crews").insert({ code });
    if (error) return fail(`crews insert: ${error.message} (${error.code})`);
    return joinCrew(code, archetypeId, dna);
  } catch (e) {
    return fail(`crews request threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Identity-based join. Each email maps to their LATEST result within a crew:
// re-joining with the same email updates the row instead of duplicating it.
export async function joinCrewWithIdentity(
  code: string,
  identity: CrewIdentity
): Promise<boolean> {
  const c = getSupabase();
  if (!c) return fail("not-configured: Supabase env vars missing (no request sent)");
  const CODE = code.toUpperCase();
  try {
    if (identity.email) {
      const { data: existing, error: selError } = await c
        .from("crew_members")
        .select("id")
        .eq("crew_code", CODE)
        .eq("email", identity.email)
        .limit(1)
        .maybeSingle();
      if (selError) return fail(`members lookup: ${selError.message} (${selError.code})`);
      if (existing) {
        const { error } = await c
          .from("crew_members")
          .update({
            archetype_id: identity.archetypeId,
            dna: identity.dna,
            display_name: identity.displayName,
          })
          .eq("id", (existing as { id: string }).id);
        if (error) return fail(`members rejoin update: ${error.message} (${error.code})`);
        return true;
      }
    }
    const { error } = await c.from("crew_members").insert({
      crew_code: CODE,
      archetype_id: identity.archetypeId,
      dna: identity.dna,
      display_name: identity.displayName,
      email: identity.email,
    });
    if (error) return fail(`members insert: ${error.message} (${error.code})`);
    return true;
  } catch (e) {
    return fail(`members request threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function joinCrew(
  code: string,
  archetypeId: string,
  dna: number[]
): Promise<boolean> {
  return joinCrewWithIdentity(code, {
    archetypeId,
    dna,
    displayName: archetypeId,
    email: null,
  });
}

export async function getCrewMembers(code: string): Promise<CrewMember[] | null> {
  const c = getSupabase();
  if (!c) return null;
  try {
    const { data, error } = await c
      .from("crew_members")
      .select("id,archetype_id,dna,display_name,email,created_at")
      .eq("crew_code", code.toUpperCase())
      .order("created_at", { ascending: true });
    if (error) return null;
    return (data || []) as CrewMember[];
  } catch {
    return null;
  }
}

// --- localStorage helpers (per-device join state) ---

const JOINED_KEY = "crux8-crews-joined";
const CREATED_KEY = "crux8-crews-created";
const PENDING_KEY = "crux8-pending-crew";

export function hasJoinedCrew(code: string): boolean {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(JOINED_KEY) || "[]");
    return list.includes(code.toUpperCase());
  } catch {
    return false;
  }
}

export function markJoinedCrew(code: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(JOINED_KEY) || "[]");
    const up = code.toUpperCase();
    if (!list.includes(up)) localStorage.setItem(JOINED_KEY, JSON.stringify([...list, up]));
  } catch {
    /* ignore */
  }
}

export function getJoinedCrews(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(JOINED_KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function getCreatedCrews(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(CREATED_KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function markCreatedCrew(code: string) {
  try {
    const list = getCreatedCrews();
    const up = code.toUpperCase();
    if (!list.includes(up))
      localStorage.setItem(CREATED_KEY, JSON.stringify([...list, up]));
  } catch {
    /* ignore */
  }
}

export function setPendingCrew(code: string | null) {
  try {
    if (code) localStorage.setItem(PENDING_KEY, code.toUpperCase());
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

export function getPendingCrew(): string | null {
  try {
    return localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}
