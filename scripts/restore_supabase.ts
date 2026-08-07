import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables. We'll look for .env.new first, then fallback to .env
const envPath = fs.existsSync('.env.new') ? '.env.new' : '.env'
console.log(`ℹ️ Loading environment from: ${envPath}`)
dotenv.config({ path: envPath })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in your env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  }
})

const BACKUP_DIR = path.join(process.cwd(), 'supabase_backup')
const DATA_DIR = path.join(BACKUP_DIR, 'data')
const STORAGE_DIR = path.join(BACKUP_DIR, 'storage')

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

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    case '.json':
      return 'application/json'
    case '.pdf':
      return 'application/pdf'
    default:
      return 'application/octet-stream'
  }
}

// Recursively walk through a directory and list all file paths
function getFilesRecursively(dir: string, baseDir = dir): string[] {
  let results: string[] = []
  if (!fs.existsSync(dir)) return results

  const list = fs.readdirSync(dir)
  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, baseDir))
    } else {
      // Get path relative to the base directory
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/')
      results.push(relativePath)
    }
  }
  return results
}

async function restoreDatabase() {
  console.log('🚀 Starting Supabase Full Restore...')
  console.log(`Target URL: ${supabaseUrl}`)

  if (!fs.existsSync(BACKUP_DIR)) {
    console.error(`❌ Error: Backup directory not found at ${BACKUP_DIR}. Please run backup first.`)
    process.exit(1)
  }

  // --- PHASE 1: DATABASE RESTORATION ---
  console.log('\n📦 Phase 1: Restoring database tables...')

  for (const table of tableOrder) {
    const jsonPath = path.join(DATA_DIR, `${table}.json`)
    if (!fs.existsSync(jsonPath)) {
      console.log(`- Table '${table}': Backup file not found, skipping.`)
      continue
    }

    const rows = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    if (!rows || rows.length === 0) {
      console.log(`- Table '${table}': 0 rows to import, skipping.`)
      continue
    }

    console.log(`- Table '${table}': Importing ${rows.length} rows...`)

    // To prevent API payload limits or timeouts, insert in chunks
    const CHUNK_SIZE = 50
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE)
      const { error } = await supabase.from(table).insert(chunk)

      if (error) {
        console.error(`  ❌ Failed to insert chunk [${i} to ${i + chunk.length}] for table '${table}': ${error.message}`)
        console.error(`  Details:`, JSON.stringify(error, null, 2))
        process.exit(1)
      }
    }
    console.log(`  ✅ Successfully imported all rows for table '${table}'`)
  }

  // --- PHASE 2: STORAGE RESTORATION ---
  console.log('\n🗄️ Phase 2: Restoring storage buckets...')

  if (!fs.existsSync(STORAGE_DIR)) {
    console.log('- Storage backup folder not found, skipping storage restoration.')
    return
  }

  const buckets = fs.readdirSync(STORAGE_DIR)
  for (const bucketName of buckets) {
    const bucketPath = path.join(STORAGE_DIR, bucketName)
    const stat = fs.statSync(bucketPath)
    if (!stat.isDirectory()) continue

    console.log(`- Processing bucket '${bucketName}'...`)

    // Create bucket if it doesn't exist
    const isPublic = bucketName !== 'moroccanorganica'
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
    })

    if (createError) {
      console.log(`  ℹ️ Bucket check/create status: ${createError.message}`)
    } else {
      console.log(`  ✅ Created bucket '${bucketName}' (public: ${isPublic})`)
    }

    const files = getFilesRecursively(bucketPath)
    console.log(`  Found ${files.length} files to upload.`)

    for (const file of files) {
      process.stdout.write(`  -> Uploading '${file}'... `)
      const localFilePath = path.join(bucketPath, file)
      const fileBuffer = fs.readFileSync(localFilePath)
      const contentType = getContentType(file)

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(file, fileBuffer, {
          contentType: contentType,
          upsert: true,
        })

      if (uploadError) {
        console.log(`❌ Failed: ${uploadError.message}`)
      } else {
        console.log('✅ Success')
      }
    }
  }

  console.log('\n✨ Restore process complete! Your new Supabase database is ready.')
}

restoreDatabase().catch((err) => {
  console.error('❌ Fatal error during restore:', err)
  process.exit(1)
})
