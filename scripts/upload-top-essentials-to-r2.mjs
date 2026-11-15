import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const bucketName = process.env.R2_BUCKET_NAME || 'bemyshopper-dev';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('Missing Cloudflare R2 credentials in environment.');
  process.exit(1);
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

const TOP_ESSENTIALS_IMAGES = [
  { file: 'prod-surf-excel.png', key: 'products/prod-surf-excel.png' },
  { file: 'prod-vim-dishwash.png', key: 'products/prod-vim-dishwash.png' },
  { file: 'prod-ambica-agarbatti.png', key: 'products/prod-ambica-agarbatti.png' },
  { file: 'prod-rice-5kg.png', key: 'products/prod-rice-5kg.png' },
  { file: 'prod-toilet-tissue.png', key: 'products/prod-toilet-tissue.png' },
  { file: 'prod-nandini-ghee.png', key: 'products/prod-nandini-ghee.png' },
  { file: 'prod-red-label.png', key: 'products/prod-red-label.png' },
  { file: 'prod-maggi.png', key: 'products/prod-maggi.png' },
  { file: 'prod-horlicks.png', key: 'products/prod-horlicks.png' },
  { file: 'prod-dove-soap.png', key: 'products/prod-dove-soap.png' },
  { file: 'prod-colgate.png', key: 'products/prod-colgate.png' },
  { file: 'prod-harpic.png', key: 'products/prod-harpic.png' },
];

async function main() {
  console.log(`Connecting to Cloudflare R2 bucket: ${bucketName}...`);
  const publicImagesDir = path.resolve('public/images');

  for (const item of TOP_ESSENTIALS_IMAGES) {
    const filePath = path.join(publicImagesDir, item.file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    console.log(`Uploading ${item.file} (${fileBuffer.length} bytes) to R2 as "${item.key}"...`);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: item.key,
        Body: fileBuffer,
        ContentType: 'image/png',
      })
    );

    console.log(`✔ Successfully uploaded ${item.key}`);
  }

  console.log('\nAll 12 Top Essentials images successfully stored in Cloudflare R2 bucket!');
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});

