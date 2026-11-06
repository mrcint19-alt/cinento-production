-- Run in the dedicated CINENTO SITE Supabase project before deploying media fields.
alter table public.site_programs add column if not exists icon_url text;
alter table public.site_programs add column if not exists logo_url text;
alter table public.site_programs add column if not exists cover_url text;

-- Fill only missing imagery. Existing owner-selected media is preserved.
update public.site_programs set
  icon_url = coalesce(icon_url, 'https://www.cinento.net/images/programs/' || id || '-icon.svg'),
  logo_url = coalesce(logo_url, 'https://www.cinento.net/images/programs/' || id || '-logo.svg'),
  cover_url = coalesce(cover_url, 'https://www.cinento.net/images/programs/' || id || '-cover.svg')
where id in ('ai','watch','enterprise','autocall','crm','vpn','ai-studio-desktop',
  'ai-studio-web','budget-studio','enterprise-os','app-center','cv-kart','outreach-crm');

-- Assets in this bucket are intentionally public. Upload rights remain limited to catalog admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-program-media', 'site-program-media', true, 4194304,
        array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 4194304,
  allowed_mime_types = array['image/png','image/jpeg','image/webp'];

drop policy if exists site_program_media_admin_upload on storage.objects;
create policy site_program_media_admin_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'site-program-media' and exists
    (select 1 from public.site_catalog_admins where user_id = (select auth.uid())));
