import { createClient } from "lib/supabase/client"

const BACKEND_URL = "http://localhost:4000/v1"

export async function getAuthHeader() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return { "Authorization": `Bearer ${session.access_token}` }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = await getAuthHeader()
  if (!headers) throw new Error("Unauthorized")

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = (await res.json().catch(() => ({ error: "Unknown error" }))) as { error?: string }
    throw new Error(error.error || "Request failed")
  }

  if (res.status === 204) return null
  return res.json()
}
