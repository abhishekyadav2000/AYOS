/**
 * Input validation schemas using Zod
 * Provides type-safe validation with detailed error messages
 */

import { z } from "zod";

/**
 * Contact form validation schema
 * 
 * Security constraints:
 * - Name: 2-100 chars, prevents empty and excessively long inputs
 * - Email: Valid email format, max 255 chars (RFC 5321 limit)
 * - Message: 10-5000 chars, prevents spam and DoS via large payloads
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-'.]+$/,
      "Name contains invalid characters"
    ),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Sanitize user input for logging and email
 * Removes potentially dangerous characters while preserving readability
 */
export function sanitizeForLog(text: string): string {
  return text
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .slice(0, 1000); // Limit length for logs
}
