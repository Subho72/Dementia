import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing Supabase configuration (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)")
  }
  return createClient(url, key, { auth: { persistSession: false } })
}
