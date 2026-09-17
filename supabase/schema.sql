-- Crux8 Play — analytics + waitlist schema (matches the live Crux8 project).
-- No auth required. Stores aggregate session data (no answers) and opt-in
-- email waitlist entries. Policies target `public` so they apply to the anon
-- publishable key regardless of role mapping.

create table if not exists public.game_sessions (
  id uuid primary key,
  game_id text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  result_type text,
  share_clicked boolean default false,
  crux8_clicked boolean default false,
  referral_source text
);

create table if not exists public.waitlist (
  email text primary key,
  session_id uuid,
  result_type text,
  dna jsonb,
  created_at timestamptz not null default now()
);

alter table public.game_sessions enable row level security;
alter table public.waitlist enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.game_sessions to anon, authenticated;
-- Waitlist: insert only for anon. NO select grant/policy => emails stay private
-- (only readable in the Supabase dashboard). The app uses a plain insert and
-- treats a duplicate email (23505) as success, so no ON CONFLICT / select needed.
grant insert on public.waitlist to anon, authenticated;

-- game_sessions: open insert/update/select (aggregate analytics only, no PII)
drop policy if exists "anon insert" on public.game_sessions;
create policy "anon insert" on public.game_sessions for insert to public with check (true);
drop policy if exists "anon update" on public.game_sessions;
create policy "anon update" on public.game_sessions for update to public using (true) with check (true);
drop policy if exists "anon read count" on public.game_sessions;
create policy "anon read count" on public.game_sessions for select to public using (true);

-- waitlist: insert only (no select policy => no public reads of emails)
drop policy if exists "anon upsert waitlist" on public.waitlist;
create policy "anon insert waitlist" on public.waitlist for insert to public with check (true);
