-- Blog administrable: noticias, administradores e imágenes.
-- Ejecutar una sola vez en Supabase → SQL Editor → New query → Run.
-- Es seguro volver a ejecutarlo (no borra datos).

-- 1. Administradores: solo los usuarios de esta tabla pueden editar el blog.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Sin políticas: la tabla no es accesible desde la web, solo desde el panel de Supabase.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- 2. Noticias
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  description text not null default '' check (char_length(description) <= 300),
  content text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

drop policy if exists "Cualquiera lee noticias publicadas" on public.posts;
create policy "Cualquiera lee noticias publicadas"
  on public.posts for select
  to anon, authenticated
  using (published or (select public.is_admin()));

drop policy if exists "Admins crean noticias" on public.posts;
create policy "Admins crean noticias"
  on public.posts for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins editan noticias" on public.posts;
create policy "Admins editan noticias"
  on public.posts for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins borran noticias" on public.posts;
create policy "Admins borran noticias"
  on public.posts for delete
  to authenticated
  using ((select public.is_admin()));

grant select on table public.posts to anon, authenticated;
grant insert, update, delete on table public.posts to authenticated;

-- Los administradores también pueden ver los mensajes del formulario desde el panel
drop policy if exists "Admins leen contactos" on public.contactos;
create policy "Admins leen contactos"
  on public.contactos for select
  to authenticated
  using ((select public.is_admin()));
grant select on table public.contactos to authenticated;

-- 3. Imágenes del blog (bucket público de solo lectura; solo admins suben/borran)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Admins suben imagenes del blog" on storage.objects;
create policy "Admins suben imagenes del blog"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and (select public.is_admin()));

drop policy if exists "Admins editan imagenes del blog" on storage.objects;
create policy "Admins editan imagenes del blog"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));

drop policy if exists "Admins borran imagenes del blog" on storage.objects;
create policy "Admins borran imagenes del blog"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));

-- 4. Noticias de ejemplo (solo si la tabla está vacía)
insert into public.posts (slug, title, description, content, published, published_at)
select * from (values
  (
    'por-que-invertir-en-cartagena',
    '¿Por qué invertir en Cartagena en 2026?',
    'Turismo, infraestructura y expansión urbana: las razones por las que Cartagena sigue siendo uno de los mercados inmobiliarios más atractivos de Colombia.',
    E'Cartagena de Indias es el principal destino turístico de Colombia y recibe visitantes nacionales e internacionales durante todo el año. Esa demanda constante es uno de los pilares de la inversión inmobiliaria en la ciudad.\n\n## La ciudad crece hacia nuevas zonas\n\nA medida que el centro histórico y Bocagrande se consolidan, el desarrollo se desplaza hacia zonas de expansión donde hoy se están construyendo hoteles, hospitales, vías y nuevas urbanizaciones.\n\n> Invertir hoy es ganar mañana: quien llega primero a una zona en expansión captura la mayor valorización.\n\n## Qué mirar antes de invertir\n\n- Ubicación y proyectos de infraestructura cercanos\n- Respaldo legal y estado de la documentación del proyecto\n- Facilidades de pago y plazos\n- Potencial de renta o reventa\n\n¿Quieres saber cómo aplica esto a Oasis? [Escríbenos](/#contacto) y agenda una asesoría.',
    true,
    date '2026-09-20'
  ),
  (
    'valorizacion-zona-de-expansion',
    'Cómo se valoriza un terreno en zona de expansión',
    'Hoteles, aeropuerto y hospitales: así impactan las nuevas obras en el precio de la tierra a su alrededor.',
    E'Cuando una ciudad anuncia y ejecuta grandes obras en una zona, el valor del suelo cercano tiende a subir. Es un fenómeno conocido en el mercado inmobiliario: **la infraestructura atrae demanda, y la demanda mueve los precios**.\n\n## Las etapas de la valorización\n\n1. **Anuncio:** se conocen los proyectos y los primeros inversionistas compran.\n2. **Construcción:** llegan obras, empleo y servicios; los precios empiezan a reflejarlo.\n3. **Consolidación:** la zona se habita y los precios alcanzan su nuevo nivel.\n\nEntrar en las primeras etapas es lo que permite capturar la mayor parte del crecimiento.\n\n¿Aún no has invertido? [Agenda tu visita](/#agenda).',
    true,
    date '2026-09-10'
  )
) as seed (slug, title, description, content, published, published_at)
where not exists (select 1 from public.posts);

-- 5. Dar acceso de administrador (hacer DESPUÉS de crear el usuario en
--    Authentication → Users → Add user). Cambia el correo y ejecuta solo esta línea:
-- insert into public.admins (user_id) select id from auth.users where email = 'correo@ejemplo.com' on conflict do nothing;
