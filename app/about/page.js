/* درباره ما — تماس، ساعت کاری، نقشه */
import Link from 'next/link';
import { getSiteData } from '@/lib/data';
import { SITE, CONTACT, SOCIAL } from '@/lib/config';
import { resolveImage, IMAGE_ALTS } from '@/lib/images';
import SmartImage from '@/components/SmartImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CtaBand } from '@/components/Sections';
import JsonLd from '@/components/JsonLd';
import { safeUrl } from '@/lib/utils';

export const revalidate = 300;

export const metadata = {
  title: 'درباره ما و تماس | مجموعه تفریحی فاضل نجف‌آباد',
  description: 'درباره مجموعه تفریحی فاضل نجف‌آباد: ساختمان سه‌طبقه با رستوران در طبقه همکف و کلوپ ورزشی در طبقه اول — آدرس، شماره تماس، ساعات کاری و نقشه موقعیت مجموعه.',
  keywords: ['آدرس مجموعه فاضل', 'تماس مجموعه تفریحی فاضل', 'نقشه مجموعه فاضل نجف آباد'],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'درباره مجموعه تفریحی فاضل نجف‌آباد',
    description: 'یک ساختمان سه‌طبقه در نجف‌آباد که هر طبقه‌اش یک تجربه است — آدرس، تماس و نقشه.',
    url: '/about'
  }
};

export default async function AboutPage() {
  const data = await getSiteData();
  const s = data.settings;
  const phone = s.CONTACT_PHONE || CONTACT.phone;
  const mobile = s.CONTACT_MOBILE || CONTACT.mobile;
  const email = s.CONTACT_EMAIL || CONTACT.email;
  const address = s.ADDRESS || CONTACT.address;
  const mapUrl = safeUrl(s.MAP_EMBED_URL || '');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': SITE.url + '/about#about',
    name: 'درباره مجموعه تفریحی فاضل',
    url: SITE.url + '/about',
    inLanguage: 'fa-IR',
    mainEntity: { '@id': SITE.url + '/#business' }
  };
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'درباره ما' }]} />
          <h1>درباره <span className="gtext">مجموعه فاضل</span></h1>
          <p className="lead" style={{ marginTop: 12 }}>یک ساختمان سه‌طبقه در نجف‌آباد که هر طبقه‌اش یک تجربه است.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <div className="h2-bar"><h2>داستان ما</h2></div>
            <p className="lead">مجموعه تفریحی فاضل با هدف ایجاد یک مقصد کامل برای تفریح خانوادگی در نجف‌آباد ساخته شده است؛ ساختمانی سه‌طبقه که در آن هر طبقه به یک کاربری اختصاص دارد.</p>
            <p className="lead" style={{ marginTop: 12 }}>
              طبقه همکف رستوران است و از همان ابتدای فعالیت میزبان شماست. طبقه اول زیربنای کلوپ ورزشی است؛ بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی که به‌زودی افتتاح می‌شود و سانس‌هایش از همین سایت قابل رزرو خواهد بود. سایر فضاها نیز در حال آماده‌سازی است و اخبار آن در بلاگ منتشر می‌شود.
            </p>
          </div>
          <SmartImage src={resolveImage(s, 'CLUB')} alt={IMAGE_ALTS.CLUB} h={320} sizes="(max-width: 680px) 100vw, 50vw" />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3">
          <div className="card hours-card">
            <h3>📍 آدرس</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>{address || 'آدرس کامل پس از تنظیم از پنل مدیریت یا متغیر محیطی ADDRESS اینجا نمایش داده می‌شود.'}</p>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem' }}>نجف‌آباد — استان اصفهان</p>
          </div>
          <div className="card hours-card">
            <h3>☎️ تماس</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>تلفن: {phone || 'در انتظار تنظیم'}</p>
            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>موبایل: {mobile || '—'}</p>
            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>ایمیل: {email || '—'}</p>
            <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {mobile && <a className="btn btn-ghost btn-sm" href={'tel:' + mobile}>☎️ تماس با مجموعه</a>}
              {email && <a className="btn btn-ghost btn-sm" href={'mailto:' + email}>✉️ ایمیل</a>}
            </div>
          </div>
          <div className="card hours-card">
            <h3>🕐 ساعت کاری</h3>
            <div className="hours-row"><span>رستوران (همکف)</span><b>{s.WORK_HOURS_RESTAURANT || SITE.workHoursRestaurant}</b></div>
            <div className="hours-row"><span>کلوپ ورزشی (طبقه اول)</span><b>{s.WORK_HOURS_CLUB || SITE.workHoursClub}</b></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="h2-bar"><h2>روی نقشه</h2></div>
          <div className="map-frame" style={{ marginTop: 20 }}>
            {mapUrl ? (
              <iframe src={mapUrl} loading="lazy" title="نقشه موقعیت مجموعه تفریحی فاضل" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="ph" style={{ '--ph-h': 320, borderStyle: 'solid' }}>
                <span className="ph-ic">🗺️</span>
                <span className="ph-cap">نقشه موقعیت مجموعه</span>
                <span className="ph-cap" style={{ fontWeight: 400, opacity: .75 }}>لینک Embed نقشه از پنل مدیریت (MAP_EMBED_URL) تنظیم می‌شود</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <CtaBand title="بیایید یک عصر خوب بسازیم" text="سانس دلخواه‌تان را رزرو کنید و بعد از شام، سراغ طبقه اول بیایید." />
        </div>
      </section>

      <JsonLd data={ld} />
    </main>
  );
}
