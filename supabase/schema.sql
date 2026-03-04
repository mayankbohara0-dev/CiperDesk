-- ============================================================
-- CipherDesk — Supabase SQL Schema
-- Run this in Supabase > SQL Editor
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
-- Automatically created when a user signs up via trigger below
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'member',   -- 'owner' | 'admin' | 'member'
  workspace   text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select using (auth.uid() is not null);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Trigger: auto-insert profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, workspace)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'workspace_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── Channels ──────────────────────────────────────────────────
create table if not exists public.channels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  is_private  boolean not null default false,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

alter table public.channels enable row level security;

create policy "Authenticated users can view channels"
  on public.channels for select using (auth.uid() is not null);

create policy "Authenticated users can insert channels"
  on public.channels for insert with check (auth.uid() is not null);

-- Seed default channels
insert into public.channels (name, description) values
  ('general',     'Company-wide announcements and chill chat')
on conflict do nothing;

insert into public.channels (name, description) values
  ('engineering', 'Technical discussions and code review')
on conflict do nothing;

insert into public.channels (name, description) values
  ('builds',      'CI/CD, deployments, and releases')
on conflict do nothing;


-- ── Messages ──────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  channel_id  uuid not null references public.channels(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,       -- will hold ciphertext in production
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Authenticated users can read messages"
  on public.messages for select using (auth.uid() is not null);

create policy "Authenticated users can insert messages"
  on public.messages for insert with check (auth.uid() = user_id);

create policy "Users can delete own messages"
  on public.messages for delete using (auth.uid() = user_id);

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;


-- ── Tasks ─────────────────────────────────────────────────────
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'todo',   -- 'todo' | 'in_progress' | 'done'
  priority    text not null default 'medium', -- 'low' | 'medium' | 'high'
  assignee_id uuid references public.profiles(id),
  created_by  uuid references public.profiles(id),
  due_date    date,
  created_at  timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Authenticated users can read tasks"
  on public.tasks for select using (auth.uid() is not null);

create policy "Authenticated users can insert tasks"
  on public.tasks for insert with check (auth.uid() is not null);

create policy "Authenticated users can update tasks"
  on public.tasks for update using (auth.uid() is not null);

create policy "Task creator can delete"
  on public.tasks for delete using (auth.uid() = created_by);


-- ── Vault Files ───────────────────────────────────────────────
create table if not exists public.vault_files (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  size_bytes  bigint not null default 0,
  mime_type   text,
  storage_path text,              -- path in Supabase Storage bucket
  uploaded_by uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

alter table public.vault_files enable row level security;

create policy "Authenticated users can view vault files"
  on public.vault_files for select using (auth.uid() is not null);

create policy "Authenticated users can upload vault files"
  on public.vault_files for insert with check (auth.uid() = uploaded_by);

create policy "Uploader can delete vault files"
  on public.vault_files for delete using (auth.uid() = uploaded_by);


-- ── Audit Log ─────────────────────────────────────────────────
create table if not exists public.audit_log (
  id          bigint generated always as identity primary key,
  type        text not null,      -- 'auth' | 'encryption' | 'file' | 'member' | 'task' | 'security'
  action      text not null,
  actor_id    uuid references public.profiles(id),
  detail      text,
  ip          text,
  severity    text not null default 'info', -- 'info' | 'warn' | 'critical'
  created_at  timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "Admins can read audit log"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );
