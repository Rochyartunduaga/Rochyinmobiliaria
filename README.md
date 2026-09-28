# Oasis Cartagena — Landing page de Rochy Artunduaga

Landing page del proyecto inmobiliario **Oasis** en la zona de expansión de Cartagena.
Construida con **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, lista para desplegar en **Vercel**.

## Funcionalidades

| Funcionalidad | Dónde está |
| --- | --- |
| Secciones Inicio · Oasis · Reseñas · Blog · Contacto | `src/app/page.tsx`, `src/components/` |
| Botón flotante de WhatsApp | `src/components/WhatsAppButton.tsx` |
| Formulario de contacto (Server Action + `/api/contact`) | `src/components/ContactForm.tsx`, `src/app/actions.ts`, `src/app/api/contact/route.ts`, `src/lib/contact.ts` |
| Blog en MDX | `content/blog/*.mdx`, `src/app/blog/` |
| Multi-idioma (next-intl, español) | `messages/es.json`, `src/i18n/request.ts` |
| Mapa de Google Maps | `src/components/Contact.tsx` (usa `mapQuery` de `src/lib/site.ts`) |
| Reservas / citas con Calendly | `src/components/Contact.tsx` (variable `NEXT_PUBLIC_CALENDLY_URL`) |
| Redes sociales en el footer | `src/components/Footer.tsx` (links en `src/lib/site.ts`) |
| Galería, video y reseñas | `src/components/Oasis.tsx`, `src/components/Reviews.tsx` |
| SEO: metadata, sitemap.xml, robots.txt | `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts` |

## Estructura

```
content/blog/            Artículos del blog (.mdx con frontmatter)
messages/es.json         Todos los textos del sitio
public/images/           Fotos del proyecto (crear y agregar aquí)
src/app/                 Páginas, Server Action y API
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

## Blog

Crea un archivo en `content/blog/mi-articulo.mdx` (nombre en minúsculas y guiones):

```mdx
---
title: "Título del artículo"
description: "Resumen corto para SEO y la tarjeta."
date: "2026-10-01"
---

Contenido en **Markdown**.
```

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
