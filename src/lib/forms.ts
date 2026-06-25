import { z } from "zod";

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(80),
  lastName: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  currentWebsite: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z.enum(["template", "premium-template", "custom", "redesign", "unsure"]),
  selectedTemplate: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  needsIdx: z.boolean().optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(5000),
  preferredContact: z.enum(["email", "phone", "text"]).optional(),
  consent: z.boolean().optional(),

  // Attribution (hidden)
  utmSource: z.string().max(300).optional().or(z.literal("")),
  utmMedium: z.string().max(300).optional().or(z.literal("")),
  utmCampaign: z.string().max(300).optional().or(z.literal("")),
  utmContent: z.string().max(300).optional().or(z.literal("")),
  utmTerm: z.string().max(300).optional().or(z.literal("")),
  landingPage: z.string().max(1000).optional().or(z.literal("")),
  referrer: z.string().max(1000).optional().or(z.literal("")),
  gclid: z.string().max(500).optional().or(z.literal("")),
  fbclid: z.string().max(500).optional().or(z.literal("")),

  // Spam trap — must be empty
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const projectTypeOptions: { value: LeadInput["projectType"]; label: string }[] = [
  { value: "template", label: "Template Website" },
  { value: "premium-template", label: "Premium Template" },
  { value: "custom", label: "Custom Website" },
  { value: "redesign", label: "Redesign my current site" },
  { value: "unsure", label: "Not sure yet" },
];
