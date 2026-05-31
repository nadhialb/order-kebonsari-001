-- ============================================================
-- ORDER KEBONSARI — Setup Database Supabase
-- Jalankan ini di Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1. Tabel minggu menu
create table if not exists weeks (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  data        jsonb not null  -- seluruh WD.days disimpan di sini
);

-- 2. Tabel checklist status (per minggu)
create table if not exists checklist (
  id          uuid primary key default gen_random_uuid(),
  week_id     uuid references weeks(id) on delete cascade,
  ck_data     jsonb default '{}'  -- object { "0_0": true, "0_1": false, ... }
);

-- 3. Tabel stok sisa
create table if not exists stok (
  id          uuid primary key default gen_random_uuid(),
  week_id     uuid references weeks(id) on delete cascade,
  items       jsonb default '[]'  -- array stok sisa
);

-- 4. Tabel settings (sumber keterangan, tema, dll)
create table if not exists settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz default now()
);

-- 5. Insert default sumber keterangan
insert into settings (key, value) values
  ('sumber', '["Beli Sendiri", "Stok Sendiri", "Dapur Sempolan", "Kejayan"]')
on conflict (key) do nothing;

-- 6. Enable Row Level Security (biar bisa diakses dari web)
alter table weeks    enable row level security;
alter table checklist enable row level security;
alter table stok     enable row level security;
alter table settings enable row level security;

-- 7. Policy: izinkan semua operasi dari anon key
create policy "allow_all_weeks"     on weeks     for all using (true) with check (true);
create policy "allow_all_checklist" on checklist  for all using (true) with check (true);
create policy "allow_all_stok"      on stok       for all using (true) with check (true);
create policy "allow_all_settings"  on settings   for all using (true) with check (true);
