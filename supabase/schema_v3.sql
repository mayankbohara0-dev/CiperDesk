-- ============================================================
-- CipherDesk — Supabase SQL Schema V3 (Integrations & Compliance)
-- Run this in Supabase > SQL Editor
-- ============================================================

-- ── Integrations ──────────────────────────────────────────────
create table if not exists public.integrations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  is_enabled  boolean not null default false,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

alter table public.integrations enable row level security;

create policy "Admins can view integrations"
  on public.integrations for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

create policy "Admins can manage integrations"
  on public.integrations for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

-- ── Webhooks ──────────────────────────────────────────────────
create table if not exists public.webhooks (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  events      text[] not null default '{}',
  secret      text,
  is_active   boolean not null default true,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

alter table public.webhooks enable row level security;

create policy "Admins can view webhooks"
  on public.webhooks for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

create policy "Admins can manage webhooks"
  on public.webhooks for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

-- ── API Keys ──────────────────────────────────────────────────
create table if not exists public.api_keys (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  key_prefix  text not null,
  key_hash    text not null, -- Hashed key value
  last_used   timestamptz,
  scope       text not null default 'read-only',
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

alter table public.api_keys enable row level security;

create policy "Admins can view api keys"
  on public.api_keys for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

create policy "Admins can manage api keys"
  on public.api_keys for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

-- ── Workspace Settings ───────────────────────────────────────
create table if not exists public.workspace_settings (
  id                uuid primary key default gen_random_uuid(),
  retention_policy  text not null default '1 year', -- '30 days' | '90 days' | '1 year' | '2 years' | 'Forever'
  updated_by        uuid references public.profiles(id),
  updated_at        timestamptz not null default now()
);

alter table public.workspace_settings enable row level security;

create policy "Authenticated users can view workspace settings"
  on public.workspace_settings for select using (auth.uid() is not null);

create policy "Admins can manage workspace settings"
  on public.workspace_settings for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'owner')
    )
  );

-- Initialize default workspace setting
insert into public.workspace_settings (retention_policy) values ('1 year') on conflict do nothing;

-- ── Supabase Storage Setup (Vault Configuration) ─────────────
-- Ensure the storage bucket exists for Vault Files
insert into storage.buckets (id, name, public) values ('vault', 'vault', false) on conflict do nothing;

create policy "Authenticated users can read vault bucket"
  on storage.objects for select using (bucket_id = 'vault' and auth.uid() is not null);

create policy "Authenticated users can insert vault bucket"
  on storage.objects for insert with check (bucket_id = 'vault' and auth.uid() is not null);

create policy "Users can delete own vault objects"
  on storage.objects for delete using (bucket_id = 'vault' and auth.uid() = owner);
