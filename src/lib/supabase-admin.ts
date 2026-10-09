import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

function createAdminClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            'Supabase credentials missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is required.'
        );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn(
            '[supabase-admin] WARNING: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY. For full admin access and to bypass RLS, add SUPABASE_SERVICE_ROLE_KEY in your hosting environment variables (Vercel).'
        );
    }

    return createClient(supabaseUrl, supabaseKey);
}

export function getSupabaseAdmin(): SupabaseClient {
    if (!adminClient) {
        adminClient = createAdminClient();
    }
    return adminClient;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop, receiver) {
        const client = getSupabaseAdmin();
        const value = Reflect.get(client, prop, receiver);
        return typeof value === 'function' ? value.bind(client) : value;
    },
});
