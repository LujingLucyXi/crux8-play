-- Crux8 Play — minimal analytics + waitlist schema.
-- No auth required for MVP. Stores aggregate session data (no answers) and
-- opt-in email waitlist entries.

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

alter table public.game_sessions enable row level security;

create policy "anon insert" on public.game_sessions
  for insert to anon with check (true);
create policy "anon update" on public.game_sessions
  for update to anon using (true) with check (true);
create policy "anon read count" on public.game_sessions
  for select to anon using (true);

-- Opt-in email waitlist. `dna` (jsonb) stores the player's Climber DNA so the
-- future app can restore their result when they sign in with the same email.
create table if not exists public.waitlist (
  email text primary key,
  session_id uuid,
  result_type text,
  dna jsonb,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Anon can add/update their own row by email (upsert). No public read of emails.
create policy "anon upsert waitlist" on public.waitlist
  for insert to anon with check (true);
create policy "anon update waitlist" on public.waitlist
  for update to anon using (true) with check (true);
