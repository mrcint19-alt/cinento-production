-- Run only in the dedicated CINENTO SITE Supabase project used by site_programs.
-- No existing program, account, or homepage content is overwritten.
create table if not exists public.site_homepage_content (
  id text primary key check (id = 'main'),
  content jsonb not null check (jsonb_typeof(content) = 'object' and content ? 'en' and content ? 'tr'),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_homepage_media (
  url text primary key,
  folder text not null check (folder in ('hero', 'gallery', 'projects')),
  storage_path text,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists site_homepage_media_folder_created on public.site_homepage_media(folder, created_at desc);
alter table public.site_homepage_content enable row level security;
alter table public.site_homepage_media enable row level security;
revoke all on public.site_homepage_content, public.site_homepage_media from public, anon, authenticated;
grant select on public.site_homepage_content, public.site_homepage_media to anon;
grant select, insert, update, delete on public.site_homepage_content, public.site_homepage_media to authenticated;

drop policy if exists site_homepage_public_read on public.site_homepage_content;
create policy site_homepage_public_read on public.site_homepage_content for select to anon, authenticated using (true);
drop policy if exists site_homepage_admin_insert on public.site_homepage_content;
create policy site_homepage_admin_insert on public.site_homepage_content for insert to authenticated
  with check (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
drop policy if exists site_homepage_admin_update on public.site_homepage_content;
create policy site_homepage_admin_update on public.site_homepage_content for update to authenticated
  using (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));

drop policy if exists site_homepage_media_public_read on public.site_homepage_media;
create policy site_homepage_media_public_read on public.site_homepage_media for select to anon, authenticated using (true);
drop policy if exists site_homepage_media_admin_insert on public.site_homepage_media;
create policy site_homepage_media_admin_insert on public.site_homepage_media for insert to authenticated
  with check (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
drop policy if exists site_homepage_media_admin_update on public.site_homepage_media;
create policy site_homepage_media_admin_update on public.site_homepage_media for update to authenticated
  using (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
drop policy if exists site_homepage_media_admin_delete on public.site_homepage_media;
create policy site_homepage_media_admin_delete on public.site_homepage_media for delete to authenticated
  using (exists (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-homepage-media', 'site-homepage-media', true, 4194304, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 4194304,
  allowed_mime_types = array['image/png','image/jpeg','image/webp'];
drop policy if exists site_homepage_storage_admin_insert on storage.objects;
create policy site_homepage_storage_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'site-homepage-media' and exists
    (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
drop policy if exists site_homepage_storage_admin_select on storage.objects;
create policy site_homepage_storage_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'site-homepage-media' and exists
    (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
drop policy if exists site_homepage_storage_admin_delete on storage.objects;
create policy site_homepage_storage_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'site-homepage-media' and exists
    (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
