-- Run this in Supabase SQL Editor.
create table if not exists public.portfolio_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Business Promotional Videos','Education Reels','AI Videos')),
  description text default '',
  video_url text not null,
  thumbnail_url text default '',
  created_at timestamptz not null default now()
);
alter table public.portfolio_videos enable row level security;
create policy "Public can view portfolio videos" on public.portfolio_videos for select using (true);
create policy "Authenticated admins can add videos" on public.portfolio_videos for insert to authenticated with check (true);
create policy "Authenticated admins can delete videos" on public.portfolio_videos for delete to authenticated using (true);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio-videos','portfolio-videos',true,157286400,array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do nothing;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio-thumbnails','portfolio-thumbnails',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Public can view portfolio media" on storage.objects for select using (bucket_id in ('portfolio-videos','portfolio-thumbnails'));
create policy "Authenticated admins can upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id in ('portfolio-videos','portfolio-thumbnails'));
