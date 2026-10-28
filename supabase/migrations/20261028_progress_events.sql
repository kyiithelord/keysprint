-- Apply in the Supabase SQL Editor before deploying account progress sync.
create table if not exists public.progress_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_key text not null check (char_length(event_key) between 1 and 300),
  kind text not null check (kind in ('result', 'lesson', 'daily', 'game_best')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  primary key (user_id, event_key)
);

alter table public.progress_events enable row level security;
revoke all on public.progress_events from anon;
grant select, insert, delete on public.progress_events to authenticated;

create policy "Read own progress" on public.progress_events
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own progress" on public.progress_events
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Delete own progress" on public.progress_events
  for delete to authenticated using ((select auth.uid()) = user_id);
