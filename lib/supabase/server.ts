import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../database.types'

export function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookies().set({
            name,
            value,
            ...options,
            path: options?.path ?? '/',
          } as any) // Using any temporarily to bypass type checking
        },
        remove(name: string, options: CookieOptions) {
          cookies().set({
            name,
            value: '',
            ...options,
            path: options?.path ?? '/',
            maxAge: 0,
          } as any) // Using any temporarily to bypass type checking
        },
      },
    }
  )
}
