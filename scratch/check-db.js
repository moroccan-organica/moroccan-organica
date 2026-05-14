
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkImages() {
  console.log('Checking Supabase connection...');
  console.log('URL:', supabaseUrl);

  const { data, error } = await supabase
    .from('ProductImage')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching ProductImage:', error);
    return;
  }

  console.log('ProductImage data (first 5):', data);

  const { data: products, error: prodError } = await supabase
    .from('Product')
    .select('id, sku')
    .limit(5);

  if (prodError) {
    console.error('Error fetching Product:', prodError);
    return;
  }

  console.log('Product data (first 5):', products);
}

checkImages();
