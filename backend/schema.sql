-- ====================================================================
-- FRAME Marketplace Supabase Database Schemas & Functions (v1.1)
-- ====================================================================

-- 1. Auto-Confirm User Trigger (회원가입 즉시 승인 트리거)
create or replace function public.auto_confirm_user()
returns trigger
language plpgsql
security definer
as $$
begin
  new.email_confirmed_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_auto_confirm on auth.users;
create trigger on_auth_user_created_auto_confirm
  before insert on auth.users
  for each row execute function public.auto_confirm_user();

-- 2. Customer Support Inquiries Table (고객센터 1:1 문의 & 사진 증빙 DB)
create table if not exists public.inquiries (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  category text,
  email text not null,
  title text not null,
  content text not null,
  photos jsonb default '[]'::jsonb,
  status text default '답변 대기중',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS 보안 정책
alter table public.inquiries enable row level security;
create policy "anyone_insert_inquiries" on public.inquiries for insert with check (true);
create policy "anyone_select_inquiries" on public.inquiries for select using (true);
