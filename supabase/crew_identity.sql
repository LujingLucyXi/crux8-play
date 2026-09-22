-- Crew identity — run in the Supabase SQL editor AFTER crew.sql.
-- Adds display name + email to crew members so each person has an identity
-- and each email always points at their latest result.

alter table crew_members add column if not exists display_name text;
alter table crew_members add column if not exists email text;

create index if not exists crew_members_email_idx
  on crew_members (crew_code, email);
