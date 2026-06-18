import sharp from 'sharp';

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

export async function compressImageForUpload(
    buffer: Buffer,
    mimeType: string
): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    if (mimeType === 'image/svg+xml' || mimeType === 'image/gif') {
        return {
            buffer,
            mimeType,
            extension: mimeType === 'image/svg+xml' ? 'svg' : 'gif',
        };
    }

    const compressed = await sharp(buffer)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

    return {
        buffer: compressed,
        mimeType: 'image/webp',
        extension: 'webp',
    };
}
