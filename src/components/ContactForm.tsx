"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { sendContact, type ContactState } from "@/app/actions";

const inputClass =
  "mt-1 block w-full rounded-sm border border-sand-deep bg-white px-4 py-3 text-ink placeholder:text-ink-soft/70 focus:border-brand-dark aria-[invalid=true]:border-red-700";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);
  const invalid = state && !state.ok && state.reason === "invalid" ? state.fields : {};
  const values = state && !state.ok ? state.values : undefined;

  if (state?.ok) {
    return (
      <p role="status" className="rounded-sm border-l-4 border-brand bg-sand p-6 text-ink">
        {t("success")}
      </p>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-bold">{t("name")}</label>
        <input id="name" name="name" required autoComplete="name" defaultValue={values?.name} aria-invalid={!!invalid.name} className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-bold">{t("email")}</label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={values?.email} aria-invalid={!!invalid.email} className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-bold">{t("message")}</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={values?.message}
          placeholder={t("messagePlaceholder")}
          aria-invalid={!!invalid.message}
          className={inputClass}
        />
      </div>
      {/* Honeypot anti-spam */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state && !state.ok && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {state.reason === "invalid" ? t("invalid") : t("error")}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
