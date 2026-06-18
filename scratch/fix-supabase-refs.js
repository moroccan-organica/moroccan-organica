const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') walk(full, acc);
    else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const root = path.join(process.cwd(), 'src');
for (const file of walk(root)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("from '@/lib/supabase-admin'")) continue;

  const updated = content.replace(/\bsupabase\b(?!Admin|-)/g, 'supabaseAdmin');
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('fixed', path.relative(process.cwd(), file));
  }
}
