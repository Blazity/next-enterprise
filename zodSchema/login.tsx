import { z } from "zod"

/**
 * Login and Register Form Schemas
 * Types of Login and Register Form Schemas
 */

export const loginSchema = z.object({
  email: z.string().email({ message: "invalid Email⚠️" }),
  password: z.string().min(1, { message: "invalid Password⚠️" }),
})

export type typeLoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name of 2 characters is required!" }),
  email: z.string().email({ message: "invalid Email⚠️" }),
  password: z.string().min(1, { message: "Password of 6 characters is required!" }),
})

export type typeRegisterSchema = z.infer<typeof registerSchema>
