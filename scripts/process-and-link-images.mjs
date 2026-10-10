import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oefpdrpczzbljvyhgtom.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const inputDir = 'c:/Users/AI HUB/Desktop/mdf/organianext/poder abad';
const outputDir = 'c:/Users/AI HUB/Desktop/mdf/organianext/public/images/products';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
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

// Complete verified 1-to-1 overrides
const manualOverrides = {
  // Poudres (00_40_36 to 00_40_42 & 01_14_21 to 01_14_29)
  'Image ChatGPT 10 oct. 2026, 00_40_36-1.png': "Poudre d'Amla",
  'Image ChatGPT 10 oct. 2026, 00_40_37-2.png': 'Poudre de Shikakai',
  'Image ChatGPT 10 oct. 2026, 00_40_38-3.png': 'Poudre de Kapoor Kachli',
  'Image ChatGPT 10 oct. 2026, 00_40_39-4.png': "Poudre d'hibiscus",
  'Image ChatGPT 10 oct. 2026, 00_40_39-5.png': "Poudre d'indigo",
  'Image ChatGPT 10 oct. 2026, 00_40_40-6.png': 'la Poudre de Brahmi',
  'Image ChatGPT 10 oct. 2026, 00_40_41-7.png': 'Poudre de Sidr',
  'Image ChatGPT 10 oct. 2026, 00_40_42-8.png': 'la poudre de Bhringaraj',
  'Image ChatGPT 10 oct. 2026, 00_40_42-9.png': 'Argile verte surfine',
  'Image ChatGPT 10 oct. 2026, 01_14_21-1.png': 'Poudre de Nila',
  'Image ChatGPT 10 oct. 2026, 01_14_21-2.png': 'La Poudre de Moringa',
  'Image ChatGPT 10 oct. 2026, 01_14_22-3.png': 'Henné de Rajasthan',
  'Image ChatGPT 10 oct. 2026, 01_14_23-4.png': 'Argile blanche surfine',
  'Image ChatGPT 10 oct. 2026, 01_14_24-5.png': 'Poudre de Neem BIO',
  'Image ChatGPT 10 oct. 2026, 01_14_25-6.png': 'Henné neutre',
  'Image ChatGPT 10 oct. 2026, 01_14_26-7.png': "Poudre d'ortie",
  'Image ChatGPT 10 oct. 2026, 01_14_27-8.png': "Poudre d'aloe vera",
  'Image ChatGPT 10 oct. 2026, 01_14_28-9.png': 'Argile rouge surfine',
  'Image ChatGPT 10 oct. 2026, 01_14_29-10.png': 'Poudre de Katha',

  // Huiles Aromatiques (01_23_38 to 01_23_48)
  'Image ChatGPT 10 oct. 2026, 01_23_38-1.png': 'Huile de Jasmin pour diffuseur',
  'Image ChatGPT 10 oct. 2026, 01_23_39-2.png': 'Huile aromatique de Oud',
  'Image ChatGPT 10 oct. 2026, 01_23_40-3.png': 'Huile de Musc pour diffuseur',
  'Image ChatGPT 10 oct. 2026, 01_23_41-4.png': 'Huile aromatique de Gardénia',
  'Image ChatGPT 10 oct. 2026, 01_23_41-5.png': 'Huile aromatique de Ylang-Ylang',
  'Image ChatGPT 10 oct. 2026, 01_23_42-6.png': 'Huile aromatique de Mangue & pêche',
  'Image ChatGPT 10 oct. 2026, 01_23_43-7.png': 'Huile aromatique de framboise',
  'Image ChatGPT 10 oct. 2026, 01_23_45-8.png': 'Huile aromatique de Fraise',
  'Image ChatGPT 10 oct. 2026, 01_23_47-9.png': 'Huile de Monoï',
  'Image ChatGPT 10 oct. 2026, 01_23_48-10.png': 'Huile aromatique de Ambre',

  // Huiles Essentielles (01_32_31 to 01_32_39 & 01_38_56 to 01_39_04 & 01_42_07 to 01_42_10)
  'Image ChatGPT 10 oct. 2026, 01_32_31-1.png': 'Huile essentielle de Lavande',
  'Image ChatGPT 10 oct. 2026, 01_32_32-2.png': 'Huile essentielle de Menthe Poivrée',
  'Image ChatGPT 10 oct. 2026, 01_32_33-3.png': 'Huile essentielle de Tea Tree',
  'Image ChatGPT 10 oct. 2026, 01_32_34-4.png': "Huile essentielle de Cèdre de l'Atlas",
  'Image ChatGPT 10 oct. 2026, 01_32_35-5.png': 'Huile essentielle de Girofle',
  'Image ChatGPT 10 oct. 2026, 01_32_35-6.png': 'Huile essentielle de Citron',
  'Image ChatGPT 10 oct. 2026, 01_32_36-7.png': 'Huile essentielle de Citronnelle',
  'Image ChatGPT 10 oct. 2026, 01_32_37-8.png': 'Huile essentielle de Gingembre',
  'Image ChatGPT 10 oct. 2026, 01_32_38-9.png': "Huile essentielle d'Orange douce",
  'Image ChatGPT 10 oct. 2026, 01_32_39-10.png': 'Huile essentielle de cyprès',
  'Image ChatGPT 10 oct. 2026, 01_38_56-1.png': 'Huile essentielle de Cannelle',
  'Image ChatGPT 10 oct. 2026, 01_38_57-2.png': 'Huile essentielle de Thym Rouge',
  'Image ChatGPT 10 oct. 2026, 01_38_58-3.png': 'Huile essentielle de Bergamote',
  'Image ChatGPT 10 oct. 2026, 01_38_59-4.png': 'Huile essentielle de Patchouli',
  'Image ChatGPT 10 oct. 2026, 01_39_00-5.png': 'Huile essentielle de Ravintsara',
  'Image ChatGPT 10 oct. 2026, 01_39_00-6.png': "Huile essentielle d'origan compact",
  'Image ChatGPT 10 oct. 2026, 01_39_02-7.png': 'Huile essentielle de menthe pouliot',
  'Image ChatGPT 10 oct. 2026, 01_39_03-8.png': 'Huile essentielle de Myrte Rouge',
  'Image ChatGPT 10 oct. 2026, 01_39_04-9.png': 'Huile essentielle de verveine exotique (Litsea cubeba)',
  'Image ChatGPT 10 oct. 2026, 01_39_04-10.png': 'Huile essentielle de Sauge sclarée',
  'Image ChatGPT 10 oct. 2026, 01_42_07-1.png': 'Huile essentielle de Lemongrass (Cymbopogon flexuosus)',
  'Image ChatGPT 10 oct. 2026, 01_42_07-2.png': 'Huile essentielle de bois de Hô',
  'Image ChatGPT 10 oct. 2026, 01_42_08-3.png': "Huile essentielle d'ail",
  'Image ChatGPT 10 oct. 2026, 01_42_09-4.png': 'Huile De CBD 20 % Full Spectrum – Gouttes Sublinguales',
  'Image ChatGPT 10 oct. 2026, 01_42_10-5.png': 'Huile de CBD 30% Full Spectrum – Gouttes sublinguales',

  // Huiles Végétales & Beurres (01_47_39 to 01_47_47 & 01_54_10 to 01_54_19 & 02_03_05 to 02_03_08)
  'Image ChatGPT 10 oct. 2026, 01_47_39-1.png': 'Huile de Ricin',
  'Image ChatGPT 10 oct. 2026, 01_47_40-2.png': 'Huile de Coco',
  'Image ChatGPT 10 oct. 2026, 01_47_41-3.png': 'Huile de Fenugrec',
  'Image ChatGPT 10 oct. 2026, 01_47_42-4.png': 'Huile de Moutarde',
  'Image ChatGPT 10 oct. 2026, 01_47_43-5.png': "Gel d'aloe vera",
  'Image ChatGPT 10 oct. 2026, 01_47_44-6.png': 'Beurre de Karité',
  'Image ChatGPT 10 oct. 2026, 01_47_44-7.png': "Huile d'avocat",
  'Image ChatGPT 10 oct. 2026, 01_47_45-8.png': 'Huile de sésame',
  'Image ChatGPT 10 oct. 2026, 01_47_46-9.png': "Huile d'aloe Vera",
  'Image ChatGPT 10 oct. 2026, 01_47_47-10.png': 'Huile de Chanvre',
  'Image ChatGPT 10 oct. 2026, 01_54_10-1.png': 'Huile de pépins de raisin',
  'Image ChatGPT 10 oct. 2026, 01_54_11-2.png': 'Beurre de Cacao',
  'Image ChatGPT 10 oct. 2026, 01_54_12-3.png': "Huile d'Ail",
  'Image ChatGPT 10 oct. 2026, 01_54_13-4.png': "Huile d'oignon",
  'Image ChatGPT 10 oct. 2026, 01_54_14-5.png': 'Huile de Macadamia',
  'Image ChatGPT 10 oct. 2026, 01_54_15-6.png': 'Huile de Lin',
  'Image ChatGPT 10 oct. 2026, 01_54_16-7.png': 'Huile de carotte',
  'Image ChatGPT 10 oct. 2026, 01_54_17-8.png': 'Huile bronzante',
  'Image ChatGPT 10 oct. 2026, 01_54_18-9.png': "Huile de Noyaux d'abricot",
  'Image ChatGPT 10 oct. 2026, 01_54_19-10.png': 'Huile de pépins de courge',
  'Image ChatGPT 10 oct. 2026, 02_03_05-1.png': 'Huile de germe de blé',
  'Image ChatGPT 10 oct. 2026, 02_03_06-2.png': 'Huile de cannelle',
  'Image ChatGPT 10 oct. 2026, 02_03_07-3.png': 'Beurre de Mangue',
  'Image ChatGPT 10 oct. 2026, 02_03_08-4.png': 'Huile de Noisette',

  // Hydrolats (02_23_05 to 02_23_14 + Bidon basilic)
  'Bidon d’hydrolat de basilic marocain.png': 'Hydrolat de Basilic',
  'Image ChatGPT 10 oct. 2026, 02_23_05-1.png': 'Hydrolat de Jujubier / Sidr',
  'Image ChatGPT 10 oct. 2026, 02_23_06-2.png': 'Hydrolat de Lavande',
  'Image ChatGPT 10 oct. 2026, 02_23_07-3.png': 'Hydrolat de Réglisse',
  'Image ChatGPT 10 oct. 2026, 02_23_08-4.png': "Hydrolat d'orange",
  'Image ChatGPT 10 oct. 2026, 02_23_09-5.png': 'Hydrolat de Néroli',
  'Image ChatGPT 10 oct. 2026, 02_23_10-6.png': 'Hydrolat de Menthe poivrée',
  'Image ChatGPT 10 oct. 2026, 02_23_11-7.png': 'Hydrolat de camomille',
  'Image ChatGPT 10 oct. 2026, 02_23_12-8.png': 'Hydrolat de Clou de Girofle',
  'Image ChatGPT 10 oct. 2026, 02_23_13-9.png': 'Hydrolat de Sauge',
  'Image ChatGPT 10 oct. 2026, 02_23_14-10.png': 'Hydrolat de Cannelle'
};

async function main() {
  console.log('--- Step 1: Loading Products from Database ---');
  const { data: dbProducts, error } = await supabase
    .from('Product')
    .select(`
      id, sku, basePrice, placement,
      category:Category(id, translations:CategoryTranslation(name, language)),
      translations:ProductTranslation(name, language, slug)
    `)
    .like('sku', 'MO-%');

  if (error || !dbProducts) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Loaded ${dbProducts.length} MO- products from DB.`);

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
      normName: normalize(frName),
      normSlug: normalize(frSlug)
    };
  });

  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
  console.log(`Found ${files.length} images to match.\n`);

  const matchedResults = [];
  const assignedProductIds = new Set();
  const unmatched = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(inputDir, file);
    const stat = fs.statSync(filePath);

    if (manualOverrides[file]) {
      const targetNorm = normalize(manualOverrides[file]);
      const found = productsList.find(p => p.normName === targetNorm && !assignedProductIds.has(p.id));
      if (found) {
        assignedProductIds.add(found.id);
        matchedResults.push({
          file,
          product: found,
          origSizeKB: Math.round(stat.size / 1024),
          method: 'VERIFIED_100_MATCH'
        });
        continue;
      } else {
        console.error(`Override target not found or already assigned: "${manualOverrides[file]}" for file "${file}"`);
      }
    }

    unmatched.push(file);
  }

  console.log(`\n========================================`);
  console.log(`Matching Summary: ${matchedResults.length}/${files.length} matched.`);
  console.log(`========================================`);

  if (unmatched.length > 0) {
    console.error('⚠️ UNMATCHED IMAGES:', unmatched);
    return;
  }

  console.log('\n--- Step 3: Compressing to WebP and Linking to Supabase ---');
  let totalSavedBytes = 0;
  let successCount = 0;

  for (let idx = 0; idx < matchedResults.length; idx++) {
    const item = matchedResults[idx];
    const inputPath = path.join(inputDir, item.file);
    const targetFileName = `${item.product.frSlug}.webp`;
    const outputPath = path.join(outputDir, targetFileName);

    // 1. Convert to WebP using Sharp
    const info = await sharp(inputPath)
      .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath);

    const newSizeKB = Math.round(info.size / 1024);
    const savingsPercent = Math.round(((item.origSizeKB - newSizeKB) / item.origSizeKB) * 100);
    totalSavedBytes += (item.origSizeKB * 1024 - info.size);

    const relativeUrl = `/images/products/${targetFileName}`;

    // 2. Link to DB ProductImage
    await supabase.from('ProductImage').delete().eq('productId', item.product.id);
    
    const { error: imgErr } = await supabase.from('ProductImage').insert({
      productId: item.product.id,
      url: relativeUrl,
      isPrimary: true
    });

    if (imgErr) {
      console.error(`Error saving image for ${item.product.frName}:`, imgErr);
    } else {
      successCount++;
      console.log(`[${idx + 1}/${matchedResults.length}] ✅ [${item.product.catName}] ${item.product.frName} (${item.product.sku})`);
      console.log(`   Source: "${item.file}" -> ${targetFileName}`);
      console.log(`   Size: ${item.origSizeKB} KB -> ${newSizeKB} KB (-${savingsPercent}%) | URL: ${relativeUrl}\n`);
    }
  }

  const unassigned = productsList.filter(p => !assignedProductIds.has(p.id));

  console.log(`\n=============================================================`);
  console.log(`🎉 ALL ${successCount}/${files.length} IMAGES PROCESSED & LINKED TO DATABASE!`);
  console.log(`Total Storage Saved: ~${Math.round(totalSavedBytes / (1024 * 1024))} MB`);
  if (unassigned.length > 0) {
    console.log(`\nRemaining Products in DB without image in this batch (${unassigned.length}):`);
    unassigned.forEach(p => console.log(` - [${p.sku}] ${p.frName}`));
  }
  console.log(`=============================================================\n`);
}

main();
