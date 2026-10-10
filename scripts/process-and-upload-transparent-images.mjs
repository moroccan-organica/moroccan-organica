import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxrndkybpmaeswmjsahq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const inputDir = 'c:/Users/AI HUB/Desktop/mdf/organianext/transparent';

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-');
}

function normalize(str) {
  if (!str) return '';
  return decodeHtml(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Complete 100% verified mapping for all 59 transparent bidon images
const imageToProductNameMap = {
  // Huiles Aromatiques (10 products)
  'Image ChatGPT 10 oct. 2026, 19_30_20-1.png': 'Huile de Jasmin pour diffuseur',
  'Image ChatGPT 10 oct. 2026, 19_30_21-2.png': 'Huile aromatique de Oud',
  'Image ChatGPT 10 oct. 2026, 19_30_22-3.png': 'Huile de Musc pour diffuseur',
  'Image ChatGPT 10 oct. 2026, 19_30_26-4.png': 'Huile aromatique de Gardénia',
  'Image ChatGPT 10 oct. 2026, 19_30_27-5.png': 'Huile aromatique de Ylang-Ylang',
  'Image ChatGPT 10 oct. 2026, 19_30_28-6.png': 'Huile aromatique de Mangue & pêche',
  'Image ChatGPT 10 oct. 2026, 19_30_29-7.png': 'Huile aromatique de framboise',
  'Image ChatGPT 10 oct. 2026, 19_30_31-8.png': 'Huile aromatique de Fraise',
  'Image ChatGPT 10 oct. 2026, 19_30_32-9.png': 'Huile de Monoï',
  'Image ChatGPT 10 oct. 2026, 19_30_33-10.png': 'Huile aromatique de Ambre',

  // Huiles Essentielles (25 products)
  'Image ChatGPT 10 oct. 2026, 19_30_59-1.png': 'Huile essentielle de Lavande',
  'Image ChatGPT 10 oct. 2026, 19_31_01-2.png': 'Huile essentielle de Menthe Poivrée',
  'Image ChatGPT 10 oct. 2026, 19_31_02-3.png': 'Huile essentielle de Tea Tree',
  'Image ChatGPT 10 oct. 2026, 19_31_03-4.png': "Huile essentielle de Cèdre de l'Atlas",
  'Image ChatGPT 10 oct. 2026, 19_31_05-5.png': 'Huile essentielle de Girofle',
  'Image ChatGPT 10 oct. 2026, 19_31_06-6.png': 'Huile essentielle de Citron',
  'Image ChatGPT 10 oct. 2026, 19_31_07-7.png': 'Huile essentielle de Citronnelle',
  'Image ChatGPT 10 oct. 2026, 19_31_09-8.png': 'Huile essentielle de Gingembre',
  'Image ChatGPT 10 oct. 2026, 19_31_10-9.png': "Huile essentielle d'Orange douce",
  'Image ChatGPT 10 oct. 2026, 19_31_11-10.png': 'Huile essentielle de cyprès',
  'Image ChatGPT 10 oct. 2026, 19_41_04-1.png': 'Huile essentielle de Cannelle',
  'Image ChatGPT 10 oct. 2026, 19_41_06-2.png': 'Huile essentielle de Thym Rouge',
  'Image ChatGPT 10 oct. 2026, 19_41_07-3.png': 'Huile essentielle de Bergamote',
  'Image ChatGPT 10 oct. 2026, 19_41_08-4.png': 'Huile essentielle de Patchouli',
  'Image ChatGPT 10 oct. 2026, 19_41_09-5.png': 'Huile essentielle de Ravintsara',
  'Image ChatGPT 10 oct. 2026, 19_41_11-6.png': "Huile essentielle d'origan compact",
  'Image ChatGPT 10 oct. 2026, 19_41_12-7.png': 'Huile essentielle de menthe pouliot',
  'Image ChatGPT 10 oct. 2026, 19_41_13-8.png': 'Huile essentielle de Myrte Rouge',
  'Image ChatGPT 10 oct. 2026, 19_41_15-9.png': 'Huile essentielle de verveine exotique (Litsea cubeba)',
  'Image ChatGPT 10 oct. 2026, 19_41_16-10.png': 'Huile essentielle de Sauge sclarée',
  'Image ChatGPT 10 oct. 2026, 20_02_53-1.png': 'Huile essentielle de Lemongrass (Cymbopogon flexuosus)',
  'Image ChatGPT 10 oct. 2026, 20_02_54-2.png': 'Huile essentielle de bois de Hô',
  'Image ChatGPT 10 oct. 2026, 20_02_55-3.png': "Huile essentielle d'ail",
  'Image ChatGPT 10 oct. 2026, 20_02_57-4.png': 'Huile De CBD 20 % Full Spectrum – Gouttes Sublinguales',
  'Image ChatGPT 10 oct. 2026, 20_02_59-5.png': 'Huile de CBD 30% Full Spectrum – Gouttes sublinguales',

  // Huiles Végétales & Beurres (24 products)
  'Image ChatGPT 10 oct. 2026, 20_13_10-1.png': 'Huile de Ricin',
  'Image ChatGPT 10 oct. 2026, 20_13_11-2.png': 'Huile de Coco',
  'Image ChatGPT 10 oct. 2026, 20_13_12-3.png': 'Huile de Fenugrec',
  'Image ChatGPT 10 oct. 2026, 20_13_14-4.png': 'Huile de Moutarde',
  'Image ChatGPT 10 oct. 2026, 20_13_15-5.png': "Gel d'aloe vera",
  'Image ChatGPT 10 oct. 2026, 20_13_16-6.png': 'Beurre de Karité',
  'Image ChatGPT 10 oct. 2026, 20_13_18-7.png': "Huile d'avocat",
  'Image ChatGPT 10 oct. 2026, 20_13_19-8.png': 'Huile de sésame',
  'Image ChatGPT 10 oct. 2026, 20_13_21-9.png': "Huile d'aloe Vera",
  'Image ChatGPT 10 oct. 2026, 20_13_23-10.png': 'Huile de Chanvre',
  'Image ChatGPT 10 oct. 2026, 20_19_01-1.png': 'Huile de pépins de raisin',
  'Image ChatGPT 10 oct. 2026, 20_19_03-2.png': 'Beurre de Cacao',
  'Image ChatGPT 10 oct. 2026, 20_19_04-3.png': "Huile d'Ail",
  'Image ChatGPT 10 oct. 2026, 20_19_05-4.png': "Huile d'oignon",
  'Image ChatGPT 10 oct. 2026, 20_19_06-5.png': 'Huile de Macadamia',
  'Image ChatGPT 10 oct. 2026, 20_19_08-6.png': 'Huile de Lin',
  'Image ChatGPT 10 oct. 2026, 20_19_09-7.png': 'Huile de carotte',
  'Image ChatGPT 10 oct. 2026, 20_19_11-8.png': 'Huile bronzante',
  'Image ChatGPT 10 oct. 2026, 20_19_12-9.png': "Huile de Noyaux d'abricot",
  'Image ChatGPT 10 oct. 2026, 20_19_13-10.png': 'Huile de pépins de courge',
  'Image ChatGPT 10 oct. 2026, 20_24_25-1.png': 'Huile de germe de blé',
  'Image ChatGPT 10 oct. 2026, 20_24_26-2.png': 'Huile de cannelle',
  'Image ChatGPT 10 oct. 2026, 20_24_28-3.png': 'Beurre de Mangue',
  'Image ChatGPT 10 oct. 2026, 20_24_29-4.png': 'Huile de Noisette'
};

async function main() {
  console.log('--- Step 1: Loading Target Products from Supabase ---');
  const { data: dbProducts, error } = await supabase
    .from('Product')
    .select(`
      id, sku,
      category:Category(translations:CategoryTranslation(name, language)),
      translations:ProductTranslation(name, language, slug)
    `)
    .or('sku.like.MO-HA-%,sku.like.MO-HE-%,sku.like.MO-HV-%');

  if (error || !dbProducts) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Loaded ${dbProducts.length} target products.`);

  const productsList = dbProducts.map(p => {
    const rawFrName = p.translations?.find(t => t.language === 'fr')?.name || '';
    const frName = decodeHtml(rawFrName);
    const frSlug = p.translations?.find(t => t.language === 'fr')?.slug || p.sku.toLowerCase();
    const catName = p.category?.translations?.find(t => t.language === 'fr')?.name || '';
    return {
      id: p.id,
      sku: p.sku,
      frName,
      frSlug,
      catName,
      normName: normalize(frName)
    };
  });

  const files = Object.keys(imageToProductNameMap);
  console.log(`Processing ${files.length} transparent images...\n`);

  let successCount = 0;
  let totalSavedBytes = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const targetName = imageToProductNameMap[file];
    const targetNorm = normalize(targetName);

    const product = productsList.find(p => p.normName === targetNorm);
    if (!product) {
      console.error(`❌ Product not found for "${targetName}" (file: ${file})`);
      continue;
    }

    const inputPath = path.join(inputDir, file);
    const stat = fs.statSync(inputPath);
    const origSizeKB = Math.round(stat.size / 1024);

    // 1. Convert to WebP buffer using Sharp
    const webpBuffer = await sharp(inputPath)
      .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();

    const newSizeKB = Math.round(webpBuffer.length / 1024);
    const savingsPercent = Math.round(((origSizeKB - newSizeKB) / origSizeKB) * 100);
    totalSavedBytes += (stat.size - webpBuffer.length);

    // 2. Upload to Supabase Storage bucket 'products'
    const storageFileName = `${Date.now()}-${product.frSlug}-transparent.webp`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('products')
      .upload(storageFileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadErr) {
      console.error(`❌ Upload error for ${product.frName}:`, uploadErr);
      continue;
    }

    // 3. Get Public CDN URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(storageFileName);

    // 4. Update ProductImage in Database
    // Delete existing images for this product
    await supabase.from('ProductImage').delete().eq('productId', product.id);

    // Insert new primary image
    const { error: dbErr } = await supabase.from('ProductImage').insert({
      productId: product.id,
      url: publicUrl,
      isPrimary: true
    });

    if (dbErr) {
      console.error(`❌ DB error for ${product.frName}:`, dbErr);
    } else {
      successCount++;
      console.log(`[${successCount}/${files.length}] ✅ [${product.catName}] ${product.frName} (${product.sku})`);
      console.log(`   Source: "${file}" (${origSizeKB} KB -> ${newSizeKB} KB, -${savingsPercent}%)`);
      console.log(`   CDN URL: ${publicUrl}\n`);
    }
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 ALL ${successCount}/${files.length} TRANSPARENT IMAGES PROCESSED & LINKED!`);
  console.log(`Total Storage Saved by WebP Compression: ~${Math.round(totalSavedBytes / (1024 * 1024))} MB`);
  console.log(`Images are hosted live on Supabase Storage bucket 'products'.`);
  console.log(`=============================================================\n`);
}

main();
