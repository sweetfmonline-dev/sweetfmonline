-- Create comments table for article comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_article_slug on public.comments(article_slug);
create index if not exists idx_comments_created_at on public.comments(created_at desc);

alter table public.comments enable row level security;

drop policy if exists "Public read comments" on public.comments;
create policy "Public read comments"
on public.comments
for select
using (true);

drop policy if exists "Public insert comments" on public.comments;
create policy "Public insert comments"
on public.comments
for insert
with check (true);
