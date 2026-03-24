insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "upload_own_avatar" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "read_avatars" on storage.objects
for select
using (bucket_id = 'avatars');

create policy "upload_own_documents" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "admin_read_documents" on storage.objects
for select to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1
    from public.users u
    where u.id::text = auth.uid()::text and u.role = 'admin'
  )
);

