import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/site";

export async function WhatsAppButton() {
  const t = await getTranslations();
  return (
    <a
      href={whatsappLink(t("cta.whatsappMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("contact.whatsappFloat")}
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
