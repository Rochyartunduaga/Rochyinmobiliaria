-- Tabla de mensajes del formulario de contacto.
-- Ejecutar una sola vez en Supabase → SQL Editor → New query → Run.

create table if not exists public.contactos (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 2 and 100),
  email text not null check (char_length(email) <= 200),
  mensaje text not null check (char_length(mensaje) between 10 and 3000),
  origen text not null default 'web'
);

-- Seguridad: la página (rol anon) solo puede INSERTAR. No hay política de lectura,
-- así que nadie puede leer los mensajes con la clave pública.
-- Los mensajes se ven en Supabase → Table Editor → contactos.
alter table public.contactos enable row level security;

drop policy if exists "La web puede registrar contactos" on public.contactos;
create policy "La web puede registrar contactos"
  on public.contactos for insert
  to anon
  with check (true);

grant insert on table public.contactos to anon;
