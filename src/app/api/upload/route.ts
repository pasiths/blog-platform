/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(req: NextRequest) {
  try {

    const contentType = req.headers.get('content-type') || '';
    const contentLength = req.headers.get('content-length') || '';

    const body = req.body;
    if (!body) throw new Error('No body stream found.');

    const reader = body.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    const stream = Readable.from(buffer);
    (stream as any).headers = {
      'content-type': contentType,
      'content-length': contentLength,
    };

    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

    const { files }: any = await new Promise((resolve, reject) => {
      form.parse(stream as any, (err, fields, files) => {
        if (err) {
          console.error('[DEBUG] Form parsing error:', err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const file = files?.file?.[0] ?? files?.file;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: 'blog-platform',
    });

    await promisify(fs.unlink)(file.filepath);
    return NextResponse.json({ url: upload.secure_url });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
