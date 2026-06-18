import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

function createAdminClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is required for server-side database access. Add it to .env from Supabase Dashboard > Settings > API.'
        );
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey);
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
