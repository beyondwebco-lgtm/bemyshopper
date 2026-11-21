import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    let buffer: Buffer | null = null;
    let contentType = 'image/jpeg';
    let ext = 'jpg';
    let baseName = 'pasted-image';
    let folder = 'categories';
    let fileSize = 0;

    const contentTypeHeader = req.headers.get('content-type') || '';

    if (contentTypeHeader.includes('application/json')) {
      const body = await req.json();
      folder = body.folder || 'products';
      const imageUrl = (body.url || body.imageUrl || '').trim();
      const dataUrl = (body.dataUrl || '').trim();

      if (dataUrl && dataUrl.startsWith('data:image/')) {
        const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          ext = matches[1].replace('+xml', '');
          contentType = `image/${matches[1]}`;
          buffer = Buffer.from(matches[2], 'base64');
          fileSize = buffer.length;
        }
      } else if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
        const fetchRes = await fetch(imageUrl);
        if (!fetchRes.ok) {
          throw new Error('Failed to fetch image from external URL');
        }
        const arrayBuf = await fetchRes.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
        contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
        ext = contentType.split('/')[1]?.split(';')[0]?.replace('+xml', '') || 'jpg';
        baseName = imageUrl.split('/').pop()?.split('?')[0]?.replace(/\.[^/.]+$/, '') || 'image';
        fileSize = buffer.length;
      } else if (imageUrl && imageUrl.startsWith('/')) {
        return NextResponse.json({
          success: true,
          url: imageUrl,
        });
      }
    } else {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      folder = (formData.get('folder') as string) || 'products';
      const directUrl = (formData.get('url') as string | null)?.trim();

      if (directUrl && (directUrl.startsWith('http://') || directUrl.startsWith('https://'))) {
        const fetchRes = await fetch(directUrl);
        if (!fetchRes.ok) throw new Error('Failed to fetch image from URL');
        const arrayBuf = await fetchRes.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
        contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
        ext = contentType.split('/')[1]?.split(';')[0]?.replace('+xml', '') || 'jpg';
        fileSize = buffer.length;
      } else if (file) {
        if (!file.type.startsWith('image/')) {
          return NextResponse.json({ error: 'Only image files are permitted' }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
        }
        buffer = Buffer.from(await file.arrayBuffer());
        contentType = file.type;
        ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        baseName = file.name.replace(/\.[^/.]+$/, '');
        fileSize = file.size;
      }
    }

    if (!buffer) {
      return NextResponse.json({ error: 'No image provided or unsupported image format' }, { status: 400 });
    }

    const sanitizedBase = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/(^-|-$)/g, '') || 'image';
    const key = `${folder}/${sanitizedBase}-${Date.now()}.${ext}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const url = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `/api/storage/${key}`;

    return NextResponse.json({
      success: true,
      url,
      key,
      size: fileSize,
      contentType,
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

