import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase Client initialized successfully')
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message)
  }
} else {
  console.log('ℹ️ Supabase credentials not set or placeholder. Running with Local High-Fidelity Peshawar In-Memory Engine.')
}

export { supabase }
