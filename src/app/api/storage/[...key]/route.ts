import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET, extractR2Key } from '@/lib/r2';

// High-speed in-memory RAM cache for 0ms ultra-fast subsequent responses
const memoryCache = new Map<string, { buffer: Buffer; contentType: string }>();

// Pre-bundled static asset mappings for instant 0.1ms load without network latency
const LOCAL_STATIC_FALLBACK: Record<string, string> = {
  'categories/image-1794757727918.png': 'public/images/cat-prod-toys.png',
  'products/image-1794759424245.png': 'public/images/prod-teddy-bear.png',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params;
    const key = keyParts.join('/').replace(/^\/+/, '');

    // 1. Check in-memory RAM cache
    const cached = memoryCache.get(key);
    if (cached) {
      return new Response(cached.buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
          'CDN-Cache-Control': 'public, s-maxage=31536000',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000',
          'Content-Length': cached.buffer.length.toString(),
          'X-Cache': 'HIT-RAM',
        },
      });
    }

    // 2. Check local pre-bundled disk asset
    const mappedLocal = LOCAL_STATIC_FALLBACK[key];
    if (mappedLocal) {
      const localPath = path.join(process.cwd(), mappedLocal);
      if (fs.existsSync(localPath)) {
        const fileBuf = fs.readFileSync(localPath);
        const ct = 'image/png';
        memoryCache.set(key, { buffer: fileBuf, contentType: ct });
        return new Response(fileBuf as unknown as BodyInit, {
          status: 200,
          headers: {
            'Content-Type': ct,
            'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
            'CDN-Cache-Control': 'public, s-maxage=31536000',
            'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000',
            'Content-Length': fileBuf.length.toString(),
            'X-Cache': 'HIT-LOCAL-DISK',
          },
        });
      }
    }

    // 3. Fetch from Cloudflare R2
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );

    if (!response.Body) {
      return new NextResponse('Object not found', { status: 404 });
    }

    const byteArray = await response.Body.transformToByteArray();
    const contentType = response.ContentType || 'image/jpeg';
    const buffer = Buffer.from(byteArray);

    // Cache in RAM for 0ms subsequent refreshes
    memoryCache.set(key, { buffer, contentType });

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
        'CDN-Cache-Control': 'public, s-maxage=31536000',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000',
        'Content-Length': buffer.length.toString(),
        'X-Cache': 'MISS-R2',
      },
    });
  } catch (err: unknown) {
    console.error('R2 object fetch error:', err);
    return new NextResponse('Image not found', { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params;
    const rawKey = keyParts.join('/');
    const targetKey = extractR2Key(rawKey);

    if (!targetKey) {
      return NextResponse.json({ success: true, message: 'Invalid or static path skipped' });
    }

    memoryCache.delete(targetKey);

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: targetKey,
      })
    );

    return NextResponse.json({
      success: true,
      deletedKey: targetKey,
      message: `Deleted ${targetKey} from Cloudflare R2`,
    });
  } catch (err: unknown) {
    console.error('R2 storage delete error:', err);
    const msg = err instanceof Error ? err.message : 'Delete from Cloudflare R2 failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
