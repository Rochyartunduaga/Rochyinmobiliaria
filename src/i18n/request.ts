import { getRequestConfig } from "next-intl/server";

// Idiomas disponibles. Para añadir inglés: crea messages/en.json y agrégalo aquí.
export const locales = ["es"] as const;
export const defaultLocale = "es";

export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
