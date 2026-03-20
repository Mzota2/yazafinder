'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for browser/client components.
 * Uses Next.js public env vars (anon key) only.
 */
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

