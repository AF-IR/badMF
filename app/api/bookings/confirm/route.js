// POST /api/bookings/confirm — تایید/رد پرداخت آزمایشی
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/service';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || '');
  const okFlag = body.ok === true;
  if (!id) return NextResponse.json({ error: 'شناسه رزرو نامعتبر' }, { status: 400 });
  const sb = getServiceClient();
  if (sb) {
    try {
      await sb.from('bookings').update({ status: okFlag ? 'paid-demo' : 'failed' }).eq('id', id);
    } catch (e) { /* بدون سوپابیس: ادامه */ }
  }
  return NextResponse.json({ ok: true });
}
