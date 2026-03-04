import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    ITUNES_API_BASE_URL: z.string().url().default("https://itunes.apple.com/search"),
  },
  client: {},
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    ITUNES_API_BASE_URL: process.env.ITUNES_API_BASE_URL,
  },
})
