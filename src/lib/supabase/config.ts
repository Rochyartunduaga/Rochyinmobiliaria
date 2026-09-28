/**
 * Conexión pública a Supabase. La URL y la clave anon/publishable son públicas por diseño
 * (viajan al navegador); la seguridad la dan las políticas RLS de supabase/*.sql.
 * Las variables de entorno tienen prioridad; los valores fijos evitan que el build falle si faltan.
 * NUNCA pongas aquí la service_role / secret key.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://itvgygdckmkmpfgavhzy.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dmd5Z2Rja21rbXBmZ2F2aHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MDE3OTYsImV4cCI6MjEwNjE3Nzc5Nn0.izjpOJGq_4TDuyxjPksG4gfQznD_PzvlygzGdESacfM";
