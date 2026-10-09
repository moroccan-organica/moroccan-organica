const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

function getExtension(mimeType: string): string {
    switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/webp':
            return 'webp';
        case 'image/gif':
            return 'gif';
        case 'image/svg+xml':
            return 'svg';
        default:
            return 'bin';
    }
}

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

    try {
        const sharpModule = await import('sharp');
        const sharp = sharpModule.default || sharpModule;
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
    } catch (err) {
        console.warn('[compress-image] Sharp module failed to load, returning original image buffer:', err);
        return {
            buffer,
            mimeType,
            extension: getExtension(mimeType),
        };
    }
}
