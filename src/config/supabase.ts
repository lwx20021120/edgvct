import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 必须配置')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
