import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oefpdrpczzbljvyhgtom.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const localDir = 'c:/Users/AI HUB/Desktop/mdf/organianext/public/images/products';

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function uploadAll() {
  console.log('--- Step 1: Loading MO- Products from Supabase ---');
  const { data: dbProducts, error } = await supabase
    .from('Product')
    .select(`
      id, sku,
      translations:ProductTranslation(name, language, slug)
    `)
    .like('sku', 'MO-%');

  if (error || !dbProducts) {
    console.error('Error loading products:', error);
    return;
  }

  console.log(`Found ${dbProducts.length} MO- products.`);

  let uploadedCount = 0;
  const deletedFiles = [];

  for (let i = 0; i < dbProducts.length; i++) {
    const prod = dbProducts[i];
    const frName = decodeHtml(prod.translations?.find(t => t.language === 'fr')?.name || '');
    const frSlug = prod.translations?.find(t => t.language === 'fr')?.slug || prod.sku.toLowerCase();
    const localFileName = `${frSlug}.webp`;
    const localFilePath = path.join(localDir, localFileName);

    if (!fs.existsSync(localFilePath)) {
      // Check if there is already an image in DB or if it was skipped (e.g. Argile bleue)
      console.log(`ℹ️ [${i + 1}/${dbProducts.length}] No local file for: ${frName} (${localFileName})`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localFilePath);
    const storageFileName = `${Date.now()}-${frSlug}.webp`;

    // 1. Upload to Supabase Storage bucket 'products'
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('products')
      .upload(storageFileName, fileBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadErr) {
      console.error(`❌ Error uploading ${localFileName} to Supabase Storage:`, uploadErr);
      continue;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(storageFileName);

    // 3. Update ProductImage in DB
    await supabase.from('ProductImage').delete().eq('productId', prod.id);
    const { error: dbErr } = await supabase.from('ProductImage').insert({
      productId: prod.id,
      url: publicUrl,
      isPrimary: true
    });

    if (dbErr) {
      console.error(`❌ Error updating DB for ${frName}:`, dbErr);
    } else {
      uploadedCount++;
      console.log(`[${uploadedCount}] 🚀 Uploaded & Linked to Supabase:`);
      console.log(`   Product: ${frName} (${prod.sku})`);
      console.log(`   Storage URL: ${publicUrl}\n`);

      // 4. Remove local file from public/ folder
      fs.unlinkSync(localFilePath);
      deletedFiles.push(localFileName);
    }
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 SUCCESS: ${uploadedCount} IMAGES UPLOADED TO SUPABASE STORAGE!`);
  console.log(`All image URLs in ProductImage table are now remote Supabase CDN URLs.`);
  console.log(`Cleaned up ${deletedFiles.length} local files from public/images/products/.`);
  console.log(`=============================================================\n`);
}

uploadAll();
