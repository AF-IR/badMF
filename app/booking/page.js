/* صفحه رزرو — پوسته سرور + ویزارد کلاینت */
import Breadcrumbs from '@/components/Breadcrumbs';
import BookingWizard from '@/components/BookingWizard';
import { getSiteData } from '@/lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'رزرو آنلاین سانس | مجموعه تفریحی فاضل نجف‌آباد',
  description: 'رزرو آنلاین سانس بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی در مجموعه تفریحی فاضل نجف‌آباد — در سه گام با پرداخت امن زرین‌پال.',
  keywords: ['رزرو سانس بیلیارد', 'رزرو آنلاین گیم نت', 'رزرو کلوپ ورزشی نجف آباد', 'پرداخت زرین پال رزرو'],
  alternates: { canonical: '/booking' },
  openGraph: {
    title: 'رزرو آنلاین سانس — مجموعه تفریحی فاضل',
    description: 'در سه گام: انتخاب دسته‌بندی، انتخاب روز و سانس، پرداخت با درگاه امن زرین‌پال.',
    url: '/booking'
  }
};

export default async function BookingPage({ searchParams }) {
  const sp = await searchParams;
  const data = await getSiteData();
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'رزرو سانس' }]} />
          <h1>رزرو <span className="gtext">آنلاین</span> سانس</h1>
          <p className="lead" style={{ marginTop: 12 }}>
            در سه گام: انتخاب دسته‌بندی، انتخاب روز و سانس، پرداخت با درگاه امن زرین‌پال. رزرو شما بلافاصله پس از پرداخت قطعی می‌شود.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <BookingWizard data={data} initialCat={sp && sp.cat ? String(sp.cat) : ''} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g3">
          <div className="card feature-card"><div className="feature-ic">🔒</div><h3>پرداخت امن</h3><p>پرداخت فقط از درگاه رسمی زرین‌پال؛ تا قبل از پرداخت هیچ مبلغی کسر نمی‌شود.</p></div>
          <div className="card feature-card"><div className="feature-ic">🧾</div><h3>رسید آنی</h3><p>پس از پرداخت موفق، رسید و کد رزرو یکتا به‌صورت آنلاین صادر می‌شود.</p></div>
          <div className="card feature-card"><div className="feature-ic">👨‍👩‍👧</div><h3>سانس تفکیک‌شده</h3><p>سانس‌های ویژه بانوان و آقایان با برچسب مشخص در لیست سانس‌ها نمایش داده می‌شود.</p></div>
        </div>
      </section>
    </main>
  );
}
