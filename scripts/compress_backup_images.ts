import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

const STORAGE_DIR = path.join(process.cwd(), 'supabase_backup', 'storage')

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
      results.push(filePath)
    }
  }
  return results
}

async function compressImage(filePath: string): Promise<{ before: number; after: number; compressed: boolean }> {
  const ext = path.extname(filePath).toLowerCase()
  const stats = fs.statSync(filePath)
  const originalSize = stats.size

  // Skip non-image files or very small files (< 5KB)
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext) || originalSize < 5000) {
    return { before: originalSize, after: originalSize, compressed: false }
  }

  const tempPath = `${filePath}.tmp`
  
  try {
    const fileBuffer = fs.readFileSync(filePath)
    let pipeline = sharp(fileBuffer)
    
    // We resize to maximum width of 1920px if the image is excessively large, to save even more space
    const metadata = await pipeline.metadata()
    if (metadata.width && metadata.width > 1920) {
      pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true })
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline
        .jpeg({ quality: 75, progressive: true, mozjpeg: true })
        .toFile(tempPath)
    } else if (ext === '.png') {
      await pipeline
        .png({ compressionLevel: 9, quality: 75 })
        .toFile(tempPath)
    } else if (ext === '.webp') {
      await pipeline
        .webp({ quality: 75, effort: 6 })
        .toFile(tempPath)
    }

    const tempStats = fs.statSync(tempPath)
    const compressedSize = tempStats.size

    // Only replace the original if the compressed file is actually smaller
    if (compressedSize < originalSize) {
      fs.unlinkSync(filePath)
      fs.renameSync(tempPath, filePath)
      return { before: originalSize, after: compressedSize, compressed: true }
    } else {
      // Clean up temp file if not smaller
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
      return { before: originalSize, after: originalSize, compressed: false }
    }
  } catch (err) {
    console.error(`\n❌ Error compressing ${path.basename(filePath)}:`, err)
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }
    return { before: originalSize, after: originalSize, compressed: false }
  }
}

async function runCompression() {
  console.log('🚀 Starting Image Compression...')
  console.log(`Directory: ${STORAGE_DIR}`)

  if (!fs.existsSync(STORAGE_DIR)) {
    console.error('❌ Storage folder not found. Please run the backup script first.')
    process.exit(1)
  }

  const files = getFilesRecursively(STORAGE_DIR)
  console.log(`Found ${files.length} files in storage backup. Starting compression...`)

  let totalBefore = 0
  let totalAfter = 0
  let compressedCount = 0

  for (const file of files) {
    const filename = path.basename(file)
    const result = await compressImage(file)
    totalBefore += result.before
    totalAfter += result.after

    if (result.compressed) {
      compressedCount++
      const savingPercent = ((1 - result.after / result.before) * 100).toFixed(1)
      const savingKB = ((result.before - result.after) / 1024).toFixed(1)
      console.log(`✅ Compressed ${filename}: ${(result.before / 1024).toFixed(1)} KB -> ${(result.after / 1024).toFixed(1)} KB (-${savingPercent}%, saved ${savingKB} KB)`)
    }
  }

  const totalSavingKB = ((totalBefore - totalAfter) / 1024).toFixed(1)
  const totalSavingPercent = ((1 - totalAfter / totalBefore) * 100).toFixed(1)

  console.log('\n✨ Compression Completed!')
  console.log(`- Total Files Compressed: ${compressedCount} / ${files.length}`)
  console.log(`- Total Size Before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`)
  console.log(`- Total Size After: ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`)
  console.log(`- Saved Space: ${totalSavingKB} KB (~${(parseFloat(totalSavingKB) / 1024).toFixed(2)} MB) or -${totalSavingPercent}%`)
}

runCompression().catch((err) => {
  console.error('❌ Fatal error during compression:', err)
  process.exit(1)
})
