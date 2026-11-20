/* صفحه اصلی — Server Component با داده سوپابیس + fallback */
import Link from 'next/link';
import Image from 'next/image';
import { getSiteData } from '@/lib/data';
import { resolveImage, IMAGE_ALTS, DEFAULT_IMAGES } from '@/lib/images';
import { SITE, CONTACT } from '@/lib/config';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
import { SectionTitle, CtaBand } from '@/components/Sections';
import { WeekStrip, Testimonials, FaqList, FAQS } from '@/components/ClubParts';
import { faNum } from '@/lib/utils';

export const revalidate = 60;

export default async function HomePage() {
  const data = await getSiteData();
  const hero = resolveImage(data.settings, 'HERO');
  const cats = (data.categories || []).filter(c => c.active);
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': SITE.url + '/#faq',
    mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  };
  const restaurantLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': SITE.url + '/#restaurant',
    name: 'رستوران فاضل',
    parentOrganization: { '@id': SITE.url + '/#business' },
    url: SITE.url + '/restaurant',
    servesCuisine: 'ایرانی و گریل',
    telephone: data.settings.CONTACT_PHONE || CONTACT.phone || '',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.province, addressCountry: 'IR' }
  };
  const clubLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': SITE.url + '/#club',
    name: 'کلوپ ورزشی فاضل',
    parentOrganization: { '@id': SITE.url + '/#business' },
    url: SITE.url + '/club',
    sport: 'بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی',
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.province, addressCountry: 'IR' }
  };

  return (
    <main>
      {/* ===== هیرو ===== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="hero-badges">
              <span className="chip">🎱 کلوپ ورزشی طبقه اول — به‌زودی افتتاح می‌شود</span>
              <span className="chip" style={{ borderColor: 'rgba(245,158,11,.4)', color: 'var(--accent)', background: 'rgba(245,158,11,.08)' }}>🍽️ رستوران طبقه همکف — فعال</span>
            </div>
            <h1>مجموعه تفریحی <span className="gtext">فاضل</span><br />در قلب نجف‌آباد</h1>
            <p className="lead">
              رستوران، کلوپ ورزشی و تفریح خانوادگی در قلب نجف‌آباد — ساختمان سه‌طبقه‌ی ما با رستوران در طبقه همکف،
              کلوپ ورزشی بیلیارد و گیم در طبقه اول و فضای تفریحی برای همه سلیقه‌ها آماده‌ی میزبانی شماست.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/booking">📅 رزرو آنلاین سانس</Link>
              <Link className="btn btn-ghost" href="/club">🎱 کلوپ ورزشی</Link>
              <Link className="btn btn-ghost" href="/restaurant">🍽️ رستوران</Link>
            </div>
            <div className="hero-trust">
              <span>🔒 پرداخت امن زرین‌پال</span><span>📅 رزرو قطعی سانس</span><span>👨‍👩‍👧 فضای خانوادگی</span><span>📍 نجف‌آباد</span>
            </div>
          </div>
          <SmartImage src={hero} alt={IMAGE_ALTS.HERO} h={340} priority sizes="(max-width: 960px) 100vw, 40vw" />
        </div>
      </section>

      {/* ===== آمار ===== */}
      <section className="section">
        <div className="wrap">
          <div className="stat-band">
            <div className="card stat"><div className="sv">۳</div><div className="sl">طبقه با کاربری تفریحی</div></div>
            <div className="card stat"><div className="sv">{faNum(cats.length)}+</div><div className="sl">دسته‌بندی بازی و سرگرمی</div></div>
            <div className="card stat"><div className="sv">🍽️</div><div className="sl">رستوران فعال در طبقه همکف</div></div>
            <div className="card stat"><div className="sv">🔒</div><div className="sl">پرداخت امن زرین‌پال — رزرو آنلاین</div></div>
          </div>
        </div>
      </section>

      {/* ===== طبقات ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionTitle title="طبقات مجموعه" lead="یک ساختمان، سه تجربه؛ از شام تا مسابقه‌ی بیلیارد." />
          <div className="grid g3">
            <div className="card floor-card warm">
              <span className="fc-num">۰</span><span className="fc-state badge badge-ok">فعال</span>
              <div style={{ fontSize: '2rem', margin: '14px 0 6px' }}>🍽️</div>
              <h3>طبقه همکف — رستوران</h3>
              <p>رستوران مجموعه با فضای خانوادگی میزبان ناهار و شام شماست؛ از غذاهای گریل تا پرس‌های اصیل ایرانی.</p>
              <Link className="btn btn-warm btn-sm" style={{ marginTop: 14 }} href="/restaurant">مشاهده صفحه رستوران</Link>
            </div>
            <div className="card floor-card">
              <span className="fc-num">۱</span><span className="fc-state badge badge-soon">به‌زودی افتتاح</span>
              <div style={{ fontSize: '2rem', margin: '14px 0 6px' }}>🎱</div>
              <h3>طبقه اول — کلوپ ورزشی</h3>
              <p>زیربنای طبقه اول به کلوپ ورزشی اختصاص دارد: بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی. {data.settings.CLUB_OPENING_NOTE || SITE.clubOpeningNote}</p>
              <Link className="btn btn-primary btn-sm" style={{ marginTop: 14 }} href="/club">مشاهده صفحه کلوپ</Link>
            </div>
            <div className="card floor-card">
              <span className="fc-num">۲</span><span className="fc-state badge badge-off">در حال آماده‌سازی</span>
              <div style={{ fontSize: '2rem', margin: '14px 0 6px' }}>🏗️</div>
              <h3>طبقه دوم — فضا در حال توسعه</h3>
              <p>{data.settings.FLOOR2_NOTE || SITE.floor2Note}</p>
              <Link className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} href="/blog">اخبار در بلاگ</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== دسته‌بندی‌ها ===== */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <SectionTitle title="امکانات کلوپ ورزشی" lead="از بیلیارد حرفه‌ای تا بازی‌های گروهی؛ هر سلیقه‌ای یک سرگرمی دارد." />
          <div className="grid g3">
            {cats.map(c => (
              <div className="card cat-card" key={c.id}>
                <div className="cat-ic">{c.icon}</div>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <Link className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} href={`/booking?cat=${encodeURIComponent(c.id)}`}>رزرو سانس</Link>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: 26 }}>
            <Link className="btn btn-ghost" href="/club">مشاهده سانس‌ها و تعرفه‌ها ←</Link>
          </div>
        </div>
      </section>

      {/* ===== گالری ===== */}
      <section className="section">
        <div className="wrap">
          <SectionTitle title="گالری مجموعه" lead="نمای ساختمان، فضای رستوران و سالن کلوپ ورزشی؛ تصاویر از پنل مدیریت قابل به‌روزرسانی است." />
          <div className="gallery-grid">
            {['GALLERY_1', 'GALLERY_2', 'GALLERY_3', 'GALLERY_4', 'GALLERY_5', 'GALLERY_6'].map(k => (
              <SmartImage key={k} src={resolveImage(data.settings, k)} alt={IMAGE_ALTS[k]} h={200} sizes="(max-width: 680px) 50vw, 33vw" />
            ))}
          </div>
        </div>
      </section>

      {/* ===== چرا فاضل ===== */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <SectionTitle title="چرا مجموعه فاضل؟" lead="یک مقصد کامل برای تفریح؛ بدون نیاز به برنامه‌ریزی چندجایی و رفت‌وآمد اضافه." />
          <div className="grid g4">
            <div className="card feature-card"><div className="feature-ic">📅</div><h3>رزرو آنلاین سانس</h3><p>بدون تماس تلفنی و بدون رفت‌وآمد، سانس دلخواه را در چند دقیقه قطعی کنید.</p></div>
            <div className="card feature-card"><div className="feature-ic">🔒</div><h3>پرداخت امن زرین‌پال</h3><p>پرداخت از درگاه رسمی زرین‌پال با رسید آنلاین و کد رزرو یکتا.</p></div>
            <div className="card feature-card"><div className="feature-ic">👨‍👩‍👧</div><h3>فضای خانوادگی</h3><p>سانس‌های تفکیک‌شده و محیطی مناسب برای جمع‌های خانوادگی و دوستانه.</p></div>
            <div className="card feature-card"><div className="feature-ic">🍽️</div><h3>شام + تفریح</h3><p>رستوران در طبقه همکف و کلوپ در طبقه اول؛ برنامه «شام و بازی» در یک آدرس.</p></div>
          </div>
        </div>
      </section>

      {/* ===== رستوران تیزر ===== */}
      <section className="section">
        <div className="wrap split">
          <div>
            <div className="h2-bar"><h2>رستوران فاضل — طبقه همکف</h2></div>
            <p className="lead">
              طبقه همکف مجموعه به رستوران اختصاص دارد؛ فضایی مناسب برای شام خانوادگی، دورهمی دوستانه یا یک وعده‌ی بی‌نقص در میانه‌ی بازی و تفریح.
              ساعت کاری، تماس و جزئیات بیشتر در صفحه رستوران.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
              <Link className="btn btn-warm" href="/restaurant">صفحه رستوران</Link>
              {(data.settings.CONTACT_MOBILE || CONTACT.mobile) && (
                <a className="btn btn-ghost" href={'tel:' + (data.settings.CONTACT_MOBILE || CONTACT.mobile)}>☎️ تماس: {(data.settings.CONTACT_MOBILE || CONTACT.mobile)}</a>
              )}
            </div>
          </div>
          <SmartImage src={resolveImage(data.settings, 'RESTAURANT')} alt={IMAGE_ALTS.RESTAURANT} h={300} />
        </div>
      </section>

      {/* ===== برنامه هفته ===== */}
      <section className="section">
        <div className="wrap">
          <SectionTitle title="برنامه سانس‌های هفته" lead="تعداد سانس‌های فعال هر روز؛ روز پرطرفدار را از دست ندهید و سانس خود را زودتر رزرو کنید." />
          <WeekStrip data={data} />
          <div className="center" style={{ marginTop: 22 }}>
            <Link className="btn btn-primary" href="/booking">مشاهده سانس‌ها و رزرو ←</Link>
          </div>
        </div>
      </section>

      {/* ===== نظرات ===== */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <SectionTitle title="از زبان مهمان‌های ما" lead="نظرات مشتریان مجموعه؛ این نظرات از بخش «نظرات» پنل مدیریت قابل افزودن و ویرایش است." />
          <Testimonials data={data} />
        </div>
      </section>

      {/* ===== رزرو سه قدم ===== */}
      <section className="section">
        <div className="wrap">
          <SectionTitle title="رزرو در سه قدم" lead="بدون تماس تلفنی، بدون انتظار — سانس شما چند دقیقه‌ای قطعی می‌شود." />
          <div className="grid g3">
            <div className="card feature-card"><div className="step-num" style={{ margin: '0 auto 12px' }}>۱</div><h3>انتخاب دسته و سانس</h3><p>دسته‌بندی بازی، روز هفته و سانس دلخواه را از برنامه‌ی شفاف سانس‌ها انتخاب کنید.</p></div>
            <div className="card feature-card"><div className="step-num" style={{ margin: '0 auto 12px' }}>۲</div><h3>پرداخت آنلاین</h3><p>مبلغ رزرو را از طریق درگاه امن زرین‌پال پرداخت کنید؛ رسید به‌صورت خودکار صادر می‌شود.</p></div>
            <div className="card feature-card"><div className="step-num" style={{ margin: '0 auto 12px' }}>۳</div><h3>مراجعه و بازی</h3><p>فقط کافی است روز سانس، با نام رزروکننده مراجعه کنید؛ میز شما آماده است.</p></div>
          </div>
        </div>
      </section>

      {/* ===== بلاگ تیزر ===== */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <div className="h2-bar"><h2>آخرین مطالب بلاگ</h2></div>
          <div className="grid g3" style={{ marginTop: 24 }}>
            {(data.posts || []).slice(0, 3).map(p => (
              <Link className="card post-card" key={p.id} href={`/blog/${p.slug || p.id}`}>
                <SmartImage src={p.image || ''} alt={p.title} h={180} sizes="(max-width: 680px) 100vw, 33vw" />
                <div className="chip" style={{ alignSelf: 'flex-start' }}>{p.tag}</div>
                <h3 style={{ fontSize: '.98rem' }}>{p.title}</h3>
                <div className="p-date">📅 {p.date}</div>
                <p>{p.excerpt}</p>
                <span style={{ color: 'var(--brand)', fontWeight: 800, fontSize: '.85rem' }}>ادامه مطلب ←</span>
              </Link>
            ))}
          </div>
          <div className="center" style={{ marginTop: 24 }}>
            <Link className="btn btn-ghost" href="/blog">همه‌ی مطالب ←</Link>
          </div>
        </div>
      </section>

      {/* ===== سوالات پرتکرار + CTA ===== */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <SectionTitle title="سوالات پرتکرار" />
          <div style={{ marginTop: 20 }}>
            <FaqList faqs={FAQS} />
          </div>
          <div style={{ marginTop: 34 }}>
            <CtaBand title="آماده‌ی یک عصر پرهیجان هستید؟" text="سانس دلخواه‌تان را همین حالا رزرو کنید؛ پرداخت امن با درگاه زرین‌پال انجام می‌شود." />
          </div>
        </div>
      </section>

      <JsonLd data={faqLd} />
      <JsonLd data={restaurantLd} />
      <JsonLd data={clubLd} />
    </main>
  );
}
