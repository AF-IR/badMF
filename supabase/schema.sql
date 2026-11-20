-- ==================================================================
-- مجموعه تفریحی فاضل — اسکیمای کامل سوپابیس (نسخه حرفه‌ای Next.js)
-- اجرا در Supabase → SQL Editor
-- شامل: جدول‌ها، ایندکس‌ها، RLS مبتنی بر نقش ادمین، Trigger updated_at،
--       Bucket تصاویر (site-images) با پالیسی امن
-- ==================================================================

-- ------------------------- ۱) جدول‌ها -------------------------
create table if not exists categories (
  id        text primary key,
  name      text not null,
  icon      text not null default '🏅',
  desc      text default '',
  active    boolean not null default true,
  sort      int default 0,
  updated_at timestamptz default now()
);

create table if not exists tariffs (
  id         text primary key,
  categoryId text not null references categories(id) on delete cascade,
  title      text not null,
  unit       text default 'هر ساعت',
  price      int  not null default 0,
  note       text default '',
  updated_at timestamptz default now()
);

create table if not exists sessions (
  id         text primary key,
  categoryId text not null references categories(id) on delete cascade,
  day        int  not null check (day between 0 and 6),
  start      text not null,
  end        text not null,
  capacity   int  not null default 6,
  price      int  not null default 0,
  gender     text not null default 'مختلط' check (gender in ('مختلط','آقایان','بانوان')),
  active     boolean not null default true,
  updated_at timestamptz default now()
);

create table if not exists posts (
  id      text primary key,
  slug    text unique,
  title   text not null,
  tag     text default '',
  date    text default '',
  image   text default '',
  excerpt text default '',
  body    text default '',
  updated_at timestamptz default now()
);

create table if not exists testimonials (
  id    text primary key,
  name  text not null,
  text  text not null,
  active boolean not null default true,
  updated_at timestamptz default now()
);

create table if not exists bookings (
  id         text primary key,
  sessionId  text,
  categoryId text,
  categoryName text,
  day        int,
  start      text,
  end        text,
  gender     text default 'مختلط',
  name       text not null,
  phone      text not null,
  count      int not null default 1,
  amount     int not null default 0,
  status     text not null default 'pending'
             check (status in ('pending','paid','paid-demo','paid-manual','failed','canceled')),
  authority  text default '',
  refId      text default '',
  createdAt  timestamptz not null default now(),
  updated_at timestamptz default now()
);

create table if not exists settings (
  key   text primary key,
  value text,
  updated_at timestamptz default now()
);

-- ------------------------- ۲) ایندکس‌ها -------------------------
create index if not exists idx_tariffs_cat   on tariffs(categoryId);
create index if not exists idx_sessions_cat  on sessions(categoryId);
create index if not exists idx_sessions_day  on sessions(day) where active;
create index if not exists idx_posts_slug    on posts(slug);
create index if not exists idx_bookings_auth on bookings(authority);
create index if not exists idx_bookings_phone on bookings(phone);
create index if not exists idx_bookings_status on bookings(status);

-- ------------------------- ۳) Trigger به‌روزرسانی updated_at -------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['categories','tariffs','sessions','posts','testimonials','bookings','settings'] loop
    execute format('drop trigger if exists trg_%1$s_updated on %1$s', t);
    execute format('create trigger trg_%1$s_updated before update on %1$s for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- ------------------------- ۴) نقش ادمین (اختیاری اما حرفه‌ای) -------------------------
-- کاربر ادمین را در Authentication → Users بسازید (راهنما: docs/SETUP.md)
-- سپس اگر می‌خواهید فقط برخی کاربران ادمین باشند، ایمیل‌ها را اینجا ثبت کنید:
create or replace function is_admin() returns boolean as $$
  declare admin_emails text[] := array['admin@fazel-najafabad.ir'];
  begin
    return auth.uid() is not null and (auth.email()) = any(admin_emails);
  end;
$$ language plpgsql security definer;

-- ------------------------- ۵) فعال‌سازی RLS و پالیسی‌ها -------------------------
alter table categories   enable row level security;
alter table tariffs      enable row level security;
alter table sessions     enable row level security;
alter table posts        enable row level security;
alter table testimonials enable row level security;
alter table bookings     enable row level security;
alter table settings     enable row level security;

-- محتوای عمومی: همه می‌توانند بخوانند؛ فقط ادمین (کاربر لاگین‌شده) می‌تواند بنویسد
do $$
declare t text;
begin
  foreach t in array array['categories','tariffs','sessions','posts','testimonials'] loop
    execute format('drop policy if exists "public read %1$s" on %1$s', t);
    execute format('create policy "public read %1$s" on %1$s for select using (true)', t);

    execute format('drop policy if exists "admin write %1$s" on %1$s', t);
    execute format('create policy "admin write %1$s" on %1$s for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- تنظیمات: همه بخوانند؛ ادمین بنویسد (ADMIN_PASSWORD هرگز اینجا ذخیره نشود)
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);
drop policy if exists "admin write settings" on settings;
create policy "admin write settings" on settings for all using (is_admin()) with check (is_admin());

-- رزروها: مهمان فقط ثبت کند (insert)؛ خواندن/ویرایش فقط ادمین
drop policy if exists "anon insert bookings" on bookings;
create policy "anon insert bookings" on bookings for insert with check (true);
drop policy if exists "admin read bookings" on bookings;
create policy "admin read bookings" on bookings for select using (is_admin());
drop policy if exists "admin write bookings" on bookings;
create policy "admin write bookings" on bookings for update using (is_admin()) with check (is_admin());
drop policy if exists "admin delete bookings" on bookings;
create policy "admin delete bookings" on bookings for delete using (is_admin());

-- ------------------------- ۶) استوریج تصاویر -------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site-images" on storage.objects;
create policy "public read site-images" on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "admin upload site-images" on storage.objects;
create policy "admin upload site-images" on storage.objects for insert
  with check (bucket_id = 'site-images' and is_admin());

drop policy if exists "admin update site-images" on storage.objects;
create policy "admin update site-images" on storage.objects for update
  using (bucket_id = 'site-images' and is_admin());

drop policy if exists "admin delete site-images" on storage.objects;
create policy "admin delete site-images" on storage.objects for delete
  using (bucket_id = 'site-images' and is_admin());

-- ------------------------- ۷) داده اولیه (نمونه) -------------------------
-- در صورت خالی بودن، سایت داده‌های نمونه داخل کد را نشان می‌دهد؛
-- برای انتقال داده‌ها از پنل ادمین → داشبورد استفاده کنید.
insert into settings (key, value) values
  ('WORK_HOURS_RESTAURANT', 'همه‌روزه از ۱۲ تا ۲۳'),
  ('WORK_HOURS_CLUB', 'پس از افتتاح، ساعت کاری اعلام می‌شود')
on conflict (key) do nothing;
