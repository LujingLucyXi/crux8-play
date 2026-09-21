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
  created_at: string;
}

// Creates the crew and adds the creator as the first member.
export async function createCrew(
  code: string,
  archetypeId: string,
  dna: number[]
): Promise<boolean> {
  const c = getSupabase();
  if (!c) return false;
  try {
    const { error } = await c.from("crews").insert({ code });
    if (error) return false;
    return joinCrew(code, archetypeId, dna);
  } catch {
    return false;
  }
}

export async function joinCrew(
  code: string,
  archetypeId: string,
  dna: number[]
): Promise<boolean> {
  const c = getSupabase();
  if (!c) return false;
  try {
    const { error } = await c.from("crew_members").insert({
      crew_code: code,
      archetype_id: archetypeId,
      dna,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function getCrewMembers(code: string): Promise<CrewMember[] | null> {
  const c = getSupabase();
  if (!c) return null;
  try {
    const { data, error } = await c
      .from("crew_members")
      .select("id,archetype_id,dna,created_at")
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
