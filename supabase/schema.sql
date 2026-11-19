-- Dedicated MusicBrainz cache and global rate gate; no anonymous database access.
create table if not exists public.sampletrail_mb_cache (
  cache_key text primary key,
  payload jsonb not null,
  expires_at timestamptz not null
);
create table if not exists public.sampletrail_mb_gate (
  id boolean primary key default true check (id),
  next_at timestamptz not null default now(),
  usage_day date not null default current_date,
  used integer not null default 0
);
insert into public.sampletrail_mb_gate(id) values(true) on conflict do nothing;
alter table public.sampletrail_mb_cache enable row level security;
alter table public.sampletrail_mb_gate enable row level security;
revoke all on public.sampletrail_mb_cache, public.sampletrail_mb_gate from anon, authenticated;
grant select, insert, update, delete on public.sampletrail_mb_cache to service_role;
grant select, update on public.sampletrail_mb_gate to service_role;
create or replace function public.sampletrail_mb_claim() returns boolean
language sql security invoker set search_path = '' as $$
  with claimed as (
    update public.sampletrail_mb_gate
    set next_at = now() + interval '1.2 seconds',
        usage_day = current_date,
        used = case when usage_day <> current_date then 1 else used + 1 end
    where id = true and next_at <= now()
      and (usage_day <> current_date or used < 400)
    returning id
  ) select exists(select 1 from claimed);
$$;
revoke all on function public.sampletrail_mb_claim() from public, anon, authenticated;
grant execute on function public.sampletrail_mb_claim() to service_role;
