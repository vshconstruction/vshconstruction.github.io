-- =========================================================
-- VSH Construction: reviews database
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- =========================================================

create table if not exists public.reviews (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 60),
  town        text check (town is null or char_length(town) <= 60),
  country     text check (country is null or country in ('al', 'me')),
  rating      int  not null check (rating between 1 and 5),
  service     text check (service is null or service in ('floors', 'walls', 'bathrooms', 'kitchens', 'outdoor', 'pools')),
  text        text not null check (char_length(text) between 10 and 1000),
  lang        text check (lang is null or lang in ('en', 'sq', 'me')),
  -- untick this in Table Editor to hide a review from the website
  approved    boolean not null default true
);

alter table public.reviews enable row level security;

-- Visitors can read the reviews that are approved (all of them, unless you hide one)
drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
  on public.reviews for select
  to anon
  using (approved = true);

-- Visitors can add a review, but cannot edit or delete anything
drop policy if exists "Public can add reviews" on public.reviews;
create policy "Public can add reviews"
  on public.reviews for insert
  to anon
  with check (approved = true);

-- Visitors may only fill in these columns (not id, created_at or approved)
revoke all on public.reviews from anon;
grant select on public.reviews to anon;
grant insert (name, town, country, rating, service, text, lang) on public.reviews to anon;

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
