/* کارت‌های سانس + جدول تعرفه‌ها + برنامه هفته + نظرات — Server Components */
import Link from 'next/link';
import { faNum, money, faTime, DAY_NAMES, hoursBetween } from '@/lib/utils';
import { catIcon, catName } from '@/lib/data';

function GenderBadge({ gender }) {
  return gender === 'مختلط'
    ? <span className="badge badge-ok">مختلط</span>
    : <span className="badge badge-soon">{gender || 'مختلط'}</span>;
}

export function SessionCard({ s, data }) {
  return (
    <div className="session-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <span>{catIcon(data, s.categoryId)} <b>{catName(data, s.categoryId)}</b></span>
        <GenderBadge gender={s.gender} />
      </div>
      <div style={{ fontWeight: 800 }}>{DAY_NAMES[+s.day]} — {faTime(s.start)} تا {faTime(s.end)}</div>
      <div style={{ display: 'flex', gap: 12, color: 'var(--muted)', fontSize: '.76rem', marginTop: 4 }}>
        <span>👥 ظرفیت {faNum(s.capacity)} نفر</span>
        <span>🕐 {faNum(hoursBetween(s.start, s.end))} ساعت</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontWeight: 900, color: 'var(--brand)' }}>
          {money(s.price)} <span style={{ fontSize: '.7rem', color: 'var(--muted)' }}>تومان / هر نفر</span>
        </span>
        <Link className="btn btn-primary btn-sm" href={`/booking?cat=${encodeURIComponent(s.categoryId)}`}>رزرو</Link>
      </div>
    </div>
  );
}

export function SessionsGrid({ data, day = null, categoryId = null }) {
  const list = (data.sessions || [])
    .filter(s => s.active && (!categoryId || s.categoryId === categoryId) && (day === null || +s.day === +day))
    .sort((a, b) => (+a.day - +b.day) || String(a.start).localeCompare(String(b.start)));
  if (!list.length) return <div className="info-box blue">سانسی برای این فیلتر ثبت نشده است؛ روز دیگری را انتخاب کنید.</div>;
  return <div className="session-list">{list.map(s => <SessionCard key={s.id} s={s} data={data} />)}</div>;
}

export function DayFilter({ basePath = '/club' }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
      <Link className="chip-day active" href={basePath + '#club-sessions'}>همه روزها</Link>
      {DAY_NAMES.map((d, i) => (
        <Link key={i} className="chip-day" href={`${basePath}?day=${i}#club-sessions`}>{d}</Link>
      ))}
    </div>
  );
}

export function TariffTable({ data }) {
  const rows = data.tariffs || [];
  return (
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>دسته‌بندی</th><th>عنوان تعرفه</th><th>واحد</th><th>قیمت (تومان)</th><th>توضیح</th></tr></thead>
        <tbody>
          {rows.length ? rows.map(t => (
            <tr key={t.id}>
              <td><b>{catIcon(data, t.categoryId)} {catName(data, t.categoryId)}</b></td>
              <td>{t.title}</td>
              <td>{t.unit}</td>
              <td style={{ color: 'var(--brand)', fontWeight: 800 }}>{money(t.price)}</td>
              <td style={{ whiteSpace: 'normal' }}>{t.note || '—'}</td>
            </tr>
          )) : <tr><td colSpan={5}>تعرفه‌ای ثبت نشده است.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function WeekStrip({ data }) {
  const today = (() => { try { const d = new Date(); return (d.getDay() + 1) % 7; } catch (e) { return 0; } })();
  return (
    <div className="week-strip">
      {DAY_NAMES.map((d, i) => {
        const n = (data.sessions || []).filter(s => s.active && +s.day === i).length;
        return (
          <div key={i} className={'week-card' + (n ? '' : ' dim') + (i === today ? ' today' : '')}>
            <div className="wc-d">{d}</div>
            <div className="wc-n">{faNum(n)}</div>
            <div className="wc-s">{n ? 'سانس فعال' : 'بدون سانس'}</div>
          </div>
        );
      })}
    </div>
  );
}

export function Testimonials({ data }) {
  const list = (data.testimonials || []).filter(t => t.active !== false);
  if (!list.length) return <div className="info-box">هنوز نظری ثبت نشده است.</div>;
  return (
    <div className="grid g2">
      {list.map(t => (
        <div className="card quote-card" key={t.id}>
          <div className="qstars">★★★★★</div>
          <p className="qt">{t.text}</p>
          <div className="qhead">
            <div className="qavatar">{(t.name || '؟').trim().charAt(0)}</div>
            <div className="qname">{t.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ faqs }) {
  return (
    <div>
      {faqs.map(([q, a], i) => (
        <details className="faq-item" key={i}>
          <summary>{q}</summary>
          <div className="faq-a">{a}</div>
        </details>
      ))}
    </div>
  );
}

export const FAQS = [
  ['مجموعه تفریحی فاضل کجاست؟', 'مجموعه در شهر نجف‌آباد (استان اصفهان) قرار دارد. آدرس دقیق در صفحه «درباره ما» و فوتر سایت نمایش داده می‌شود.'],
  ['کلوپ ورزشی چه زمانی افتتاح می‌شود؟', 'کلوپ ورزشی در طبقه اول ساختمان، در حال آماده‌سازی است و به‌زودی افتتاح می‌شود؛ تاریخ دقیق به‌محض نهایی شدن در همین سایت و شبکه‌های اجتماعی اعلام می‌شود.'],
  ['چطور سانس بیلیارد یا گیم رزرو کنم؟', 'از صفحه «رزرو سانس» دسته‌بندی، روز و سانس دلخواه را انتخاب کنید، اطلاعات تماس را وارد کنید و مبلغ را از طریق درگاه امن زرین‌پال پرداخت کنید؛ رزرو بلافاصله قطعی می‌شود.'],
  ['آیا سانس‌های ویژه بانوان یا آقایان وجود دارد؟', 'در برنامه سانس‌ها، سانس‌های ویژه با برچسب «بانوان» یا «آقایان» مشخص می‌شوند؛ سانس‌های برچسب‌خورده «مختلط» برای همه باز است.'],
  ['تعرفه‌ها چگونه محاسبه می‌شود؟', 'تعرفه هر دسته‌بندی در صفحه کلوپ ورزشی شفاف نمایش داده می‌شود و مبلغ رزرو بر اساس قیمت سانس انتخابی و تعداد نفرات محاسبه و آنلاین پرداخت می‌شود.'],
  ['آیا امکان لغو یا تغییر رزرو وجود دارد؟', 'برای تغییر یا لغو رزرو کافی است با شماره تماس مجموعه تماس بگیرید؛ شماره پس از تنظیم متغیر محیطی CONTACT_PHONE در سایت نمایش داده می‌شود.'],
  ['پرداخت‌ها چگونه انجام می‌شود؟', 'تمام پرداخت‌های آنلاین از طریق درگاه رسمی زرین‌پال انجام می‌شود؛ پس از پرداخت موفق، رسید و کد رزرو به‌صورت آنلاین صادر می‌شود و رزرو قطعی می‌گردد.']
];
