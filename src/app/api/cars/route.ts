import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from '@/lib/r2';

const CARS_FILE = path.join(process.cwd(), 'src/data/cars.json');

export interface RentalCarItem {
  id: string;
  name: string;
  category: '5-seater' | '7-seater';
  categoryLabel?: string;
  tag?: string;
  tagColor?: string;
  images: string[];
  description?: string;
  specs: {
    seats: string;
    transmission: string;
    fuel: string;
    mileage: string;
  };
  features: string[];
  plans?: {
    '6hr'?: { price: string; km: string };
    '12hr'?: { price: string; km: string };
    '24hr'?: { price: string; km: string };
  };
  isAvailable: boolean;
  createdAt: number;
  updatedAt?: number;
}

function readCars(): RentalCarItem[] {
  try {
    if (!fs.existsSync(CARS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(CARS_FILE, 'utf-8');
    return JSON.parse(raw) as RentalCarItem[];
  } catch (err) {
    console.error('Error reading cars file:', err);
    return [];
  }
}

function writeCars(cars: RentalCarItem[]) {
  const dir = path.dirname(CARS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CARS_FILE, JSON.stringify(cars, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    let cars = readCars();
    if (category && (category === '5-seater' || category === '7-seater')) {
      cars = cars.filter((c) => c.category === category);
    }
    // Always sort by creation time descending (newest cars first)
    cars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Failed to list cars:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cars = readCars();

    // If an array is passed, overwrite entire list (batch update / reorder)
    if (Array.isArray(body)) {
      writeCars(body);
      return NextResponse.json({ success: true, count: body.length });
    }

    // Single car create or update
    const carData = body as Partial<RentalCarItem>;
    if (!carData.name || !carData.category) {
      return NextResponse.json({ success: false, error: 'Name and category are required' }, { status: 400 });
    }

    if (carData.id) {
      // Update existing
      const index = cars.findIndex((c) => c.id === carData.id);
      if (index !== -1) {
        cars[index] = {
          ...cars[index],
          ...carData,
          images: Array.isArray(carData.images) && carData.images.length > 0 ? carData.images : cars[index].images,
          updatedAt: Date.now(),
        } as RentalCarItem;
        writeCars(cars);
        return NextResponse.json({ success: true, car: cars[index] });
      }
    }

    // Create new car
    const newCar: RentalCarItem = {
      id: carData.id || `car_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: carData.name.trim(),
      category: carData.category,
      categoryLabel: carData.categoryLabel?.trim() || (carData.category === '5-seater' ? 'Compact SUV & Hatchback' : 'Luxury Family MPV'),
      tag: carData.tag?.trim() || (carData.category === '5-seater' ? 'Beach Special' : 'Family Prime'),
      tagColor: carData.tagColor || 'orange',
      images: Array.isArray(carData.images) && carData.images.length > 0 ? carData.images : ['/images/cars/placeholder.png'],
      description: carData.description?.trim() || '',
      specs: {
        seats: carData.specs?.seats || (carData.category === '5-seater' ? '5 Passengers' : '7 Passengers'),
        transmission: carData.specs?.transmission || 'Manual & Automatic',
        fuel: carData.specs?.fuel || 'Petrol / Diesel',
        mileage: carData.specs?.mileage || '16-18 km/l',
      },
      features: Array.isArray(carData.features) ? carData.features : [
        'Doorstep delivery in Bapatla',
        'Clean sanitized interior',
        'Chilling AC & Bluetooth audio',
      ],
      plans: carData.plans,
      isAvailable: carData.isAvailable !== undefined ? carData.isAvailable : true,
      createdAt: Date.now(),
    };

    cars.unshift(newCar);
    writeCars(cars);
    return NextResponse.json({ success: true, car: newCar });
  } catch (error) {
    console.error('Failed to save car:', error);
    return NextResponse.json({ success: false, error: 'Failed to save car' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing car id' }, { status: 400 });
    }
    const cars = readCars();
    const carToDelete = cars.find((c) => c.id === id);

    // Delete associated photos from Cloudflare R2 bucket
    if (carToDelete && Array.isArray(carToDelete.images)) {
      for (const img of carToDelete.images) {
        if (img && !img.startsWith('data:') && !img.startsWith('/images/')) {
          try {
            let targetKey = img;
            if (targetKey.startsWith('/api/storage/')) {
              targetKey = targetKey.replace('/api/storage/', '');
            } else {
              const match = targetKey.match(/(?:api\/storage\/|bemyshopper-dev\/|r2\.dev\/)(.+)$/);
              if (match) targetKey = match[1];
            }
            targetKey = targetKey.split('?')[0];
            await r2Client.send(
              new DeleteObjectCommand({
                Bucket: R2_BUCKET,
                Key: targetKey,
              })
            );
          } catch (r2Err) {
            console.warn('Failed to delete image from R2 on car delete:', r2Err);
          }
        }
      }
    }

    const filtered = cars.filter((c) => c.id !== id);
    writeCars(filtered);
    return NextResponse.json({ success: true, remaining: filtered.length });
  } catch (error) {
    console.error('Failed to delete car:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete car' }, { status: 500 });
  }
}
