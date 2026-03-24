create extension if not exists pgcrypto;
create extension if not exists vector;
create extension if not exists pg_cron;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  full_name text,
  role text check (role in ('learner', 'yaza', 'admin')),
  avatar_url text,
  university text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.yaza_profiles (
  id uuid primary key references public.users(id) on delete cascade,
  subjects text[],
  bio text,
  hourly_rate numeric,
  rating numeric default 0,
  total_sessions int default 0,
  is_available boolean default true,
  documents_verified boolean default false,
  embedding vector(1536)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references public.users(id) on delete set null,
  yaza_id uuid references public.users(id) on delete set null,
  subject text,
  scheduled_at timestamptz,
  duration_minutes int,
  status text check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed')),
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete set null,
  learner_id uuid references public.users(id) on delete set null,
  yaza_id uuid references public.users(id) on delete set null,
  amount numeric,
  commission numeric,
  yaza_payout numeric,
  status text check (status in ('pending', 'escrowed', 'released', 'refunded', 'failed')),
  paychangu_ref text,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  sender_id uuid references public.users(id) on delete set null,
  content text,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  reviewer_id uuid references public.users(id) on delete set null,
  reviewee_id uuid references public.users(id) on delete set null,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.chatbot_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  message text,
  response text,
  moderated boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  yaza_id uuid references public.users(id) on delete cascade,
  day_of_week int check (day_of_week between 0 and 6),
  start_time time,
  end_time time
);

-- Backfill columns when tables already existed before this migration.
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists full_name text;
alter table public.users add column if not exists role text;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists university text;
alter table public.users add column if not exists is_verified boolean default false;
alter table public.users add column if not exists created_at timestamptz default now();

alter table public.yaza_profiles add column if not exists subjects text[];
alter table public.yaza_profiles add column if not exists bio text;
alter table public.yaza_profiles add column if not exists hourly_rate numeric;
alter table public.yaza_profiles add column if not exists rating numeric default 0;
alter table public.yaza_profiles add column if not exists total_sessions int default 0;
alter table public.yaza_profiles add column if not exists is_available boolean default true;
alter table public.yaza_profiles add column if not exists documents_verified boolean default false;
alter table public.yaza_profiles add column if not exists embedding vector(1536);

alter table public.sessions add column if not exists subject text;
alter table public.sessions add column if not exists learner_id uuid;
alter table public.sessions add column if not exists yaza_id uuid;
alter table public.sessions add column if not exists scheduled_at timestamptz;
alter table public.sessions add column if not exists duration_minutes int;
alter table public.sessions add column if not exists status text;
alter table public.sessions add column if not exists notes text;
alter table public.sessions add column if not exists created_at timestamptz default now();

alter table public.payments add column if not exists session_id uuid;
alter table public.payments add column if not exists learner_id uuid;
alter table public.payments add column if not exists yaza_id uuid;
alter table public.payments add column if not exists amount numeric;
alter table public.payments add column if not exists commission numeric;
alter table public.payments add column if not exists yaza_payout numeric;
alter table public.payments add column if not exists status text;
alter table public.payments add column if not exists paychangu_ref text;
alter table public.payments add column if not exists created_at timestamptz default now();

alter table public.messages add column if not exists session_id uuid;
alter table public.messages add column if not exists sender_id uuid;
alter table public.messages add column if not exists content text;
alter table public.messages add column if not exists created_at timestamptz default now();

alter table public.reviews add column if not exists session_id uuid;
alter table public.reviews add column if not exists reviewer_id uuid;
alter table public.reviews add column if not exists reviewee_id uuid;
alter table public.reviews add column if not exists rating int;
alter table public.reviews add column if not exists comment text;
alter table public.reviews add column if not exists created_at timestamptz default now();

alter table public.chatbot_logs add column if not exists user_id uuid;
alter table public.chatbot_logs add column if not exists message text;
alter table public.chatbot_logs add column if not exists response text;
alter table public.chatbot_logs add column if not exists moderated boolean default false;
alter table public.chatbot_logs add column if not exists created_at timestamptz default now();

alter table public.availability add column if not exists yaza_id uuid;
alter table public.availability add column if not exists day_of_week int;
alter table public.availability add column if not exists start_time time;
alter table public.availability add column if not exists end_time time;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_role_check'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_role_check check (role in ('learner', 'yaza', 'admin'));
  end if;
end $$;

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_yaza_profiles_available_verified
  on public.yaza_profiles(is_available, documents_verified);
create index if not exists idx_sessions_learner on public.sessions(learner_id);
create index if not exists idx_sessions_yaza on public.sessions(yaza_id);
create index if not exists idx_sessions_status_scheduled
  on public.sessions(status, scheduled_at);
create index if not exists idx_messages_session_created
  on public.messages(session_id, created_at);
create index if not exists idx_payments_session on public.payments(session_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_reviews_reviewee on public.reviews(reviewee_id);
create index if not exists idx_chatbot_logs_user_created
  on public.chatbot_logs(user_id, created_at);
create index if not exists idx_availability_yaza on public.availability(yaza_id);

