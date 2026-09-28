/**
 * Configuración central del sitio. Cambia aquí teléfonos, redes, mapa e imágenes.
 * Todo lo marcado como [CONTENIDO PENDIENTE] debe reemplazarse con datos reales.
 */
export const site = {
  name: "Oasis Cartagena",
  owner: "Rochy Artunduaga",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Número en formato internacional sin "+" (57 = Colombia) — requerido por wa.me
  whatsapp: "573004427840",
  phoneDisplay: "+57 300 442 7840",
  email: "[CONTENIDO PENDIENTE: correo de contacto]",

  // Reemplaza por la dirección o coordenadas exactas del proyecto
  mapQuery: "Cartagena de Indias, Bolívar, Colombia",

  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",

  // URL de embed de YouTube/Vimeo del video principal (ej. https://www.youtube.com/embed/ID)
  videoEmbedUrl: "",

  // Enlaces a redes sociales: [CONTENIDO PENDIENTE: pedir links reales a la cliente]
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
    youtube: "#",
  },

  /**
   * Imágenes: coloca los archivos en /public/images y escribe la ruta (ej. "/images/hero.jpg").
   * Mientras estén vacías se muestra un placeholder con la descripción pendiente.
   */
  images: {
    hero: "",
    gallery: ["", "", "", "", "", ""],
  },
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
