import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'categories';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are permitted' }, { status: 400 });
    }

    // Max file size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedBase = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const key = `${folder}/${sanitizedBase}-${Date.now()}.${ext}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // If a public domain or r2.dev URL is configured, use it, otherwise use our proxy endpoint
    const url = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `/api/storage/${key}`;

    return NextResponse.json({
      success: true,
      url,
      key,
      size: file.size,
      contentType: file.type,
    });
  } catch (err: unknown) {
    console.error('R2 upload error:', err);
    const msg = err instanceof Error ? err.message : 'Upload to Cloudflare R2 failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, url } = body;

    let targetKey = key;
    if (!targetKey && url) {
      if (url.startsWith('/api/storage/')) {
        targetKey = url.replace('/api/storage/', '');
      } else {
        const match = url.match(/(?:api\/storage\/|bemyshopper-dev\/|r2\.dev\/)(.+)$/);
        if (match) targetKey = match[1];
      }
    }

    if (!targetKey) {
      return NextResponse.json({ error: 'No key or url specified' }, { status: 400 });
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: targetKey,
      })
    );

    return NextResponse.json({
      success: true,
      message: `Deleted ${targetKey} from Cloudflare R2`,
    });
  } catch (err: unknown) {
    console.error('R2 delete error:', err);
    const msg = err instanceof Error ? err.message : 'Delete from Cloudflare R2 failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

