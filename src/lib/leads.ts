import { z } from "zod";

/** Validation schema for both the inquiry and catalog-download forms. */
export const leadSchema = z.object({
  type: z.enum(["inquiry", "catalog"]).default("inquiry"),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  interest: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot: real users never fill this. Bots often do. We accept any value
  // here and let the API route silently drop filled submissions (so bots get a
  // fake success rather than a validation hint).
  website: z.string().max(200).optional(),
  // Reference (e.g. a design slug the buyer was viewing).
  ref: z.string().trim().max(160).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
