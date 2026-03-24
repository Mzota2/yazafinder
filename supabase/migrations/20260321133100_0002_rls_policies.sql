alter table public.users enable row level security;
alter table public.yaza_profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.payments enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.chatbot_logs enable row level security;
alter table public.availability enable row level security;

create policy "users_select_own"
on public.users for select
to authenticated
using (auth.uid()::text = id::text);

create policy "users_update_own"
on public.users for update
to authenticated
using (auth.uid()::text = id::text)
with check (auth.uid()::text = id::text);

create policy "users_admin_all"
on public.users for all
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "yaza_profiles_select_verified"
on public.yaza_profiles for select
to authenticated
using (documents_verified = true or id::text = auth.uid()::text);

create policy "yaza_profiles_owner_insert"
on public.yaza_profiles for insert
to authenticated
with check (auth.uid()::text = id::text);

create policy "yaza_profiles_owner_update"
on public.yaza_profiles for update
to authenticated
using (auth.uid()::text = id::text)
with check (auth.uid()::text = id::text);

create policy "yaza_profiles_admin_all"
on public.yaza_profiles for all
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "sessions_participant_select"
on public.sessions for select
to authenticated
using (auth.uid()::text = learner_id::text or auth.uid()::text = yaza_id::text);

create policy "sessions_learner_insert"
on public.sessions for insert
to authenticated
with check (auth.uid()::text = learner_id::text);

create policy "sessions_participant_update"
on public.sessions for update
to authenticated
using (auth.uid()::text = learner_id::text or auth.uid()::text = yaza_id::text)
with check (auth.uid()::text = learner_id::text or auth.uid()::text = yaza_id::text);

create policy "sessions_admin_all"
on public.sessions for all
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "messages_participant_select"
on public.messages for select
to authenticated
using (
  exists (
    select 1
    from public.sessions s
    where s.id::text = messages.session_id::text
      and (s.learner_id::text = auth.uid()::text or s.yaza_id::text = auth.uid()::text)
  )
);

create policy "messages_participant_insert"
on public.messages for insert
to authenticated
with check (
  auth.uid()::text = sender_id::text
  and exists (
    select 1
    from public.sessions s
    where s.id::text = messages.session_id::text
      and (s.learner_id::text = auth.uid()::text or s.yaza_id::text = auth.uid()::text)
  )
);

create policy "messages_admin_select"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "payments_participant_select"
on public.payments for select
to authenticated
using (auth.uid()::text = learner_id::text or auth.uid()::text = yaza_id::text);

create policy "payments_admin_all"
on public.payments for all
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "reviews_participant_select"
on public.reviews for select
to authenticated
using (auth.uid()::text = reviewer_id::text or auth.uid()::text = reviewee_id::text);

create policy "reviews_reviewer_insert"
on public.reviews for insert
to authenticated
with check (auth.uid()::text = reviewer_id::text);

create policy "reviews_admin_all"
on public.reviews for all
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "chatbot_logs_own_select"
on public.chatbot_logs for select
to authenticated
using (auth.uid()::text = user_id::text);

create policy "chatbot_logs_own_insert"
on public.chatbot_logs for insert
to authenticated
with check (auth.uid()::text = user_id::text);

create policy "chatbot_logs_admin_select"
on public.chatbot_logs for select
to authenticated
using (
  exists (
    select 1 from public.users u where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

create policy "availability_authenticated_select"
on public.availability for select
to authenticated
using (true);

create policy "availability_owner_write"
on public.availability for all
to authenticated
using (auth.uid()::text = yaza_id::text)
with check (auth.uid()::text = yaza_id::text);

