/* صفحه کلوپ ورزشی — سانس‌ها و تعرفه‌ها */
import Link from 'next/link';
import { getSiteData } from '@/lib/data';
import { resolveImage, IMAGE_ALTS } from '@/lib/images';
import { SITE } from '@/lib/config';
import SmartImage from '@/components/SmartImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SessionsGrid, TariffTable } from '@/components/ClubParts';
import { CtaBand } from '@/components/Sections';

export const revalidate = 60;

export const metadata = {
  title: 'کلوپ ورزشی فاضل | بیلیارد، گیم، فوتبال دستی، دارت + تعرفه‌ها و سانس‌ها',
  description: 'کلوپ ورزشی مجموعه تفریحی فاضل در طبقه اول — بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی؛ برنامه سانس‌ها و جدول تعرفه‌ها با رزرو آنلاین و پرداخت زرین‌پال.',
  keywords: ['کلوپ ورزشی نجف آباد', 'بیلیارد نجف آباد', 'گیم نت نجف آباد', 'فوتبال دستی', 'دارت', 'تنیس روی میز', 'تعرفه بیلیارد', 'رزرو سانس بیلیارد'],
  alternates: { canonical: '/club' },
  openGraph: {
    title: 'کلوپ ورزشی فاضل — بیلیارد، گیم و بازی‌های رومیزی در نجف‌آباد',
    description: 'برنامه سانس‌ها و جدول تعرفه‌های شفاف کلوپ ورزشی فاضل؛ رزرو آنلاین با پرداخت زرین‌پال.',
    url: '/club'
  }
};

export default async function ClubPage({ searchParams }) {
  const sp = await searchParams;
  const dayParam = sp && sp.day !== undefined && /^\d$/.test(String(sp.day)) ? +sp.day : null;
  const data = await getSiteData();
  const cats = (data.categories || []).filter(c => c.active);
  const DAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'کلوپ ورزشی' }]} />
          <span className="badge badge-soon" style={{ marginBottom: 12 }}>طبقه اول — به‌زودی افتتاح</span>
          <h1>کلوپ <span className="gtext">ورزشی</span> فاضل</h1>
          <p className="lead" style={{ marginTop: 12 }}>
            زیربنای طبقه اول مجموعه به کلوپ ورزشی اختصاص دارد؛ بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی — با رزرو آنلاین سانس و پرداخت زرین‌پال.
          </p>
          <div className="hero-cta" style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" href="/booking">📅 رزرو سانس</Link>
            <Link className="btn btn-ghost" href="#club-tariffs">جدول تعرفه‌ها</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="info-box">⏳ وضعیت افتتاح: {data.settings.CLUB_OPENING_NOTE || SITE.clubOpeningNote}</div>
          <div className="split">
            <SmartImage src={resolveImage(data.settings, 'CLUB')} alt={IMAGE_ALTS.CLUB} h={320} sizes="(max-width: 680px) 100vw, 50vw" />
            <div>
              <div className="h2-bar"><h2>دسته‌بندی‌ها</h2></div>
              <p className="lead" style={{ marginBottom: 18 }}>هر دسته‌بندی، یک سرگرمی؛ سانس‌های هر کدام جداگانه رزرو می‌شود.</p>
              <div className="grid g2">
                {cats.map(c => (
                  <div className="card cat-card" style={{ padding: 18 }} key={c.id}>
                    <div className="cat-ic" style={{ fontSize: '1.8rem', marginBottom: 6 }}>{c.icon}</div>
                    <h3 style={{ fontSize: '1rem' }}>{c.name}</h3>
                    <Link className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} href={`/booking?cat=${encodeURIComponent(c.id)}`}>سانس‌ها</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="club-sessions" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <div className="h2-bar"><h2>برنامه سانس‌ها{dayParam !== null ? ` — ${DAY_NAMES[dayParam]}` : ''}</h2></div>
          <p className="lead" style={{ marginBottom: 22 }}>سانس‌ها در قالب بازه‌های زمانی مشخص رزرو می‌شوند؛ ظرفیت هر سانس محدود است.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            <Link className={'chip-day' + (dayParam === null ? ' active' : '')} href="/club#club-sessions">همه روزها</Link>
            {DAY_NAMES.map((d, i) => (
              <Link key={i} className={'chip-day' + (dayParam === i ? ' active' : '')} href={`/club?day=${i}#club-sessions`}>{d}</Link>
            ))}
          </div>
          <SessionsGrid data={data} day={dayParam} />
          <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: 14 }}>
            ℹ️ سانس‌های بالا از دیتابیس سایت (سوپابیس) یا داده‌های نمونه خوانده می‌شود و از پنل مدیریت به‌روزرسانی می‌شود.
          </p>
        </div>
      </section>

      <section className="section" id="club-tariffs">
        <div className="wrap">
          <div className="h2-bar"><h2>تعرفه‌ها</h2></div>
          <p className="lead" style={{ marginBottom: 22 }}>قیمت‌ها به تومان و شفاف؛ مبلغ رزرو بر اساس قیمت سانس انتخابی محاسبه می‌شود.</p>
          <TariffTable data={data} />
          <div className="info-box" style={{ marginTop: 18 }}>ℹ️ قیمت‌های فعلی داده‌ی نمونه هستند و از طریق پنل مدیریت به مقادیر رسمی مجموعه به‌روزرسانی می‌شوند.</div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3">
          <div className="card feature-card"><div className="cat-ic">⏱️</div><h3>وقت مراجعه</h3><p>لطفاً حدود ۱۰ دقیقه پیش از شروع سانس در محل حاضر شوید تا زمان بازی شما کامل باشد.</p></div>
          <div className="card feature-card"><div className="cat-ic">🧾</div><h3>رزرو قطعی با پرداخت</h3><p>رزرو پس از پرداخت آنلاین از طریق درگاه زرین‌پال قطعی می‌شود و ظرفیت سانس به نام شما ثبت می‌گردد.</p></div>
          <div className="card feature-card"><div className="cat-ic">👨‍👩‍👧</div><h3>فضای خانوادگی</h3><p>سانس‌های ویژه بانوان و آقایان در برنامه سانس‌ها با برچسب مشخص نمایش داده می‌شود.</p></div>
        </div>
        <div className="wrap" style={{ marginTop: 34 }}>
          <CtaBand title="سانس دلخواه‌ات را از دست نده" text="برنامه هفته را ببین و همین حالا سانس خود را قطعی کن." />
        </div>
      </section>
    </main>
  );
}
