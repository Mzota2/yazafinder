create or replace function public.match_yazas(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id text,
  full_name text,
  subjects text[],
  hourly_rate numeric,
  rating numeric,
  bio text,
  similarity float
)
language sql
stable
as $$
  select
    u.id::text,
    u.full_name,
    yp.subjects,
    yp.hourly_rate,
    yp.rating,
    yp.bio,
    1 - (yp.embedding <=> query_embedding) as similarity
  from public.yaza_profiles yp
  join public.users u on u.id = yp.id
  where yp.documents_verified = true
    and yp.is_available = true
    and yp.rating >= 3.5
    and 1 - (yp.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

grant execute on function public.match_yazas(vector, float, int) to authenticated;

