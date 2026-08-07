import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load .env
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env')
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

// List of all core tables to back up (in order)
const tables = [
  'User',
  'Customer',
  'Address',
  'Category',
  'Product',
  'ProductVariant',
  'Order',
  'OrderItem',
  'CategoryTranslation',
  'ProductTranslation',
  'ProductImage',
  'BlogCategory',
  'BlogPost',
  'BlogMedia',
  'StaticPage',
  'StaticPageTranslation',
  'GlobalSeoSetting',
  'GlobalSeoTranslation',
  'Post',
  'PostTranslation'
]

async function fetchTableData(table: string): Promise<any[]> {
  let allRows: any[] = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      throw new Error(`Table ${table} fetch error: ${error.message}`)
    }

    if (!data || data.length === 0) {
      break
    }

    allRows = allRows.concat(data)
    if (data.length < pageSize) {
      break
    }
    page++
  }

  return allRows
}

async function listAllFiles(bucketId: string, folderPath = ''): Promise<string[]> {
  const { data, error } = await supabase.storage.from(bucketId).list(folderPath, {
    limit: 100,
    offset: 0
  })

  if (error) {
    throw new Error(`Bucket list error in '${bucketId}' at path '${folderPath}': ${error.message}`)
  }

  let files: string[] = []
  for (const item of data || []) {
    const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name
    // virtual directory or bucket item folder representation
    if (!item.id && !item.metadata) {
      const subFiles = await listAllFiles(bucketId, itemPath)
      files = files.concat(subFiles)
    } else {
      files.push(itemPath)
    }
  }

  return files
}

async function runBackup() {
  console.log('🚀 Starting Supabase Full Backup...')
  console.log(`URL: ${supabaseUrl}`)
  
  // Create directories
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.mkdirSync(STORAGE_DIR, { recursive: true })

  // 1. Backup Tables
  console.log('\n📦 Phase 1: Backing up database tables...')
  for (const table of tables) {
    try {
      process.stdout.write(`- Fetching table '${table}'... `)
      const data = await fetchTableData(table)
      const filePath = path.join(DATA_DIR, `${table}.json`)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      console.log(`✅ Saved ${data.length} rows to ${table}.json`)
    } catch (err: any) {
      console.log(`❌ Error: ${err.message}`)
    }
  }

  // 2. Backup Storage
  console.log('\n🗄️ Phase 2: Backing up storage buckets...')
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) {
      throw error
    }

    console.log(`Found ${buckets?.length || 0} buckets.`)
    for (const bucket of buckets || []) {
      const bucketId = bucket.id
      console.log(`- Scanning bucket '${bucketId}'...`)
      
      try {
        const files = await listAllFiles(bucketId)
        console.log(`  Found ${files.length} files in bucket '${bucketId}'. Downloading...`)

        for (const file of files) {
          process.stdout.write(`  -> Downloading '${file}'... `)
          const { data: blob, error: downloadError } = await supabase.storage.from(bucketId).download(file)
          
          if (downloadError) {
            console.log(`❌ Failed: ${downloadError.message}`)
            continue
          }

          if (blob) {
            const buffer = Buffer.from(await blob.arrayBuffer())
            const localPath = path.join(STORAGE_DIR, bucketId, file)
            fs.mkdirSync(path.dirname(localPath), { recursive: true })
            fs.writeFileSync(localPath, buffer)
            console.log('✅ Success')
          } else {
            console.log('❌ Empty body')
          }
        }
      } catch (bucketErr: any) {
        console.error(`  ❌ Error processing bucket '${bucketId}': ${bucketErr.message}`)
      }
    }
  } catch (err: any) {
    console.error(`❌ Storage backup failed: ${err.message}`)
  }

  console.log('\n✨ Backup completed! All files are in the "supabase_backup" folder.')
}

runBackup().catch((err) => {
  console.error('❌ Fatal error during backup:', err)
  process.exit(1)
})
