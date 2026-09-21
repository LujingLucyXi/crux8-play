-- Crux8 crew board — run once in the Supabase SQL editor.
-- Uses the same anon key the quiz already uses for analytics/waitlist.

create table if not exists crews (
  code text primary key,               -- 6-char share code, e.g. "K7Q2XD"
  created_at timestamptz not null default now()
);

create table if not exists crew_members (
  id uuid primary key default gen_random_uuid(),
  crew_code text not null references crews(code) on delete cascade,
  archetype_id text not null,          -- e.g. "dirtbag"
  dna jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists crew_members_crew_idx on crew_members (crew_code);

alter table crews enable row level security;
alter table crew_members enable row level security;

-- Anyone with the link can read a crew and join it. No updates/deletes.
drop policy if exists "anon read crews" on crews;
create policy "anon read crews" on crews for select to anon using (true);

drop policy if exists "anon create crews" on crews;
create policy "anon create crews" on crews for insert to anon with check (true);

drop policy if exists "anon read members" on crew_members;
create policy "anon read members" on crew_members for select to anon using (true);

drop policy if exists "anon join crews" on crew_members;
create policy "anon join crews" on crew_members for insert to anon with check (true);
