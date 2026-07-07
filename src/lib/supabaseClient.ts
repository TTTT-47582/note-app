import { createClient } from '@supabase/supabase-js'

// Supabaseの接続情報は環境変数（.env）から取得する
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabaseの接続情報が設定されていません。.envにVITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください。',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
