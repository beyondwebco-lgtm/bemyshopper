import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from '@/lib/r2';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params;
    const key = keyParts.join('/');

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

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error('R2 object fetch error:', err);
    return new NextResponse('Image not found', { status: 404 });
  }
}
