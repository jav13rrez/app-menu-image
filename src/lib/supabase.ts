import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.warn('Atención: Las variables de Supabase no están configuradas en el frontend.')
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
