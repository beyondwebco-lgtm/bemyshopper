import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'src/data/whatsapp_settings.json');

export interface WhatsAppNumberItem {
  id: string;
  phone: string;
  label: string;
  isActive: boolean;
  createdAt: number;
}

const DEFAULT_NUMBERS: WhatsAppNumberItem[] = [
  {
    id: 'wa_default',
    phone: '919999999999',
    label: 'Primary Store Orders Desk',
    isActive: true,
    createdAt: Date.now(),
  },
];

function readNumbers(): WhatsAppNumberItem[] {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return DEFAULT_NUMBERS;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_NUMBERS;
  } catch (err) {
    console.error('Error reading whatsapp settings file:', err);
    return DEFAULT_NUMBERS;
  }
}

function writeNumbers(numbers: WhatsAppNumberItem[]) {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(numbers, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const list = readNumbers();
    const activeItem = list.find((item) => item.isActive) || list[0] || DEFAULT_NUMBERS[0];
    return NextResponse.json({
      numbers: list,
      activeNumber: activeItem.phone,
      activeItem,
    });
  } catch (error) {
    console.error('Failed to get whatsapp numbers:', error);
    return NextResponse.json(
      { numbers: DEFAULT_NUMBERS, activeNumber: '919999999999', activeItem: DEFAULT_NUMBERS[0] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const list = readNumbers();

    // Action: Set active number
    if (body.action === 'setActive' && body.id) {
      const updated = list.map((item) => ({
        ...item,
        isActive: item.id === body.id,
      }));
      writeNumbers(updated);
      return NextResponse.json({ success: true, numbers: updated });
    }

    // Action: Add new WhatsApp number
    const rawPhone = (body.phone || '').trim().replace(/[^0-9]/g, '');
    if (!rawPhone || rawPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Format phone with country code (defaults to 91 for India if 10 digits)
    const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const label = (body.label || '').trim() || 'Store Order Desk';

    const newItem: WhatsAppNumberItem = {
      id: `wa_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      phone: formattedPhone,
      label,
      isActive: body.isActive ?? list.length === 0,
      createdAt: Date.now(),
    };

    // If new item is active, deactivate others
    let updatedList = list;
    if (newItem.isActive) {
      updatedList = updatedList.map((item) => ({ ...item, isActive: false }));
    }

    updatedList.unshift(newItem);
    writeNumbers(updatedList);

    return NextResponse.json({ success: true, item: newItem, numbers: updatedList });
  } catch (error) {
    console.error('Failed to update whatsapp numbers:', error);
    return NextResponse.json({ success: false, error: 'Failed to save number' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing number id' }, { status: 400 });
    }

    const list = readNumbers();
    if (list.length <= 1) {
      return NextResponse.json(
        { success: false, error: 'At least one WhatsApp order number must remain configured.' },
        { status: 400 }
      );
    }

    let updated = list.filter((item) => item.id !== id);
    // If deleted item was active, make the first remaining item active
    const hasActive = updated.some((item) => item.isActive);
    if (!hasActive && updated.length > 0) {
      updated[0].isActive = true;
    }

    writeNumbers(updated);
    return NextResponse.json({ success: true, remaining: updated.length, numbers: updated });
  } catch (error) {
    console.error('Failed to delete whatsapp number:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete number' }, { status: 500 });
  }
}
