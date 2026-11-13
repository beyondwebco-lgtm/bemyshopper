import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const bucketName = process.env.R2_BUCKET_NAME || 'bemyshopper-dev';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

const CATEGORY_IMAGES = [
  { file: 'cat-prod-groceries.png', key: 'categories/cat-prod-groceries.png' },
  { file: 'cat-prod-fruits-veg.png', key: 'categories/cat-prod-fruits-veg.png' },
  { file: 'cat-prod-puja-items.png', key: 'categories/cat-prod-puja-items.png' },
  { file: 'cat-prod-cleaning.png', key: 'categories/cat-prod-cleaning.png' },
  { file: 'cat-prod-personal-care.png', key: 'categories/cat-prod-personal-care.png' },
  { file: 'cat-prod-snacks.png', key: 'categories/cat-prod-snacks.png' },
  { file: 'cat-prod-home-kitchen.png', key: 'categories/cat-prod-home-kitchen.png' },
  { file: 'cat-prod-paper.png', key: 'categories/cat-prod-paper.png' },
  { file: 'cat-prod-baby-care.png', key: 'categories/cat-prod-baby-care.png' },
  { file: 'cat-prod-more.png', key: 'categories/cat-prod-more.png' },
];

async function main() {
  console.log(`Connecting to Cloudflare R2 bucket: ${bucketName}...`);
  const publicImagesDir = path.resolve('public/images');

  for (const item of CATEGORY_IMAGES) {
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

  console.log('\nAll 10 category images successfully stored in Cloudflare R2 bucket!');
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});

