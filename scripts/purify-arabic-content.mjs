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

// Specific map for clean Arabic product names (100% pure Arabic, no Latin in brackets)
const PURE_ARABIC_NAMES = {
  'MO-PA-1330': 'مسحوق النيم العضوي النقي',
  'MO-PA-1779': 'مسحوق كابور كاشلي الهندي الفاخر',
  'MO-PA-2163': 'مسحوق النيلة الزرقاء الصحراوية الأصلية',
  'MO-PA-2625': 'مسحوق الألوفيرا الطبيعي النقي',
  'MO-PA-3126': 'مسحوق الكاثا الطبيعي للشعر',
  'MO-PA-3132': 'مسحوق براهمي الأيورفيدي النقي',
  'MO-PA-3398': 'مسحوق الأملج الطبيعي النقي (أملا)',
  'MO-PA-3865': 'مسحوق الكركديه الطبيعي النقي',
  'MO-PA-4419': 'طين أبيض ناعم فائق النقاء (كاولين)',
  'MO-PA-5032': 'مسحوق المورينجا العضوي الفاخر',
  'MO-PA-5215': 'مسحوق برينغراج الطبيعي لتقوية الشعر',
  'MO-PA-5597': 'حناء طبيعية محايدة بدون لون (سنا مكي)',
  'MO-PA-5907': 'طين أخضر ناعم فائق الجودة',
  'MO-PA-6409': 'طين أحمر ناعم فائق النقاء',
  'MO-PA-6420': 'حناء راجستان الطبيعية الفاخرة',
  'MO-PA-6900': 'مسحوق الإنديغو الطبيعي لصبغ وتغذية الشعر',
  'MO-PA-7439': 'طين أزرق نقي للبشرة والشعر',
  'MO-PA-7922': 'مسحوق الشيكاكاي الطبيعي لتنظيف وتقوية الشعر',
  'MO-PA-8247': 'مسحوق القراص الطبيعي لتعزيز نمو الشعر',
  'MO-PA-9090': 'مسحوق السدر الطبيعي النقي',

  'MO-HA-3664': 'زيت المونوي الفاخر المعطر',
  'MO-HA-3873': 'زيت الياسمين العطري الفاخر لأجهزة التعطير',
  'MO-HA-4270': 'زيت توت العليق العطري الفاخر',
  'MO-HA-4355': 'زيت المسك الملكي العطري لأجهزة التعطير',
  'MO-HA-5336': 'زيت الغاردينيا العطري الفاخر',
  'MO-HA-5353': 'زيت الإيلنغ العطري الفاخر',
  'MO-HA-5901': 'زيت العود الملكي العطري الفاخر',
  'MO-HA-7850': 'زيت الفراولة الطبيعي العطري المنعش',
  'MO-HA-8466': 'زيت العنبر الملكي العطري الفاخر',
  'MO-HA-9116': 'زيت المانجو والخوخ العطري الاستوائي',

  'MO-HE-1086': 'زيت خشب الهو الأساسي النقي',
  'MO-HE-1174': 'زيت القرفة الأساسي النقي',
  'MO-HE-1897': 'زيت السيترونيلا الأساسي النقي (طارد الناموس)',
  'MO-HE-1935': 'زيت الباتشولي الأساسي الفاخر',
  'MO-HE-2354': 'زيت أرز الأطلس المغربي الأساسي النقي',
  'MO-HE-2828': 'زيت ليتسيا كوبيبا (اللويزة الاستوائية) النقي',
  'MO-HE-3605': 'زيت اللافندر (الخزامى) الأساسي النقي',
  'MO-HE-3890': 'زيت الرافينتسارا العطري الحيوي',
  'MO-HE-4552': 'زيت الليمون الأساسي النقي المنعش',
  'MO-HE-4646': 'زيت الليمونغراس الأساسي المركز',
  'MO-HE-5310': 'زيت النعناع الفلفلي الأساسي النقي المنعش',
  'MO-HE-5389': 'زيت الزعتر الأحمر الأساسي النقي',
  'MO-HE-5475': 'زيت الأوريجانو (الصعتر البري) المركز النقي',
  'MO-HE-5910': 'زيت الزنجبيل الأساسي المركز المنشط',
  'MO-HE-6192': 'زيت القرنفل الأساسي النقي المركز',
  'MO-HE-6217': 'زيت الفليو (النعناع البري) الأساسي المغربي',
  'MO-HE-6237': 'زيت الثوم الأساسي المركز النقي',
  'MO-HE-6294': 'زيت السرو الأساسي النقي',
  'MO-HE-6780': 'زيت البرغموت الأساسي النقي المنعش',
  'MO-HE-7725': 'زيت الميرمية المتصلبة (المريمية) النقي',
  'MO-HE-7822': 'زيت سي بي دي 20% كامل الطيف الطبيعي',
  'MO-HE-8091': 'زيت البرتقال الحلو الأساسي النقي',
  'MO-HE-8525': 'زيت الآس الأحمر الأساسي النقي',
  'MO-HE-9565': 'زيت سي بي دي 30% كامل الطيف عالي التركيز',
  'MO-HE-9705': 'زيت شجرة الشاي الأساسي النقي المطهر',

  'MO-HV-1153': 'زيت التسمير والبرونزاج الطبيعي الذهبي',
  'MO-HV-1923': 'زيت بذور المشمش النقي المعصور على البارد',
  'MO-HV-2251': 'زيت بذور العنب النقي الغني بمضادات الأكسدة',
  'MO-HV-2928': 'زبدة الشيا العضوية الخام غير المكررة',
  'MO-HV-3015': 'زيت بذور القنب النقي المعصور على البارد',
  'MO-HV-3521': 'زيت القرفة الطبيعي للعناية والتدليك',
  'MO-HV-3618': 'زيت جنين القمح النقي الغني بفيتامين هـ',
  'MO-HV-3887': 'زيت السمسم النقي المعصور على البارد',
  'MO-HV-4343': 'جل الألوفيرا الطبيعي النقي 100% المهدئ والمرطب',
  'MO-HV-4699': 'زيت بذور الكتان النقي المعصور على البارد',
  'MO-HV-5048': 'زيت الخروع النقي المركز لتقوية الشعر والرموش',
  'MO-HV-5104': 'زيت جوز الهند البكر النقي العضوي',
  'MO-HV-5198': 'زيت الثوم الطبيعي المغذي لبصيلات الشعر',
  'MO-HV-6435': 'زيت البندق النقي المنقي للبشرة',
  'MO-HV-6649': 'زيت الأفوكادو البكر المغذي للبشرة والشعر',
  'MO-HV-6761': 'زيت المكاديميا النقي المغذي وسريع الامتصاص',
  'MO-HV-6799': 'زيت البصل الطبيعي لإنبات وتقوية الشعر',
  'MO-HV-7576': 'زبدة الكاكاو النقية الخام المرطبة',
  'MO-HV-7842': 'زيت الحلبة الطبيعي النقي لتغذية وشد البشرة',
  'MO-HV-8234': 'زيت الخردل الطبيعي المحفز لنمو الشعر',
  'MO-HV-8252': 'زيت بذور اليقطين (القرع) النقي',
  'MO-HV-8457': 'زيت الألوفيرا الطبيعي المرطب والمجدد للبشرة',
  'MO-HV-9017': 'زيت الجزر الطبيعي لنضارة وإشراقة البشرة',
  'MO-HV-9574': 'زبدة المانجو الطبيعية النقية المرطبة',

  'MO-HY-1479': 'مقطر اللافندر النقي (ماء الخزامى)',
  'MO-HY-1573': 'مقطر قشور البرتقال المنعش',
  'MO-HY-2855': 'مقطر القرفة المنشط للبشرة',
  'MO-HY-4065': 'مقطر براعم القرنفل المطهر',
  'MO-HY-4397': 'مقطر البابونج المهدئ للبشرة الحساسة',
  'MO-HY-4911': 'مقطر الميرمية المنظم للإفرازات',
  'MO-HY-5050': 'مقطر الحبق (الريحان) المنعش',
  'MO-HY-5367': 'مقطر السدر الطبيعي للشعر والبشرة',
  'MO-HY-5831': 'مقطر النعناع الفلفلي المنعش',
  'MO-HY-7556': 'ماء زهر البرتقال النقي (ماء النيرولي الملكي)',
  'MO-HY-8665': 'مقطر عرق السوس لتفتيح وتوحيد لون البشرة'
};

function purifyArabicText(text) {
  if (!text) return '';
  let s = text;

  // Specific terminology conversions
  s = s.replace(/Moroccan Organica/gi, 'موركان أورجانيكا');
  s = s.replace(/فيتامين\s*C\b/gi, 'فيتامين سي');
  s = s.replace(/فيتامين\s*E\b/gi, 'فيتامين هـ');
  s = s.replace(/فيتامين\s*A\b/gi, 'فيتامين أ');
  s = s.replace(/فيتامين\s*D\b/gi, 'فيتامين د');
  s = s.replace(/فيتامين\s*F\b/gi, 'فيتامين إف');
  s = s.replace(/فيتامينات\s*A,\s*D,\s*E/gi, 'فيتامينات أ، د، وهـ');
  s = s.replace(/فيتامينات\s*A\s*و\s*E\s*و\s*F/gi, 'فيتامينات أ وهـ وإف');
  s = s.replace(/فيتامين\s*A\s*و\s*E/gi, 'فيتامين أ وهـ');
  s = s.replace(/\bCBD\b/gi, 'سي بي دي');
  s = s.replace(/\bTHC\b/gi, 'المركبات المحظورة');
  s = s.replace(/\bDHT\b/gi, 'هرمون التساقط');
  s = s.replace(/\bCO2\b/gi, 'ثاني أكسيد الكربون الطبيعي');
  s = s.replace(/\b2000mg\b/gi, '2000 ملغ');
  s = s.replace(/\b3000mg\b/gi, '3000 ملغ');
  s = s.replace(/\bpH\b/gi, 'درجة الحموضة');
  s = s.replace(/Potpourri/gi, 'مجففات الزهور العطرية');
  s = s.replace(/Menthe Pouliot/gi, 'الفليو البري');
  s = s.replace(/Tiaré/gi, 'التاهيتي');
  s = s.replace(/Salvare/gi, 'الشفاء والإنقاذ');
  s = s.replace(/Salvia/gi, 'الميرمية');

  // Remove any parenthesis containing Latin text entirely (e.g. botanical names, English phrases)
  s = s.replace(/\s*\([a-zA-Z0-9\s,\.\-_/’'%&éèêàùôîïç]+\)/g, '');
  
  // Remove any remaining Latin characters
  s = s.replace(/[a-zA-Z]+/g, '').trim();

  // Clean empty parentheses or broken punctuation
  s = s.replace(/\(\s*\)/g, '');
  s = s.replace(/\s{2,}/g, ' ');
  s = s.replace(/\s+([،,\.])/g, '$1');
  return s.trim();
}

function buildPureArabicDetailsHtml(sku, item, cleanName) {
  const cleanStory = purifyArabicText(item.story);
  const cleanIngredients = purifyArabicText(item.details.ingredients);
  const cleanOrigin = purifyArabicText(item.details.origin);
  const cleanShelfLife = purifyArabicText(item.details.shelfLife);
  const cleanHowToUse = purifyArabicText(item.howToUse);
  const cleanWhyChoose = purifyArabicText(item.whyChoose);

  const benefitsList = item.details.benefits
    .map(b => `      <li>${purifyArabicText(b)}</li>`)
    .join('\n');

  return `<div class="product-description space-y-6" dir="rtl">
  <div class="product-story mb-6">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">📖 قصة المنتج</h3>
    <p class="text-slate-700 leading-relaxed text-base">
      ${cleanStory}
    </p>
  </div>

  <div class="product-details mb-6">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">🌿 تفاصيل المنتج والفوائد الرئيسية</h3>
    <ul class="list-disc pr-5 space-y-2 text-slate-700">
      <li><strong>المكونات:</strong> ${cleanIngredients}</li>
      <li><strong>بلد المنشأ:</strong> ${cleanOrigin}</li>
      <li><strong>مدة الصلاحية:</strong> ${cleanShelfLife}</li>
${benefitsList}
    </ul>
  </div>

  <div class="how-to-use mb-6">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">💆 طريقة الاستخدام</h3>
    <p class="text-slate-700 leading-relaxed text-base">
      ${cleanHowToUse}
    </p>
  </div>

  <div class="why-choose bg-[#FDFBF7] p-5 rounded-xl border border-[#E9E5D9]">
    <h3 class="text-xl font-bold text-[#606C38] mb-3">✨ لماذا تختار موركان أورجانيكا؟</h3>
    <p class="text-slate-700 leading-relaxed mb-3">
      ${cleanWhyChoose}
    </p>
    <ul class="list-disc pr-5 space-y-2 text-slate-700">
      <li><strong>طبيعي ونقي 100%:</strong> مستخلص بأعلى معايير النقاء وخالٍ تماماً من الإضافات الكيميائية والكحول والبارابين.</li>
      <li><strong>جودة معتمدة وفاخرة:</strong> محضر بعناية فائقة للحفاظ على كامل العناصر الفعالة والمغذيات الحيوية.</li>
      <li><strong>أخلاقي ومستدام:</strong> غير مجرب على الحيوانات ومستخرج بطرق تحترم البيئة وتدعم الاستدامة.</li>
    </ul>
  </div>
</div>`;
}

async function main() {
  console.log('=== PURIFYING ARABIC CONTENT FOR ALL 90 PRODUCTS (ZERO ENGLISH/LATIN) ===');
  
  const skus = Object.keys(allProductsData);
  const { data: dbProducts } = await supabase
    .from('Product')
    .select('id, sku')
    .in('sku', skus);

  const skuToIdMap = new Map(dbProducts.map(p => [p.sku, p.id]));

  let updatedCount = 0;
  let errorCount = 0;

  for (const sku of skus) {
    const productId = skuToIdMap.get(sku);
    if (!productId) {
      console.warn(`SKU ${sku} not found in DB`);
      continue;
    }

    const item = allProductsData[sku];
    const cleanName = PURE_ARABIC_NAMES[sku] || purifyArabicText(item.name);
    const cleanShortDesc = purifyArabicText(item.shortDesc);
    const pureHtml = buildPureArabicDetailsHtml(sku, item, cleanName);
    const cleanMetaTitle = `${cleanName} طبيعي ونقي 100% | موركان أورجانيكا`;
    const cleanMetaDesc = cleanShortDesc;

    // Verify absolutely ZERO Latin in all translated fields
    const testFields = [cleanName, cleanShortDesc, pureHtml, cleanMetaTitle, cleanMetaDesc];
    // Allow HTML tags in pureHtml, but check inner text content
    const textOnlyFromHtml = pureHtml.replace(/<[^>]+>/g, ' ');
    const testTexts = [cleanName, cleanShortDesc, textOnlyFromHtml, cleanMetaTitle, cleanMetaDesc];
    const latinCheck = testTexts.join(' ').match(/[a-zA-Z]+/g);
    if (latinCheck) {
      console.error(`⚠️ Latin found in ${sku}:`, latinCheck);
    }

    const { error } = await supabase
      .from('ProductTranslation')
      .update({
        name: cleanName,
        h1: cleanName,
        description: cleanShortDesc,
        details: pureHtml,
        metaTitle: cleanMetaTitle,
        metaDesc: cleanMetaDesc
      })
      .eq('productId', productId)
      .eq('language', 'ar');

    if (error) {
      console.error(`Error updating ${sku}:`, error.message);
      errorCount++;
    } else {
      updatedCount++;
      console.log(`✅ [${updatedCount}/${skus.length}] Purified Arabic: ${sku} -> ${cleanName}`);
    }
  }

  console.log('\n=============================================');
  console.log(`🎉 COMPLETED! Successfully purified: ${updatedCount} products`);
  console.log(`Errors: ${errorCount}`);
  console.log('=============================================');
}

main().catch(console.error);
