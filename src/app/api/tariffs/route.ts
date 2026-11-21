import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TARIFFS_FILE = path.join(process.cwd(), 'src/data/tariffs.json');

const DEFAULT_TARIFFS = {
  fiveSeater: {
    title: 'Any 5 Seater',
    subtitle: 'Maruti Swift • Toyota Etios • Hyundai Venue & more',
    tag: 'Compact SUV & Hatchback',
    passengers: 'Up to 5 Passengers',
    plans: {
      '6hr': { price: 900, km: '120 KM Included', description: 'Local city rides & short errands' },
      '12hr': { price: 1490, km: '200 KM Included', description: 'Day outings & Suryalanka Beach', popular: true },
      '24hr': { price: 2490, km: '400 KM Included', description: 'Full day trips & outstation travel', bestValue: true },
    },
  },
  sevenSeater: {
    title: 'Any 7 Seater',
    subtitle: 'Toyota Innova Crysta • Kia Carens • Maruti Ertiga & more',
    tag: 'Luxury Family MPV',
    passengers: 'Up to 7-8 Passengers',
    plans: {
      '6hr': { price: 1800, km: '120 KM Included', description: 'Family temple visits & functions' },
      '12hr': { price: 2490, km: '200 KM Included', description: 'Full day family outing & Suryalanka', popular: true },
      '24hr': { price: 3490, km: '400 KM Included', description: 'Vijayawada, Hyderabad & outstation', bestValue: true },
    },
  },
};

export async function GET() {
  try {
    if (!fs.existsSync(TARIFFS_FILE)) {
      return NextResponse.json(DEFAULT_TARIFFS);
    }
    const data = fs.readFileSync(TARIFFS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to read tariffs:', error);
    return NextResponse.json(DEFAULT_TARIFFS);
  }
}

export async function POST(req: NextRequest) {
  try {
    const updated = await req.json();
    if (!updated || !updated.fiveSeater || !updated.sevenSeater) {
      return NextResponse.json({ success: false, error: 'Invalid tariffs data' }, { status: 400 });
    }

    const dir = path.dirname(TARIFFS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(TARIFFS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json({ success: true, tariffs: updated });
  } catch (error) {
    console.error('Failed to save tariffs:', error);
    return NextResponse.json({ success: false, error: 'Failed to write tariffs' }, { status: 500 });
  }
}
