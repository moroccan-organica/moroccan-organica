const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

async function compressPngInBucket(bucket) {
  const { data: files, error: listError } = await supabase.storage.from(bucket).list('', {
    limit: 1000,
  });

  if (listError) throw listError;

  const pngNames = (files || [])
    .map((f) => f.name)
    .filter((name) => name.toLowerCase().endsWith('.png'));

  if (pngNames.length === 0) {
    console.log(`No PNG files in bucket "${bucket}".`);
    return { converted: 0, savedBytes: 0 };
  }

  let converted = 0;
  let savedBytes = 0;

  for (const oldName of pngNames) {
    const oldUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${oldName}`;
    const newName = oldName.replace(/\.png$/i, '.webp');

    console.log(`\n[${bucket}] ${oldName}`);

    const response = await fetch(oldUrl);
    if (!response.ok) {
      console.error(`  Failed to download: ${response.status}`);
      continue;
    }

    const originalBuffer = Buffer.from(await response.arrayBuffer());
    const originalSize = originalBuffer.length;

    const compressedBuffer = await sharp(originalBuffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const newSize = compressedBuffer.length;
    console.log(
      `  ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB WebP`
    );

    const { error: uploadError } = await supabase.storage.from(bucket).upload(newName, compressedBuffer, {
      contentType: 'image/webp',
      upsert: true,
    });

    if (uploadError) {
      console.error(`  Upload failed:`, uploadError.message);
      continue;
    }

    const {
      data: { publicUrl: newUrl },
    } = supabase.storage.from(bucket).getPublicUrl(newName);

    if (bucket === 'products') {
      const { data: productImages } = await supabase
        .from('ProductImage')
        .select('id, url')
        .like('url', `%/${oldName}`);

      for (const row of productImages || []) {
        const { error: updateError } = await supabase
          .from('ProductImage')
          .update({ url: newUrl })
          .eq('id', row.id);
        if (updateError) console.error(`  ProductImage update failed:`, updateError.message);
      }
      console.log(`  Updated ${productImages?.length || 0} ProductImage row(s)`);
    }

    if (bucket === 'blog') {
      const { data: blogMedia } = await supabase
        .from('BlogMedia')
        .select('id, url')
        .or(`url.like.%/${oldName},storagePath.eq.${oldName}`);

      for (const row of blogMedia || []) {
        const { error: updateError } = await supabase
          .from('BlogMedia')
          .update({
            url: newUrl,
            storagePath: newName,
            mimeType: 'image/webp',
            fileSizeBytes: newSize,
          })
          .eq('id', row.id);
        if (updateError) console.error(`  BlogMedia update failed:`, updateError.message);
      }
      console.log(`  Updated ${blogMedia?.length || 0} BlogMedia row(s)`);

      const { data: blogPosts } = await supabase
        .from('BlogPost')
        .select('id, title, content')
        .like('content', `%${oldName}%`);

      for (const post of blogPosts || []) {
        const updatedContent = post.content.replaceAll(oldUrl, newUrl).replaceAll(oldName, newName);
        const { error: postError } = await supabase
          .from('BlogPost')
          .update({ content: updatedContent })
          .eq('id', post.id);
        if (postError) console.error(`  BlogPost update failed:`, postError.message);
        else console.log(`  Updated BlogPost content: "${post.title}"`);
      }
    }

    const { error: removeError } = await supabase.storage.from(bucket).remove([oldName]);
    if (removeError) {
      console.error(`  Failed to delete old PNG:`, removeError.message);
      continue;
    }

    converted += 1;
    savedBytes += originalSize - newSize;
    console.log(`  Deleted old PNG`);
  }

  return { converted, savedBytes };
}

async function main() {
  console.log('Compressing PNG images to WebP...\n');

  const products = await compressPngInBucket('products');
  const blog = await compressPngInBucket('blog');

  const totalConverted = products.converted + blog.converted;
  const totalSaved = products.savedBytes + blog.savedBytes;

  console.log('\n--- Summary ---');
  console.log(`Converted: ${totalConverted} file(s)`);
  console.log(`Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);

  const { data: afterProducts } = await supabase.storage.from('products').list('', { limit: 1000 });
  const { data: afterBlog } = await supabase.storage.from('blog').list('', { limit: 1000 });
  console.log(`products bucket: ${afterProducts?.length ?? 0} files`);
  console.log(`blog bucket: ${afterBlog?.length ?? 0} files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
