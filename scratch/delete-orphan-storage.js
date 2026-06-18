const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = 'products';

async function main() {
  const { data: images, error: imgError } = await supabase
    .from('ProductImage')
    .select('url');

  if (imgError) {
    console.error('Failed to load ProductImage:', imgError);
    process.exit(1);
  }

  const referenced = new Set(
    (images || [])
      .map((row) => {
        const match = row.url?.match(/\/products\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );

  const { data: files, error: listError } = await supabase.storage.from(BUCKET).list('', {
    limit: 1000,
  });

  if (listError) {
    console.error('Failed to list storage files:', listError);
    process.exit(1);
  }

  const orphans = (files || [])
    .map((file) => file.name)
    .filter((name) => name && !referenced.has(name));

  if (orphans.length === 0) {
    console.log('No orphan files found.');
    return;
  }

  console.log(`Found ${orphans.length} orphan file(s):`);
  orphans.forEach((name) => console.log(`  - ${name}`));

  const { data: removed, error: removeError } = await supabase.storage
    .from(BUCKET)
    .remove(orphans);

  if (removeError) {
    console.error('Failed to delete orphan files:', removeError);
    process.exit(1);
  }

  console.log(`\nDeleted ${removed?.length ?? orphans.length} orphan file(s) successfully.`);

  const { data: afterFiles } = await supabase.storage.from(BUCKET).list('', { limit: 1000 });
  console.log(`Remaining files in "${BUCKET}": ${afterFiles?.length ?? 0}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
