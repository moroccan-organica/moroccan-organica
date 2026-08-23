import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function decodeRole(jwt) {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
    return payload.role;
  } catch {
    return 'invalid';
  }
}

console.log('URL:', url);
console.log('Anon role:', decodeRole(anonKey || ''));
console.log('Service role:', decodeRole(serviceKey || ''));

const svc = createClient(url, serviceKey);

const simple = await svc
  .from('BlogPost')
  .select('id', { count: 'exact', head: true })
  .eq('status', 'published');

console.log('\nSimple query:', simple.error ? `FAIL ${simple.error.message}` : `OK count=${simple.count}`);

const full = await svc
  .from('BlogPost')
  .select('*, author:User(id, name, image), category:BlogCategory(*), media:BlogMedia(url, mediaType)', {
    count: 'exact',
  })
  .eq('status', 'published')
  .limit(1);

console.log(
  'Full join query:',
  full.error ? `FAIL ${full.error.message}` : `OK rows=${full.data?.length ?? 0}`
);

if (full.error) {
  console.log('Details:', full.error.details || 'none');
  console.log('Hint:', full.error.hint || 'none');
}
