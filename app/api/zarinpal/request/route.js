// POST /api/zarinpal/request — درخواست پرداخت زرین‌پال (سمت سرور)
// (از رزرو مستقیماً استفاده می‌شود؛ این مسیر برای سازگاری و تست نگه داشته شده)
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const amount = Math.max(0, Number(body.amount) || 0);
  const merchant = process.env.ZARINPAL_MERCHANT_ID || '';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  if (!merchant) return NextResponse.json({ demo: true, error: 'ZARINPAL_MERCHANT_ID تنظیم نشده — حالت آزمایشی' });
  if (!amount) return NextResponse.json({ error: 'مبلغ نامعتبر' }, { status: 400 });
  try {
    const r = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchant,
        amount,
        callback_url: (siteUrl || '') + '/payment',
        description: String(body.description || 'پرداخت مجموعه تفریحی فاضل')
      })
    });
    const j = await r.json();
    if (j && j.data && j.data.authority) {
      return NextResponse.json({ url: 'https://payment.zarinpal.com/pg/StartPay/' + j.data.authority, authority: j.data.authority });
    }
    return NextResponse.json({ error: 'خطای زرین‌پال', detail: j }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
