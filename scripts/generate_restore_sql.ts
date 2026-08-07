import * as fs from 'fs'
import * as path from 'path'

const BACKUP_DIR = path.join(process.cwd(), 'supabase_backup')
const DATA_DIR = path.join(BACKUP_DIR, 'data')
const OUTPUT_SQL_PATH = path.join(BACKUP_DIR, 'restore_data.sql')

// Insertion order to satisfy foreign key constraints
const tableOrder = [
  'User',
  'Customer',
  'Category',
  'BlogCategory',
  'StaticPage',
  'GlobalSeoSetting',
  'Post',
  'Address',            // References Customer
  'Product',            // References Category
  'BlogPost',           // References User, BlogCategory
  'Order',              // References Customer, Address
  'ProductVariant',     // References Product
  'ProductTranslation', // References Product
  'ProductImage',       // References Product
  'CategoryTranslation',// References Category
  'StaticPageTranslation', // References StaticPage
  'GlobalSeoTranslation', // References GlobalSeoSetting
  'PostTranslation',    // References Post
  'OrderItem',          // References Order, ProductVariant
  'BlogMedia'           // References BlogPost
]

function formatSqlValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (typeof value === 'number') {
    return value.toString()
  }
  if (typeof value === 'object') {
    // For date arrays or JSON, stringify and escape
    const str = JSON.stringify(value).replace(/'/g, "''")
    return `'${str}'`
  }
  // Escape single quotes for strings
  const escaped = value.replace(/'/g, "''")
  return `'${escaped}'`
}

function generateRestoreSql() {
  console.log('Generating restore SQL script from JSON backups...')
  let sqlStatements: string[] = []

  // Disable triggers during data restoration to prevent any side effects or constraints checking order issues
  sqlStatements.push('-- Disable all triggers')
  sqlStatements.push('SET session_replication_role = \'replica\';\n')

  for (const table of tableOrder) {
    const jsonPath = path.join(DATA_DIR, `${table}.json`)
    if (!fs.existsSync(jsonPath)) {
      continue
    }

    const rows = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    if (!rows || rows.length === 0) {
      continue
    }

    sqlStatements.push(`-- Table: ${table}`)
    for (const row of rows) {
      const columns = Object.keys(row).map(col => `"${col}"`).join(', ')
      const values = Object.values(row).map(formatSqlValue).join(', ')
      sqlStatements.push(`INSERT INTO "${table}" (${columns}) VALUES (${values});`)
    }
    sqlStatements.push('') // empty line
  }

  // Re-enable triggers
  sqlStatements.push('-- Re-enable all triggers')
  sqlStatements.push('SET session_replication_role = \'origin\';')

  fs.writeFileSync(OUTPUT_SQL_PATH, sqlStatements.join('\n'))
  console.log(`✅ Restore SQL script successfully created at ${OUTPUT_SQL_PATH}`)
}

generateRestoreSql()
