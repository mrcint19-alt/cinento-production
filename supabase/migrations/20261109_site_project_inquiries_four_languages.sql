-- Keep existing inquiries and expand the permitted locale set.
alter table public.site_project_inquiries
  drop constraint if exists site_project_inquiries_language_check;
alter table public.site_project_inquiries
  add constraint site_project_inquiries_language_check
  check (language in ('en', 'tr', 'fa', 'ar'));
