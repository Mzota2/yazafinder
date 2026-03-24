alter table public.users add column if not exists auth_user_id text;

update public.users
set auth_user_id = id::text
where auth_user_id is null;

create unique index if not exists idx_users_auth_user_id
  on public.users(auth_user_id)
  where auth_user_id is not null;

create policy "users_insert_own"
on public.users for insert
to authenticated
with check (
  auth_user_id = auth.uid()::text
  or id::text = auth.uid()::text
);

create or replace function public.sync_auth_user_to_public_users()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_role text;
  desired_full_name text;
  desired_phone text;
begin
  desired_role := coalesce(new.raw_user_meta_data ->> 'role', 'learner');
  desired_full_name := new.raw_user_meta_data ->> 'full_name';
  desired_phone := new.raw_user_meta_data ->> 'phone';

  insert into public.users (auth_user_id, email, full_name, phone, role)
  values (
    new.id::text,
    new.email,
    desired_full_name,
    desired_phone,
    desired_role
  )
  on conflict (auth_user_id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name),
    phone = coalesce(excluded.phone, public.users.phone),
    role = coalesce(public.users.role, excluded.role);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_sync_public on auth.users;

create trigger on_auth_user_created_sync_public
after insert on auth.users
for each row execute function public.sync_auth_user_to_public_users();

