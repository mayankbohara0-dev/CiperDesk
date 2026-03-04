-- ============================================================
-- CipherDesk — Supabase SQL Schema V2
-- Run this in Supabase > SQL Editor
-- ============================================================

-- ── Channel Members (for DMs and private channels) ────────────
create table if not exists public.channel_members (
  channel_id  uuid references public.channels(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (channel_id, user_id)
);

alter table public.channel_members enable row level security;

create policy "Users can view channel members"
  on public.channel_members for select using (auth.uid() is not null);

create policy "Users can join channels"
  on public.channel_members for insert with check (auth.uid() = user_id);

-- ── Notifications ─────────────────────────────────────────────
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null, -- 'mention' | 'task_assigned' | 'security' | 'system'
  title       text not null,
  body        text,
  is_read     boolean not null default false,
  action_url  text,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

create policy "System can insert notifications"
  on public.notifications for insert with check (auth.uid() is not null);

-- ── Workspace Keys ────────────────────────────────────────────
create table if not exists public.workspace_keys (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  key_type    text not null default 'symmetric', -- 'symmetric' | 'asymmetric_pair'
  status      text not null default 'active',    -- 'active' | 'rotated' | 'revoked'
  version     integer not null default 1,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  rotated_at  timestamptz
);

alter table public.workspace_keys enable row level security;

create policy "Authenticated users can view keys"
  on public.workspace_keys for select using (auth.uid() is not null);

create policy "Admins can manage keys"
  on public.workspace_keys for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

-- Insert an initial active key for the workspace securely
insert into public.workspace_keys (name, key_type, version, status) values
  ('primary-workspace-key', 'symmetric', 1, 'active')
on conflict do nothing;
