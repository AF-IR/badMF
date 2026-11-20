/* صفحه ۴۰۴ اختصاصی */
import Link from 'next/link';

export const metadata = { title: 'صفحه پیدا نشد', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap center" style={{ maxWidth: 640 }}>
          <div style={{ fontSize: '4.5rem', fontWeight: 900 }} className="gtext">۴۰۴</div>
          <h1 style={{ fontSize: '1.5rem', margin: '10px 0' }}>این صفحه توپش را گم کرده! 🎱</h1>
          <p className="lead center" style={{ margin: '0 auto 24px' }}>
            صفحه‌ای که دنبالش بودید پیدا نشد؛ اما بد نیست به جای آن، یک سانس رزرو کنید یا سری به منوهای دیگر سایت بزنید.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" href="/">🏠 صفحه اصلی</Link>
            <Link className="btn btn-ghost" href="/booking">📅 رزرو سانس</Link>
            <Link className="btn btn-ghost" href="/club">🎱 کلوپ ورزشی</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
