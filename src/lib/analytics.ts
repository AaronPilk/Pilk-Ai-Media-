export type AnalyticsEvent =
  | "hero_primary_cta_clicked"
  | "hero_secondary_cta_clicked"
  | "template_viewed"
  | "template_preview_opened"
  | "template_selected"
  | "pricing_package_clicked"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_error"
  | "phone_clicked"
  | "email_clicked"
  | "lab_started"
  | "lab_completed";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("pilk:analytics", { detail: { event, properties } })
  );

  if (typeof window.gtag === "function") {
    window.gtag("event", event, properties);
  }
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, properties);
  }
}
