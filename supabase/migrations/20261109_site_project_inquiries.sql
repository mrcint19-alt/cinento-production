-- Run in the dedicated CINENTO SITE Supabase project, after site_programs migration.
-- Existing dashboard records and homepage content are not modified.
create table if not exists public.site_project_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  message text not null check (char_length(message) between 20 and 4000),
  language text not null check (language in ('en', 'tr')),
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);
create index if not exists site_project_inquiries_created_at on public.site_project_inquiries(created_at desc);
alter table public.site_project_inquiries enable row level security;
revoke all on public.site_project_inquiries from public, anon, authenticated;
grant insert (name, email, message, language) on public.site_project_inquiries to anon;
grant select, update on public.site_project_inquiries to authenticated;

drop policy if exists site_inquiries_public_insert on public.site_project_inquiries;
create policy site_inquiries_public_insert on public.site_project_inquiries for insert to anon
  with check (status = 'new');
drop policy if exists site_inquiries_admin_read on public.site_project_inquiries;
create policy site_inquiries_admin_read on public.site_project_inquiries for select to authenticated
  using (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
drop policy if exists site_inquiries_admin_update on public.site_project_inquiries;
create policy site_inquiries_admin_update on public.site_project_inquiries for update to authenticated
  using (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
