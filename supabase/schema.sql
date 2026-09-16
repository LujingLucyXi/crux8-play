-- Crux8 Play — minimal analytics schema.
-- No auth required for MVP. Stores aggregate session data only (no answers, no PII).

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

-- Allow anonymous inserts/updates for MVP (analytics only, no sensitive data).
alter table public.game_sessions enable row level security;

create policy "anon insert" on public.game_sessions
  for insert to anon with check (true);

create policy "anon update" on public.game_sessions
  for update to anon using (true) with check (true);

create policy "anon read count" on public.game_sessions
  for select to anon using (true);
