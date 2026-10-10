import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ARABIC_PRODUCTS_DATA as d1 } from './arabic-products-data-1.mjs';
import { ARABIC_PRODUCTS_DATA_2 as d2 } from './arabic-products-data-2.mjs';
import { ARABIC_PRODUCTS_DATA_3 as d3 } from './arabic-products-data-3.mjs';
import { ARABIC_PRODUCTS_DATA_4 as d4 } from './arabic-products-data-4.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const allProductsData = { ...d1, ...d2, ...d3, ...d4 };

function buildRichDetailsHtml(item) {
  const benefitsList = item.details.benefits
    .map(b => `    <li>${b}</li>`)
    .join('\n');

  return `<div class="product-description space-y-6" dir="rtl">
  <div class="product-story mb-6">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">📖 قصة المنتج (Product Story)</h3>
    <p class="text-slate-700 leading-relaxed text-base">
      ${item.story}
    </p>
  </div>

  <div class="product-details mb-6">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">🌿 تفاصيل المنتج والفوائد الرئيسية (Product Details & Benefits)</h3>
    <ul class="list-disc pr-5 space-y-2 text-slate-700">
      <li><strong>المكونات:</strong> ${item.details.ingredients}</li>
      <li><strong>بلد المنشأ:</strong> ${item.details.origin}</li>
      <li><strong>مدة الصلاحية:</strong> ${item.details.shelfLife}</li>
${benefitsList}
    </ul>
  </div>

  <div class="how-to-use mb-6">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">💆 طريقة الاستخدام (How to Use)</h3>
    <p class="text-slate-700 leading-relaxed text-base">
      ${item.howToUse}
    </p>
  </div>

  <div class="why-choose bg-[#FDFBF7] p-5 rounded-xl border border-[#E9E5D9]">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">✨ لماذا تختار Moroccan Organica؟ (Why Choose Us)</h3>
    <p class="text-slate-700 leading-relaxed mb-3">
      ${item.whyChoose}
    </p>
    <ul class="list-disc pr-5 space-y-2 text-slate-700">
      <li><strong>طبيعي ونقي 100%:</strong> مستخلص بأعلى معايير النقاء وخالٍ تماماً من الإضافات الكيميائية، الكحول، والبارابين.</li>
      <li><strong>جودة معتمدة وفاخرة:</strong> محضر بعناية فائقة للحفاظ على كامل العناصر الفعالة والمغذيات الحيوية.</li>
      <li><strong>أخلاقي ومستدام (Cruelty-Free):</strong> غير مجرب على الحيوانات ومستخرج بطرق تحترم البيئة وتدعم الاستدامة.</li>
    </ul>
  </div>
</div>`;
}

async function main() {
  console.log('--- Starting Arabic Product Content Update for 90 Products ---');
  
  const skus = Object.keys(allProductsData);
  console.log(`Loaded ${skus.length} product translations.`);

  // Fetch product IDs
  const { data: dbProducts, error: prodErr } = await supabase
    .from('Product')
    .select('id, sku')
    .in('sku', skus);

  if (prodErr || !dbProducts) {
    console.error('Error fetching products from DB:', prodErr);
    process.exit(1);
  }

  const skuToIdMap = new Map(dbProducts.map(p => [p.sku, p.id]));
  console.log(`Found ${dbProducts.length} matching products in DB.`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const [sku, item] of Object.entries(allProductsData)) {
    const productId = skuToIdMap.get(sku);
    if (!productId) {
      console.warn(`⚠️ Warning: SKU ${sku} not found in database.`);
      errorCount++;
      continue;
    }

    const richHtml = buildRichDetailsHtml(item);
    const metaTitle = `${item.name} طبيعي ونقي 100% | Moroccan Organica`;
    const metaDesc = item.shortDesc;

    // Check if Arabic translation already exists
    const { data: existingTrans, error: checkErr } = await supabase
      .from('ProductTranslation')
      .select('id')
      .eq('productId', productId)
      .eq('language', 'ar')
      .single();

    if (checkErr && checkErr.code !== 'PGRST116') {
      console.error(`Error checking translation for ${sku}:`, checkErr);
      errorCount++;
      continue;
    }

    if (existingTrans) {
      // Update existing translation
      const { error: updateErr } = await supabase
        .from('ProductTranslation')
        .update({
          name: item.name,
          h1: item.h1,
          description: item.shortDesc,
          details: richHtml,
          metaTitle: metaTitle,
          metaDesc: metaDesc
        })
        .eq('id', existingTrans.id);

      if (updateErr) {
        console.error(`❌ Error updating ${sku}:`, updateErr.message);
        errorCount++;
      } else {
        updatedCount++;
        console.log(`✅ [${updatedCount}/${skus.length}] Updated Arabic: ${sku} -> ${item.name}`);
      }
    } else {
      // Insert new translation if missing
      const slug = `${sku.toLowerCase()}-ar`;
      const { error: insertErr } = await supabase
        .from('ProductTranslation')
        .insert({
          productId: productId,
          language: 'ar',
          name: item.name,
          h1: item.h1,
          description: item.shortDesc,
          details: richHtml,
          slug: slug,
          metaTitle: metaTitle,
          metaDesc: metaDesc
        });

      if (insertErr) {
        console.error(`❌ Error inserting ${sku}:`, insertErr.message);
        errorCount++;
      } else {
        updatedCount++;
        console.log(`✅ [${updatedCount}/${skus.length}] Inserted Arabic: ${sku} -> ${item.name}`);
      }
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 Finished Arabic Content Update!`);
  console.log(`Successfully updated/inserted: ${updatedCount} products`);
  console.log(`Errors encountered: ${errorCount}`);
  console.log('==================================================');
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
