# Oasis Cartagena — Landing page de Rochy Artunduaga

Landing page del proyecto inmobiliario **Oasis** en la zona de expansión de Cartagena.
Construida con **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, lista para desplegar en **Vercel**.

## Funcionalidades

| Funcionalidad | Dónde está |
| --- | --- |
| Secciones Inicio · Oasis · Reseñas · Blog · Contacto | `src/app/page.tsx`, `src/components/` |
| Botón flotante de WhatsApp | `src/components/WhatsAppButton.tsx` |
| Formulario de contacto (Server Action + `/api/contact`) | `src/components/ContactForm.tsx`, `src/app/actions.ts`, `src/app/api/contact/route.ts`, `src/lib/contact.ts` |
| Blog administrable (Supabase) | `src/app/(site)/blog/`, `src/lib/posts.ts` |
| Panel de administración `/admin` | `src/app/admin/`, `src/proxy.ts`, `src/lib/admin.ts` |
| Multi-idioma (next-intl, español) | `messages/es.json`, `src/i18n/request.ts` |
| Mapa de Google Maps | `src/components/Contact.tsx` (usa `mapQuery` de `src/lib/site.ts`) |
| Reservas / citas con Calendly | `src/components/Contact.tsx` (variable `NEXT_PUBLIC_CALENDLY_URL`) |
| Redes sociales en el footer | `src/components/Footer.tsx` (links en `src/lib/site.ts`) |
| Galería, video y reseñas | `src/components/Oasis.tsx`, `src/components/Reviews.tsx` |
| SEO: metadata, sitemap.xml, robots.txt | `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts` |

## Estructura

```
supabase/                SQL para crear tablas, permisos y almacenamiento
messages/es.json         Todos los textos del sitio
public/images/           Fotos del proyecto (crear y agregar aquí)
src/app/(site)/          Páginas públicas (inicio y blog)
src/app/admin/           Panel privado (noticias y mensajes)
src/components/          Header, Hero, Oasis, Reviews, CTA, Contact, Footer…
src/lib/site.ts          Configuración: WhatsApp, redes, mapa, imágenes, video
src/i18n/request.ts      Configuración de next-intl
```

## Correr en local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local   # y completa las variables
npm run dev
```

Abre http://localhost:3000.

## Contenido pendiente

Busca `[CONTENIDO PENDIENTE` y `[PENDIENTE]` en el proyecto. Lo principal:

1. **Fotos**: copia las imágenes a `public/images/` y escribe sus rutas en `site.images` (`src/lib/site.ts`). Mientras estén vacías se ve un placeholder.
2. **Video**: URL de embed de YouTube/Vimeo en `site.videoEmbedUrl`.
3. **Cifras del proyecto** (área, lotes, precio, distancia) en `messages/es.json` → `oasis.stats`.
4. **Reseñas reales** de clientes en `messages/es.json` → `reviews.items`.
5. **Redes sociales** en `site.social`.
6. **Dirección exacta** del proyecto en `site.mapQuery`.
7. **Logo** (hoy es texto en `Header.tsx` y `Footer.tsx`) y correo de contacto.
8. **Calendly**: crea el evento y pon su URL en `NEXT_PUBLIC_CALENDLY_URL`.

### Colores

El brief no definió color de marca. Se usó una paleta clásica caribeña (azul profundo `#0f2a3d` + dorado `#c9a15a`). Se cambia en `src/app/globals.css` dentro de `@theme`.

## Formulario de contacto

Sin configuración, los mensajes se registran en los logs del servidor. Para recibirlos por correo:

1. Crea una cuenta en [Resend](https://resend.com) y verifica tu dominio.
2. Define `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`.

## Blog y panel de administración

Las noticias se guardan en Supabase y se administran desde **`/admin`** (ej. `https://rochyinmobiliaria.vercel.app/admin`).
Desde ahí se pueden crear, editar, publicar/despublicar y eliminar noticias con imagen de portada,
y ver los mensajes que llegan por el formulario de contacto.

### Configuración (una sola vez)

1. Ejecuta `supabase/schema.sql` y luego `supabase/blog.sql` en **Supabase → SQL Editor**.
2. Crea el usuario administrador en **Supabase → Authentication → Users → Add user → Create new user**
   (correo + contraseña, marca **Auto Confirm User**).
3. Dale permisos de admin ejecutando en el SQL Editor (cambia el correo):
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'correo@ejemplo.com' on conflict do nothing;
   ```
4. Recomendado: en **Authentication → Sign In / Providers → Email** desactiva **Allow new users to sign up**,
   para que nadie más pueda crear cuentas.

Para quitar a un administrador: `delete from public.admins where user_id = (select id from auth.users where email = '...');`
Para cambiar una contraseña: **Authentication → Users → ⋯ → Send password recovery** o elimina y vuelve a crear el usuario.

### Seguridad

- Las políticas RLS de Supabase solo permiten editar noticias, subir imágenes y leer mensajes a usuarios de la tabla `admins`.
- El público solo puede leer noticias **publicadas** e insertar mensajes de contacto.
- El contenido se escribe en Markdown y se muestra sin HTML crudo.

## Agregar otro idioma

1. Copia `messages/es.json` a `messages/en.json` y tradúcelo.
2. Añade `"en"` a `locales` en `src/i18n/request.ts`.
3. Configura el enrutamiento por idioma de next-intl (`/es`, `/en`): https://next-intl.dev/docs/routing

## Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En https://vercel.com → **Add New… → Project** → importa el repositorio (Vercel detecta Next.js).
3. En **Settings → Environment Variables** agrega las variables de `.env.example`.
4. **Deploy**.
5. Dominio: el brief indica que aún no hay dominio. Puedes comprarlo en **Vercel → Domains** o en otro registrador y conectarlo en **Project → Settings → Domains**. Luego actualiza `NEXT_PUBLIC_SITE_URL`.
