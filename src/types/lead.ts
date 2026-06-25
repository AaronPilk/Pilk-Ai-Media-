import type { LeadInput } from "@/lib/forms";

export type Lead = LeadInput & {
  id?: string;
  createdAt?: string;
};
