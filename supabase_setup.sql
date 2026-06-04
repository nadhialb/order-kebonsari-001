-- ============================================================
-- ORDER KEBONSARI — Setup Database Supabase
-- Jalankan di Supabase → SQL Editor → New query → Run
-- Aman dijalankan ulang (IF NOT EXISTS)
-- ============================================================

-- 1. Tabel minggu menu
create table if not exists weeks (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  data       jsonb not null
);

-- 2. Tabel checklist
create table if not exists checklist (
  id      uuid primary key default gen_random_uuid(),
  week_id uuid references weeks(id) on delete cascade,
  ck_data jsonb default '{}'
);

-- 3. Tabel stok sisa
create table if not exists stok (
  id      uuid primary key default gen_random_uuid(),
  week_id uuid references weeks(id) on delete cascade,
  items   jsonb default '[]'
);

-- 4. Tabel settings
create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

-- 5. Tabel kategori custom (bahan → kategori override)
create table if not exists custom_kategori (
  id         uuid primary key default gen_random_uuid(),
  bahan_key  text unique not null,  -- lowercase trim dari nama bahan
  bahan_name text not null,         -- nama asli untuk display
  kategori   text not null,
  updated_at timestamptz default now()
);

-- 6. Default settings
insert into settings (key, value) values
  ('sumber', '["Beli Sendiri","Stok Sendiri","Dapur Sempolan","Kejayan"]')
on conflict (key) do nothing;

-- 7. Row Level Security
alter table weeks           enable row level security;
alter table checklist       enable row level security;
alter table stok            enable row level security;
alter table settings        enable row level security;
alter table custom_kategori enable row level security;

-- 8. Policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename='weeks'           and policyname='allow_all_weeks')     then create policy "allow_all_weeks"     on weeks           for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='checklist'       and policyname='allow_all_checklist') then create policy "allow_all_checklist" on checklist       for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='stok'            and policyname='allow_all_stok')      then create policy "allow_all_stok"      on stok            for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='settings'        and policyname='allow_all_settings')  then create policy "allow_all_settings"  on settings        for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='custom_kategori' and policyname='allow_all_kat')       then create policy "allow_all_kat"       on custom_kategori for all using (true) with check (true); end if;
end $$;
