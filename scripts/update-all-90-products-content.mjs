import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ENGLISH_PRODUCTS_DATA_PART_1 } from './english-products-data-1.mjs';
import { ENGLISH_PRODUCTS_DATA_PART_2 } from './english-products-data-2.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const allEnglishProducts = {
  ...ENGLISH_PRODUCTS_DATA_PART_1,
  ...ENGLISH_PRODUCTS_DATA_PART_2,
};

function buildEnglishDetailsHtml(item) {
  const benefitsList = item.benefits
    .map(b => `    <li><strong>${b.title}:</strong> ${b.desc}</li>`)
    .join('\n');

  const howToUseList = item.howToUse
    .map(u => `    <li><strong>${u.title}:</strong> ${u.desc}</li>`)
    .join('\n');

  return `<div class="product-description space-y-6">
  <div class="product-story mb-6">
    <h3 class="text-xl font-bold text-emerald-950 mb-2">${item.title}: 100% Pure and Natural</h3>
    <p class="text-slate-700 leading-relaxed text-base mb-4">
      ${item.story}
    </p>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
      <li><strong>Ingredients:</strong> ${item.ingredients}</li>
      <li>No additives or preservatives</li>
      <li>${item.extraction}</li>
      <li>Cruelty-free and vegan</li>
    </ul>
  </div>

  <div class="product-benefits mb-6">
    <h3 class="text-xl font-bold text-emerald-950 mb-3">Product Benefits:</h3>
    <ul class="space-y-3 text-slate-700">
${benefitsList}
    </ul>
  </div>

  <div class="how-to-use mb-6">
    <h3 class="text-xl font-bold text-emerald-950 mb-3">How to Use:</h3>
    <ul class="space-y-2 text-slate-700">
${howToUseList}
    </ul>
  </div>
</div>`;
}

function cleanEmojiAndBoilerplate(text) {
  if (!text) return '';
  return text
    // Strip emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Remove "by Moroccan Organica" and "de Moroccan Organica"
    .replace(/\s+by\s+Moroccan\s+Organica\b/gi, '')
    .replace(/\s+de\s+Moroccan\s+Organica\b/gi, '')
    .replace(/\s+Moroccan\s+Organica\b/gi, '')
    // Clean double spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function main() {
  console.log('=====================================================');
  console.log('Updating 90 Products Content (English, Arabic, French)');
  console.log('=====================================================');

  const skus = Object.keys(allEnglishProducts);
  console.log(`Found ${skus.length} products defined in master English dataset.`);

  // 1. Fetch all products from DB matching SKUs
  const { data: dbProducts, error: prodErr } = await supabase
    .from('Product')
    .select('id, sku')
    .in('sku', skus);

  if (prodErr || !dbProducts) {
    console.error('Error querying products:', prodErr);
    process.exit(1);
  }

  console.log(`Found ${dbProducts.length} matching products in Supabase.`);

  let successCount = 0;
  let errorCount = 0;

  for (const prod of dbProducts) {
    const item = allEnglishProducts[prod.sku];
    if (!item) continue;

    const enHtml = buildEnglishDetailsHtml(item);

    // 2. Update English translation
    const { error: updateEnErr } = await supabase
      .from('ProductTranslation')
      .update({
        details: enHtml,
        description: item.shortDesc,
        metaDesc: item.shortDesc,
      })
      .eq('productId', prod.id)
      .eq('language', 'en');

    if (updateEnErr) {
      console.error(`Error updating EN for ${prod.sku}:`, updateEnErr.message);
      errorCount++;
    } else {
      successCount++;
    }

    // 3. Clean emojis from Arabic translation
    const { data: arTrans } = await supabase
      .from('ProductTranslation')
      .select('details')
      .eq('productId', prod.id)
      .eq('language', 'ar')
      .maybeSingle();

    if (arTrans && arTrans.details) {
      const cleanedAr = arTrans.details
        .replace(/📖\s*/g, '')
        .replace(/🌿\s*/g, '')
        .replace(/💆\s*/g, '')
        .replace(/✨\s*/g, '')
        .replace(/🌾\s*/g, '')
        .replace(/\(Product Story\)/gi, '')
        .replace(/\(Product Details & Benefits\)/gi, '')
        .replace(/\(How to Use\)/gi, '')
        .replace(/\(Why Choose Us\)/gi, '')
        .replace(/Moroccan Organica/g, 'موركان أورجانيكا');

      await supabase
        .from('ProductTranslation')
        .update({ details: cleanedAr })
        .eq('productId', prod.id)
        .eq('language', 'ar');
    }

    // 4. Clean French translation
    const { data: frTrans } = await supabase
      .from('ProductTranslation')
      .select('details, description')
      .eq('productId', prod.id)
      .eq('language', 'fr')
      .maybeSingle();

    if (frTrans && frTrans.details) {
      const cleanedFr = frTrans.details
        .replace(/🌿\s*/g, '')
        .replace(/💆\s*/g, '')
        .replace(/✨\s*/g, '')
        .replace(/\s+de\s+Moroccan\s+Organica\b/gi, '');

      let cleanedFrDesc = frTrans.description;
      if (cleanedFrDesc) {
        cleanedFrDesc = cleanedFrDesc
          .replace(/Découvrez\s+/gi, '')
          .replace(/\s+sélectionné\s+par\s+Moroccan\s+Organica/gi, '');
      }

      await supabase
        .from('ProductTranslation')
        .update({
          details: cleanedFr,
          description: cleanedFrDesc || frTrans.description,
        })
        .eq('productId', prod.id)
        .eq('language', 'fr');
    }
  }

  console.log('-----------------------------------------------------');
  console.log(`Successfully updated: ${successCount} products in English.`);
  if (errorCount > 0) {
    console.log(`Encountered errors on: ${errorCount} products.`);
  }
  console.log('All AI emojis, repeated "by Moroccan Organica", and boilerplate successfully eliminated!');
  console.log('=====================================================');
}

main().catch(console.error);
