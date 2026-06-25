/** Server-side env access with safe optional handling. Never import in client components. */
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pilk.ai",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  leadsNotificationEmail: process.env.LEADS_NOTIFICATION_EMAIL ?? "",
  leadsFromEmail: process.env.LEADS_FROM_EMAIL ?? "",
  crmWebhookUrl: process.env.CRM_WEBHOOK_URL ?? "",
};

export const integrations = {
  get supabase() {
    return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
  },
  get resend() {
    return Boolean(env.resendApiKey && env.leadsFromEmail);
  },
  get crm() {
    return Boolean(env.crmWebhookUrl);
  },
};
