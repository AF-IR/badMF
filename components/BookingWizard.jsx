'use client';
/* ویزارد رزرو سه‌قدمی — متصل به /api/bookings و درگاه زرین‌پال */
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DAY_NAMES, faNum, money, faTime, hoursBetween } from '@/lib/utils';

export default function BookingWizard({ data, initialCat }) {
  const router = useRouter();
  const cats = (data.categories || []).filter(c => c.active);
  const sessions = data.sessions || [];
  const [catId, setCatId] = useState(initialCat && cats.some(c => c.id === initialCat) ? initialCat : '');
  const [day, setDay] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [count, setCount] = useState(1);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState(null); // {booking}

  const sess = useMemo(() => sessions.find(s => s.id === sessionId) || null, [sessionId, sessions]);
  const days = useMemo(() => [...new Set(sessions.filter(s => s.active && s.categoryId === catId).map(s => +s.day))].sort((a, b) => a - b), [catId, sessions]);
  const list = useMemo(() => sessions
    .filter(s => s.active && s.categoryId === catId && (day === null || +s.day === +day))
    .sort((a, b) => (+a.day - +b.day) || String(a.start).localeCompare(String(b.start))), [catId, day, sessions]);
  const amount = sess ? sess.price * Math.max(1, count) : 0;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const problems = [];
    if (!sess) problems.push('سانس انتخابی معتبر نیست.');
    if (name.trim().length < 3) problems.push('نام و نام خانوادگی را کامل وارد کنید.');
    if (!/^09\d{9}$/.test(phone.trim())) problems.push('شماره موبایل باید به شکل 09xxxxxxxxx باشد.');
    if (sess && (!(count >= 1) || count > sess.capacity)) problems.push('تعداد نفرات باید بین ۱ تا ' + faNum(sess.capacity) + ' باشد.');
    if (problems.length) { setErr(problems.join(' ')); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sess.id,
          name: name.trim(),
          phone: phone.trim(),
          count: Math.max(1, count)
        })
      });
      const j = await r.json();
      if (!r.ok) { setErr((j && j.error) || 'خطا در ثبت رزرو.'); setBusy(false); return; }
      if (j.demo) {
        setDemo({ booking: j.booking });
        setBusy(false);
        return;
      }
      if (j.url) { router.push(j.url); return; }
      setErr(j.error || 'اتصال به درگاه ناموفق بود.');
    } catch (ex) {
      setErr('ارتباط با سرور برقرار نشد؛ دوباره تلاش کنید.');
    }
    setBusy(false);
  };

  const demoConfirm = async (ok) => {
    if (!demo) return;
    setBusy(true);
    try {
      await fetch('/api/bookings/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: demo.booking.id, ok })
      });
    } catch (e) { /* ignore */ }
    setBusy(false);
    router.push(`/payment?demo=1&id=${encodeURIComponent(demo.booking.id)}&Status=${ok ? 'OK' : 'NOK'}`);
  };

  /* ---- گام ۱: انتخاب دسته ---- */
  if (!catId) {
    return (
      <>
        <div className="steps-ind">
          <span className="on">۱. دسته‌بندی</span><span>۲. روز و سانس</span><span>۳. اطلاعات و پرداخت</span>
        </div>
        <div className="grid g3" style={{ marginTop: 20 }}>
          {cats.map(c => (
            <button className="card cat-card" key={c.id} style={{ borderStyle: 'solid', cursor: 'pointer' }} onClick={() => { setCatId(c.id); setDay(null); setSessionId(''); }}>
              <div className="cat-ic" style={{ fontSize: '2rem' }}>{c.icon}</div>
              <h3>{c.name}</h3>
              <p>{c.desc}</p>
            </button>
          ))}
        </div>
      </>
    );
  }

  /* ---- گام ۲: روز و سانس ---- */
  if (!sess) {
    const cat = cats.find(c => c.id === catId);
    return (
      <>
        <div className="steps-ind">
          <span className="on">۱. دسته‌بندی</span><span>۲. روز و سانس</span><span>۳. اطلاعات و پرداخت</span>
        </div>
        <div className="h2-bar"><h2>۲) کدام روز و سانس؟ — {cat ? cat.icon + ' ' + cat.name : ''}</h2></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '18px 0' }}>
          <button className={'chip-day' + (day === null ? ' active' : '')} onClick={() => setDay(null)}>همه</button>
          {days.map(d => <button key={d} className={'chip-day' + (day === d ? ' active' : '')} onClick={() => setDay(d)}>{DAY_NAMES[d]}</button>)}
        </div>
        {list.length ? (
          <div className="session-list">
            {list.map(s => (
              <div className="session-card" key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span>{cat.icon} <b>{cat.name}</b></span>
                  {s.gender === 'مختلط' ? <span className="badge badge-ok">مختلط</span> : <span className="badge badge-soon">{s.gender || 'مختلط'}</span>}
                </div>
                <div style={{ fontWeight: 800 }}>{DAY_NAMES[+s.day]} — {faTime(s.start)} تا {faTime(s.end)}</div>
                <div style={{ display: 'flex', gap: 12, color: 'var(--muted)', fontSize: '.76rem', marginTop: 4 }}>
                  <span>👥 ظرفیت {faNum(s.capacity)} نفر</span>
                  <span>🕐 {faNum(hoursBetween(s.start, s.end))} ساعت</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontWeight: 900, color: 'var(--brand)' }}>{money(s.price)} <span style={{ fontSize: '.7rem', color: 'var(--muted)' }}>تومان / هر نفر</span></span>
                  <button className="btn btn-primary btn-sm" onClick={() => setSessionId(s.id)}>انتخاب</button>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="info-box blue">برای این دسته‌بندی و روز، سانسی ثبت نشده است؛ روز دیگری را انتخاب کنید.</div>}
        <div style={{ marginTop: 22 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setCatId(''); setDay(null); setSessionId(''); }}>← تغییر دسته‌بندی</button>
        </div>
      </>
    );
  }

  /* ---- گام ۳: اطلاعات و پرداخت ---- */
  const cat = cats.find(c => c.id === catId);
  return (
    <>
      <div className="steps-ind">
        <span className="on">۱. دسته‌بندی</span><span className="on">۲. روز و سانس</span><span className="on">۳. اطلاعات و پرداخت</span>
      </div>
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div>
          <div className="h2-bar"><h2>۳) اطلاعات رزرو</h2></div>
          <form className="card" style={{ padding: 24, marginTop: 18 }} onSubmit={submit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label>نام و نام خانوادگی *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: علی محمدی" />
              </div>
              <div className="field">
                <label>شماره موبایل *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xxxxxxxxx" style={{ direction: 'ltr', textAlign: 'start' }} />
              </div>
              <div className="field">
                <label>تعداد نفرات</label>
                <input type="number" min="1" max={sess.capacity} value={count} onChange={e => setCount(e.target.value)} />
                <span style={{ color: 'var(--muted)', fontSize: '.74rem' }}>حداکثر ظرفیت این سانس: {faNum(sess.capacity)} نفر</span>
              </div>
            </div>
            <p className="form-err">{err}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'در حال اتصال…' : '💳 پرداخت با زرین‌پال — قطعی‌سازی رزرو'}</button>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => { setCatId(''); setDay(null); setSessionId(''); }}>شروع مجدد</button>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: 12 }}>🔒 پرداخت از طریق درگاه رسمی زرین‌پال انجام می‌شود. تا پیش از پرداخت، هیچ مبلغی از شما کسر نمی‌شود.</p>
          </form>
        </div>
        <div className="card summary" style={{ marginTop: 44 }}>
          <h3 style={{ marginBottom: 12 }}>خلاصه رزرو</h3>
          <div className="row"><span>دسته‌بندی</span><b>{cat ? cat.icon : ''} {cat ? cat.name : ''}</b></div>
          <div className="row"><span>روز</span><b>{DAY_NAMES[+sess.day]}</b></div>
          <div className="row"><span>بازه زمانی</span><b>{faTime(sess.start)} تا {faTime(sess.end)}</b></div>
          <div className="row"><span>سانس ویژه</span><b>{sess.gender || 'مختلط'}</b></div>
          <div className="row"><span>نرخ هر نفر</span><b>{money(sess.price)} تومان</b></div>
          <div className="row total"><span>مبلغ قابل پرداخت</span><b>{money(amount)} تومان</b></div>
          <p style={{ color: 'var(--muted)', fontSize: '.76rem', marginTop: 12 }}>
            سوال دارید؟ <Link href="/about">با مجموعه تماس بگیرید</Link> یا از دستیار هوشمند بپرسید.
          </p>
        </div>
      </div>

      {/* مودال پرداخت آزمایشی */}
      {demo && (
        <div className="modal-back open">
          <div className="modal">
            <h3>💳 درگاه پرداخت (حالت آزمایشی)</h3>
            <div className="info-box blue" style={{ marginBottom: 16 }}>
              ⚠️ این پرداخت شبیه‌سازی شده است. پس از تنظیم متغیر محیطی <b>ZARINPAL_MERCHANT_ID</b> روی Vercel، درگاه واقعی زرین‌پال باز می‌شود.
            </div>
            <div className="card summary" style={{ padding: 16, marginBottom: 16, boxShadow: 'none' }}>
              <div className="row"><span>رزرو</span><b>{demo.booking.categoryName} — {DAY_NAMES[+demo.booking.day]} {faTime(demo.booking.start)}</b></div>
              <div className="row"><span>رزروکننده</span><b>{demo.booking.name}</b></div>
              <div className="row total"><span>مبلغ</span><b>{money(demo.booking.amount)} تومان</b></div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" disabled={busy} onClick={() => demoConfirm(true)}>✔ پرداخت موفق (شبیه‌سازی)</button>
              <button className="btn btn-danger btn-sm" disabled={busy} onClick={() => demoConfirm(false)}>انصراف / ناموفق</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
