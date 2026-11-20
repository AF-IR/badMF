// POST /api/zarinpal/verify — تایید تراکنش پس از بازگشت از درگاه
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/service';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const authority = String(body.authority || '');
  const status = String(body.status || '');
  const sb = getServiceClient();

  if (!authority) return NextResponse.json({ ok: false, error: 'Authority نامعتبر' }, { status: 400 });
  if (status !== 'OK') {
    if (sb) { try { await sb.from('bookings').update({ status: 'failed' }).eq('authority', authority); } catch (e) { /* ignore */ } }
    return NextResponse.json({ ok: false, error: 'پرداخت ناموفق یا انصراف داده شد.' });
  }

  /* رزرو مرتبط با این تراکنش */
  let booking = null;
  if (sb) {
    try {
      const { data } = await sb.from('bookings').select('*').eq('authority', authority).limit(1);
      if (data && data.length) booking = data[0];
    } catch (e) { /* ignore */ }
  }
  const amount = booking ? booking.amount : 0;
  const merchant = process.env.ZARINPAL_MERCHANT_ID || '';
  if (!merchant) return NextResponse.json({ ok: false, error: 'ZARINPAL_MERCHANT_ID تنظیم نشده است.' }, { status: 400 });

  try {
    const r = await fetch('https://payment.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchant_id: merchant, amount, authority })
    });
    const j = await r.json();
    if (j && j.data && (j.data.code === 100 || j.data.code === 101)) {
      const refId = j.data.ref_id || '';
      if (sb && booking) {
        try { await sb.from('bookings').update({ status: 'paid', refId }).eq('id', booking.id); } catch (e) { /* ignore */ }
      }
      return NextResponse.json({ ok: true, refId, code: j.data.code, booking: booking ? { id: booking.id, categoryName: booking.categoryName } : null });
    }
    if (sb && booking) { try { await sb.from('bookings').update({ status: 'failed' }).eq('id', booking.id); } catch (e) { /* ignore */ } }
    return NextResponse.json({ ok: false, error: 'تایید تراکنش انجام نشد (کد ' + ((j && j.data && j.data.code) || '—') + ')' });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 502 });
  }
}
