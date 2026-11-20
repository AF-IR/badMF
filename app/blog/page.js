/* بلاگ — لیست مقالات */
import Link from 'next/link';
import { getSiteData } from '@/lib/data';
import SmartImage from '@/components/SmartImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CtaBand } from '@/components/Sections';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/config';

export const revalidate = 120;

export const metadata = {
  title: 'بلاگ مجموعه تفریحی فاضل | آموزش بیلیارد، گیم و اخبار مجموعه',
  description: 'مطالب آموزشی و اخبار مجموعه تفریحی فاضل نجف‌آباد: راهنمای شروع بیلیارد، فوتبال دستی، آموزش رزرو سانس آنلاین و برنامه شام + بازی برای جمع‌های خانوادگی.',
  keywords: ['آموزش بیلیارد', 'فوتبال دستی', 'رزرو سانس', 'بلاگ تفریحی نجف آباد', 'گیم نت', 'بازی رومیزی'],
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'بلاگ مجموعه تفریحی فاضل — آموزش‌ها و اخبار',
    description: 'راهنمای بیلیارد، فوتبال دستی و رزرو آنلاین سانس در مجموعه تفریحی فاضل نجف‌آباد.',
    url: '/blog'
  }
};

export default async function BlogPage() {
  const data = await getSiteData();
  const posts = (data.posts || []).map(p => ({ ...p, slug: p.slug || p.id }));
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': SITE.url + '/blog#blog',
    name: 'بلاگ مجموعه تفریحی فاضل',
    url: SITE.url + '/blog',
    inLanguage: 'fa-IR',
    publisher: { '@id': SITE.url + '/#business' },
    blogPost: posts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`
    }))
  };
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'بلاگ' }]} />
          <h1>بلاگ <span className="gtext">فاضل</span></h1>
          <p className="lead" style={{ marginTop: 12 }}>آموزش‌ها، معرفی بازی‌ها و اخبار مجموعه؛ مطالب از پنل مدیریت قابل افزودن است.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g3">
            {posts.map(p => (
              <Link className="card post-card" key={p.id} href={`/blog/${p.slug}`}>
                <SmartImage src={p.image || ''} alt={p.title} h={180} sizes="(max-width: 680px) 100vw, 33vw" />
                <div className="chip" style={{ alignSelf: 'flex-start' }}>{p.tag}</div>
                <h3 style={{ fontSize: '.98rem' }}>{p.title}</h3>
                <div className="p-date">📅 {p.date}</div>
                <p>{p.excerpt}</p>
                <span style={{ color: 'var(--brand)', fontWeight: 800, fontSize: '.85rem' }}>ادامه مطلب ↓</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <CtaBand title="خواندی، حالا بازی کن!" text="سانس دلخواه‌ات را رزرو کن و تمرین‌های این آموزش را روی میز امتحان کن." />
        </div>
      </section>

      <JsonLd data={blogLd} />
    </main>
  );
}
