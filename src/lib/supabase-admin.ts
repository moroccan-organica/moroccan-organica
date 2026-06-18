import 'server-only';

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceRoleKey) {
    throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY is required for server-side database access. Add it to .env from Supabase Dashboard > Settings > API.'
    )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
