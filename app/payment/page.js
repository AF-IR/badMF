/* نتیجه پرداخت — callback زرین‌پال / حالت آزمایشی */
'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DAY_NAMES, faNum, faTime, money } from '@/lib/utils';

function Result() {
  const sp = useSearchParams();
  const [state, setState] = useState({ loading: true, icon: '⏳', title: 'در حال تایید پرداخت…', sub: 'لطفاً صفحه را نبندید.', meta: '' });

  useEffect(() => {
    const authority = sp.get('Authority');
    const status = sp.get('Status');
    const demoId = sp.get('demo') ? sp.get('id') : null;

    (async () => {
      if (demoId) {
        try {
          const r = await fetch('/api/bookings?id=' + encodeURIComponent(demoId) + '&demo=1');
          const j = await r.json();
          const b = j && j.booking;
          const meta = b ? `کد رزرو: ${b.id} — ${b.categoryName} — ${DAY_NAMES[+b.day]} ${faTime(b.start)} — ${b.name}` : '';
          if (status === 'OK') {
            setState({ loading: false, icon: '✅', title: 'پرداخت آزمایشی با موفقیت انجام شد', sub: 'رزرو شما در سیستم ثبت شد. (حالت آزمایشی — بدون تراکنش واقعی)', meta });
          } else {
            setState({ loading: false, icon: '❌', title: 'پرداخت ناموفق / انصراف', sub: 'رزرو شما نهایی نشد؛ می‌توانید دوباره تلاش کنید.', meta });
          }
          return;
        } catch (e) { /* ادامه به fallback */ }
      }

      if (authority) {
        try {
          const r = await fetch('/api/zarinpal/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authority, status })
          });
          const j = await r.json();
          if (j && j.ok) {
            const b = j.booking;
            const meta = `شماره پیگیری: ${j.refId ? faNum(String(j.refId)) : '—'}${b ? ' — کد رزرو: ' + b.id : ''}`;
            setState({ loading: false, icon: '✅', title: 'پرداخت با موفقیت تایید شد', sub: 'رزرو سانس شما قطعی شد.', meta });
          } else {
            setState({ loading: false, icon: '❌', title: 'تایید پرداخت انجام نشد', sub: (j && j.error) || 'در صورت کسر مبلغ، با پشتیبانی تماس بگیرید.', meta: 'Authority: ' + faNum(String(authority).slice(0, 12)) + '…' });
          }
          return;
        } catch (e) {
          setState({ loading: false, icon: '⚠️', title: 'خطا در تایید پرداخت', sub: 'ارتباط با سرور تایید برقرار نشد. اگر پرداخت انجام شده، وضعیت رزرو به‌زودی بررسی می‌شود.', meta: '' });
          return;
        }
      }

      setState({ loading: false, icon: 'ℹ️', title: 'صفحه نتیجه پرداخت', sub: 'پس از بازگشت از درگاه زرین‌پال، نتیجه پرداخت اینجا نمایش داده می‌شود.', meta: '' });
    })();
  }, [sp]);

  return (
    <div className="card pay-result">
      <div className="pr-ic">{state.icon}</div>
      <h2>{state.title}</h2>
      <p className="lead center" style={{ margin: '10px auto 0' }}>{state.sub}</p>
      {state.meta && <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 12 }}>{state.meta}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
        <Link className="btn btn-primary" href="/">صفحه اصلی</Link>
        <Link className="btn btn-ghost" href="/booking">رزرو سانس جدید</Link>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main>
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Suspense fallback={<div className="card pay-result"><div className="pr-ic">⏳</div><h2>در حال بررسی…</h2></div>}>
            <Result />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
