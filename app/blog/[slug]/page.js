/* صفحه هر مقاله بلاگ — URL اختصاصی + متادیتای داینامیک */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteData, getPost } from '@/lib/data';
import SmartImage from '@/components/SmartImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CtaBand } from '@/components/Sections';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/config';

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  // مقالات پیش‌فرض در زمان build ایندکس می‌شوند؛ مقالات ادمین در زمان اجرا
  const { DEFAULT_DB } = await import('@/lib/data');
  return DEFAULT_DB.posts.map(p => ({ slug: p.slug || p.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'مطلب پیدا نشد' };
  return {
    title: post.title,
    description: post.excerpt || String(post.body || '').slice(0, 150),
    keywords: [post.tag, 'مجموعه تفریحی فاضل', 'بلاگ نجف آباد'],
    alternates: { canonical: `/blog/${post.slug || post.id}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || '',
      url: `/blog/${post.slug || post.id}`,
      images: post.image ? [{ url: post.image }] : undefined
    }
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const data = await getSiteData();
  const other = (data.posts || []).filter(p => (p.slug || p.id) !== (post.slug || post.id)).slice(0, 3);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image ? [post.image] : undefined,
    datePublished: undefined,
    inLanguage: 'fa-IR',
    url: `${SITE.url}/blog/${post.slug || post.id}`,
    author: { '@type': 'Organization', name: SITE.name, '@id': SITE.url + '/#business' },
    publisher: { '@id': SITE.url + '/#business' },
    isPartOf: { '@id': SITE.url + '/blog#blog' }
  };
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'بلاگ', href: '/blog' }, { label: post.title }]} />
          <h1 style={{ fontSize: 'clamp(1.5rem,3.4vw,2.2rem)' }}>{post.title}</h1>
          <div className="chip" style={{ marginTop: 14 }}>{post.tag} — 📅 {post.date}</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <article className="post-full" style={{ marginBottom: 0 }}>
            <SmartImage src={post.image || ''} alt={post.title} h={300} sizes="(max-width: 680px) 100vw, 60vw" priority />
            <div className="p-body" style={{ marginTop: 18 }}>
              {String(post.body || '').split('\n\n').map((par, i) => <p key={i}>{par}</p>)}
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link className="btn btn-ghost btn-sm" href="/blog">← همه‌ی مطالب بلاگ</Link>
              <Link className="btn btn-primary btn-sm" href="/booking">📅 رزرو سانس</Link>
            </div>
          </article>

          {other.length > 0 && (
            <div style={{ marginTop: 34 }}>
              <div className="h2-bar"><h2 style={{ fontSize: '1.2rem' }}>مطالب مرتبط</h2></div>
              <div className="grid g3" style={{ marginTop: 18 }}>
                {other.map(p => (
                  <Link className="card post-card" key={p.id} href={`/blog/${p.slug || p.id}`}>
                    <SmartImage src={p.image || ''} alt={p.title} h={160} sizes="(max-width: 680px) 100vw, 33vw" />
                    <div className="chip" style={{ alignSelf: 'flex-start' }}>{p.tag}</div>
                    <h3 style={{ fontSize: '.95rem' }}>{p.title}</h3>
                    <div className="p-date">📅 {p.date}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 34 }}>
            <CtaBand title="این بازی را امتحان کن!" text="سانس دلخواه‌ات را رزرو کن و همین امروز تمرین را شروع کن." />
          </div>
        </div>
      </section>

      <JsonLd data={ld} />
    </main>
  );
}
