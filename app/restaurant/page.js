/* صفحه رستوران — طبقه همکف */
import Link from 'next/link';
import { getSiteData } from '@/lib/data';
import { resolveImage, IMAGE_ALTS } from '@/lib/images';
import { SITE, CONTACT } from '@/lib/config';
import SmartImage from '@/components/SmartImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CtaBand } from '@/components/Sections';
import JsonLd from '@/components/JsonLd';

export const revalidate = 300;

export const metadata = {
  title: 'رستوران فاضل | غذای ایرانی و گریل در طبقه همکف مجموعه تفریحی فاضل',
  description: 'رستوران فاضل در طبقه همکف مجموعه تفریحی فاضل نجف‌آباد؛ فضای خانوادگی با غذاهای ایرانی و گریل تازه — میزبان ناهار و شام شما، همه‌روزه از ۱۲ تا ۲۳.',
  keywords: ['رستوران نجف آباد', 'رستوران فاضل', 'غذای ایرانی نجف آباد', 'گریل نجف آباد', 'رستوران خانوادگی نجف آباد'],
  alternates: { canonical: '/restaurant' },
  openGraph: {
    type: 'website',
    title: 'رستوران فاضل — طبقه همکف مجموعه تفریحی فاضل نجف‌آباد',
    description: 'میزبان ناهار و شام شما در طبقه همکف؛ فضای خانوادگی با غذاهای ایرانی و گریل تازه.',
    url: '/restaurant'
  }
};

export default async function RestaurantPage() {
  const data = await getSiteData();
  const s = data.settings;
  const phone = s.CONTACT_MOBILE || s.CONTACT_PHONE || CONTACT.mobile || CONTACT.phone;
  const restaurantLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': SITE.url + '/restaurant#restaurant',
    name: 'رستوران فاضل',
    url: SITE.url + '/restaurant',
    servesCuisine: ['ایرانی', 'گریل'],
    telephone: s.CONTACT_PHONE || CONTACT.phone || '',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.province, addressCountry: 'IR', streetAddress: s.ADDRESS || CONTACT.address || '' },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geoLat, longitude: SITE.geoLng },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '12:00', closes: '23:00' },
    parentOrganization: { '@id': SITE.url + '/#business' }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'رستوران' }]} />
          <span className="badge badge-ok" style={{ marginBottom: 12 }}>طبقه همکف — فعال</span>
          <h1>رستوران <span className="gtext">فاضل</span></h1>
          <p className="lead" style={{ marginTop: 12 }}>میزبان ناهار و شام شما در طبقه همکف مجموعه؛ فضای خانوادگی با دسترسی آسان برای همه‌ی اعضای جمع.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <SmartImage src={resolveImage(s, 'RESTAURANT')} alt={IMAGE_ALTS.RESTAURANT} h={320} sizes="(max-width: 680px) 100vw, 50vw" priority />
          <div>
            <div className="h2-bar"><h2>سفره‌ای برای همه‌ی جمع</h2></div>
            <p className="lead">رستوران فاضل با تمرکز بر غذاهای اصیل ایرانی و گریل‌های تازه، انتخابی راحت برای دورهمی‌های خانوادگی است. منوی کامل پس از نهایی شدن، از پنل مدیریت در همین صفحه بارگذاری می‌شود.</p>
            <div className="info-box blue" style={{ marginTop: 18 }}>🍽️ منوی کامل رستوران به‌زودی از طریق پنل مدیریت تکمیل و در این بخش منتشر می‌شود.</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
              {phone && <a className="btn btn-ghost" href={'tel:' + phone}>☎️ تماس: {phone}</a>}
              <Link className="btn btn-ghost" href="/club">بعد از شام، تفریح در طبقه اول</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="h2-bar"><h2>نمایی از رستوران</h2></div>
          <div className="gallery-grid" style={{ marginTop: 24 }}>
            <SmartImage src={resolveImage(s, 'RESTAURANT')} alt={IMAGE_ALTS.RESTAURANT} h={200} sizes="(max-width: 680px) 50vw, 33vw" />
            <SmartImage src={resolveImage(s, 'RESTAURANT_2')} alt={IMAGE_ALTS.RESTAURANT_2} h={200} sizes="(max-width: 680px) 50vw, 33vw" />
            <SmartImage src={resolveImage(s, 'RESTAURANT_3')} alt={IMAGE_ALTS.RESTAURANT_3} h={200} sizes="(max-width: 680px) 50vw, 33vw" />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g2">
          <div className="card hours-card">
            <h3>🍽️ ساعات کاری رستوران</h3>
            <div className="hours-row"><span>طبقه همکف</span><b>{s.WORK_HOURS_RESTAURANT || SITE.workHoursRestaurant}</b></div>
            <div className="hours-row"><span>روزهای تعطیل و جمعه</span><b>طبق ساعت کاری اعلام‌شده</b></div>
            <div className="hours-row"><span>رزرو میز</span><b>با تماس تلفنی</b></div>
          </div>
          <div className="card hours-card">
            <h3>📍 آدرس و تماس</h3>
            <div className="hours-row"><span>آدرس</span><b style={{ whiteSpace: 'normal' }}>{s.ADDRESS || CONTACT.address || 'پس از تنظیم از پنل مدیریت نمایش داده می‌شود'}</b></div>
            <div className="hours-row"><span>شهر</span><b>نجف‌آباد — استان اصفهان</b></div>
            <div className="hours-row"><span>تلفن</span><b>{s.CONTACT_PHONE || CONTACT.phone || 'در انتظار تنظیم'}</b></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <CtaBand title="بعد از شام، بازی؟" text="سانس کلوپ ورزشی را همین حالا رزرو کنید تا برنامه عصرتان کامل شود." />
        </div>
      </section>

      <JsonLd data={restaurantLd} />
    </main>
  );
}
