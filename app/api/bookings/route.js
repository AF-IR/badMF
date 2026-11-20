// POST /api/bookings — ایجاد رزرو + اتصال به درگاه زرین‌پال (یا حالت آزمایشی)
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/service';

const ok = (data, status = 200) => NextResponse.json(data, { status });

function loadSessionInfo(sb, sessionId) {
  return sb.from('sessions').select('*').eq('id', sessionId).limit(1);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const sessionId = String(body.sessionId || '');
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const count = Math.max(1, Number(body.count) || 1);

  const problems = [];
  if (name.length < 3) problems.push('نام و نام خانوادگی را کامل وارد کنید.');
  if (!/^09\d{9}$/.test(phone)) problems.push('شماره موبایل معتبر نیست.');
  if (!sessionId) problems.push('سانس انتخاب نشده است.');
  if (problems.length) return ok({ error: problems.join(' ') }, 400);

  const sb = getServiceClient();
  const id = 'B' + Date.now();

  /* داده سانس: از سوپابیس یا — اگر تنظیم نیست — از داده پیش‌فرض */
  let sess = null;
  let catName = '';
  if (sb) {
    const { data, error } = await loadSessionInfo(sb, sessionId);
    if (!error && data && data.length) sess = data[0];
  }
  const { DEFAULT_DB, catName: cn } = await import('@/lib/data');
  if (!sess) sess = DEFAULT_DB.sessions.find(s => s.id === sessionId);
  if (!sess) return ok({ error: 'سانس انتخابی یافت نشد.' }, 400);
  if (count > sess.capacity) return ok({ error: 'تعداد نفرات بیش از ظرفیت سانس است.' }, 400);
  catName = cn(DEFAULT_DB, sess.categoryId);
  if (sb) {
    const { data: cat } = await sb.from('categories').select('name').eq('id', sess.categoryId).limit(1);
    if (cat && cat.length) catName = cat[0].name;
  }

  const amount = sess.price * count;
  const booking = {
    id, sessionId, categoryId: sess.categoryId, categoryName: catName,
    day: sess.day, start: sess.start, end: sess.end, gender: sess.gender || 'مختلط',
    name, phone, count, amount, status: 'pending',
    authority: '', refId: '', createdAt: new Date().toISOString()
  };

  /* ثبت رزرو در سوپابیس (اگر تنظیم شده باشد) */
  if (sb) {
    const { error } = await sb.from('bookings').insert([booking]);
    if (error) return ok({ error: 'ثبت رزرو در دیتابیس ناموفق بود: ' + error.message }, 500);
  }

  /* اتصال به درگاه زرین‌پال */
  const merchant = process.env.ZARINPAL_MERCHANT_ID || '';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  if (merchant && siteUrl) {
    try {
      const r = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchant,
          amount,
          callback_url: siteUrl + '/payment',
          description: 'رزرو سانس ' + catName + ' — مجموعه تفریحی فاضل',
          metadata: { mobile: phone, booking_id: id }
        })
      });
      const j = await r.json();
      const auth = j && j.data && j.data.authority;
      if (j && j.data && auth) {
        if (sb) await sb.from('bookings').update({ authority: auth }).eq('id', id);
        return ok({ url: 'https://payment.zarinpal.com/pg/StartPay/' + auth, authority: auth });
      }
      return ok({ error: 'ایجاد درخواست پرداخت ناموفق بود: ' + ((j.errors && Object.values(j.errors)[0]) || 'خطای نامشخص'), booking });
    } catch (e) {
      return ok({ error: 'اتصال به درگاه زرین‌پال ناموفق بود: ' + e.message, booking });
    }
  }

  /* حالت آزمایشی — بدون مرچنت */
  return ok({ demo: true, booking });
}

/* GET /api/bookings?id=..&demo=1 — خلاصه امن رزرو برای صفحه نتیجه (فقط حالت آزمایشی) */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = String(searchParams.get('id') || '');
  const demo = searchParams.get('demo') === '1';
  if (!id || !demo) return ok({ error: 'پارامتر نامعتبر' }, 400);
  const sb = getServiceClient();
  if (sb) {
    try {
      const { data } = await sb.from('bookings').select('id,categoryName,day,start,name,amount,status').eq('id', id).limit(1);
      if (data && data.length && ['paid-demo', 'paid', 'failed'].includes(data[0].status)) {
        return ok({ booking: data[0] });
      }
    } catch (e) { /* ignore */ }
  }
  return ok({ booking: null });
}
