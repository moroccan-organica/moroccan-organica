const fs = require('fs');
const path = require('path');

const files = [
  'src/actions/media.actions.ts',
  'src/app/sitemap.ts',
  'src/actions/product.actions.ts',
  'src/lib/blog/actions.ts',
  'src/app/api/admin/settings/seo/route.ts',
  'src/actions/static-page.actions.ts',
  'src/actions/seo.actions.ts',
  'src/actions/category.actions.ts',
  'src/app/api/blog/upload/route.ts',
  'src/app/api/blog/posts/route.ts',
  'src/app/api/blog/media/route.ts',
  'src/app/api/blog/posts/[id]/route.ts',
  'src/lib/auth.ts',
  'src/app/api/blog/posts/[id]/publish/route.ts',
  'src/app/api/blog/posts/[id]/archive/route.ts',
  'src/app/api/blog/categories/route.ts',
  'src/app/api/blog/categories/[id]/route.ts',
  'src/app/api/admin/static-pages/[id]/route.ts',
  'src/app/api/admin/static-pages/route.ts',
  'src/app/api/admin/orders/[id]/route.ts',
  'src/app/api/admin/orders/route.ts',
  'src/app/api/admin/customers/route.ts',
  'src/actions/order.actions.ts',
  'src/actions/dashboard.actions.ts',
  'src/actions/customer.actions.ts',
];

for (const rel of files) {
  const file = path.join(process.cwd(), rel);
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ supabase \} from ['"]@\/lib\/supabase['"];\r?\n?/g, '');
  if (!content.includes("@/lib/supabase-admin")) {
    content = `import { supabaseAdmin } from '@/lib/supabase-admin';\n${content}`;
  }
  content = content.replace(/\bsupabase\./g, 'supabaseAdmin.');
  content = content.replace(
    /import \{ supabaseAdmin \} from '@\/lib\/supabase-admin';\r?\nimport \{ supabaseAdmin \} from '@\/lib\/supabase-admin';\r?\n/g,
    "import { supabaseAdmin } from '@/lib/supabase-admin';\n"
  );
  fs.writeFileSync(file, content);
  console.log('updated', rel);
}
