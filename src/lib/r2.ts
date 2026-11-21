import { S3Client } from '@aws-sdk/client-s3';

const accountId =
  process.env.R2_ACCOUNT_ID ||
  process.env.r2_account_id ||
  process.env.CLOUDFLARE_ACCOUNT_ID ||
  '68d937ed76c166f908504111959c5437';
const accessKeyId =
  process.env.R2_ACCESS_KEY_ID ||
  process.env.r2_access_key_id ||
  process.env.CLOUDFLARE_ACCESS_KEY_ID ||
  '7923f7ea970803f2f6afe8c51369b1cd';
const secretAccessKey =
  process.env.R2_SECRET_ACCESS_KEY ||
  process.env.r2_secret_access_key ||
  process.env.CLOUDFLARE_SECRET_ACCESS_KEY ||
  '79e5012a5375f6fdd4d350f361a5c74a63f5323030472946151f223ede106e2c';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

export const R2_BUCKET =
  process.env.R2_BUCKET_NAME ||
  process.env.r2_bucket_name ||
  'bemyshopper-dev';

export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

/**
 * Robustly extracts the clean Cloudflare R2 object key from any URL, path, or key representation.
 * Handles /api/storage/ paths, public R2 domains, local paths, query parameters, and encoding.
 */
export function extractR2Key(input?: string | null): string | null {
  if (!input || typeof input !== 'string') return null;
  let str = input.trim();

  // Skip data URLs, next internals, and local static public assets
  if (
    str.startsWith('data:') ||
    str.startsWith('/_next') ||
    str.startsWith('/images/') ||
    str === '/logo.png' ||
    str === '/favicon.ico' ||
    str === '/apple-icon.png' ||
    str === '/icon.png'
  ) {
    return null;
  }

  // Strip query strings and hash anchors
  str = str.split('?')[0].split('#')[0];

  try {
    str = decodeURIComponent(str);
  } catch {
    // Preserve string if already decoded or malformed
  }

  // Parse pathname if full URL
  if (str.startsWith('http://') || str.startsWith('https://')) {
    try {
      const parsed = new URL(str);
      str = parsed.pathname;
    } catch {
      // Fallback
    }
  }

  // Strip all standard prefixes
  str = str.replace(/^\/?api\/storage\//, '');
  str = str.replace(/^.*?bemyshopper-dev\//, '');
  str = str.replace(/^.*?r2\.dev\//, '');
  str = str.replace(/^\/+/, ''); // Guarantee no leading slash for S3/R2

  return str.length > 0 ? str : null;
}
