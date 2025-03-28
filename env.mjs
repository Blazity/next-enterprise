import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    // Add Clerk secret keys (server-side only)
    CLERK_SECRET_KEY: z.string().optional(),
    // Add any other server-side environment variables
    DATABASE_URL: z.string().optional(),
    // Vercel deployment environment - this is set automatically by Vercel
    VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  },
  client: {
    NEXT_PUBLIC_CLERK_ENABLE_KEYLESS: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    // Add Clerk publishable key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    // These are set automatically by Vercel
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_ENABLE_KEYLESS: process.env.NEXT_PUBLIC_CLERK_ENABLE_KEYLESS,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    ANALYZE: process.env.ANALYZE,
  },
  // Skip validation in development for easier local development
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});