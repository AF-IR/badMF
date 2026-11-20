/* فوتر مشترک — Server Component با داده تنظیمات */
import Link from 'next/link';
import { SITE } from '@/lib/config';
import { faNum, safeUrl } from '@/lib/utils';

const FOOT_NAV = [
  ['/club', 'کلوپ ورزشی و تعرفه‌ها'],
  ['/booking', 'رزرو آنلاین سانس'],
  ['/restaurant', 'رستوران طبقه همکف'],
  ['/blog', 'بلاگ و آموزش‌ها'],
  ['/about', 'درباره ما و تماس']
];

export default function Footer({ settings }) {
  const s = settings || {};
  const phone = s.CONTACT_PHONE || '';
  const mobile = s.CONTACT_MOBILE || '';
  const email = s.CONTACT_EMAIL || '';
  const address = s.ADDRESS || '';
  const hoursR = s.WORK_HOURS_RESTAURANT || SITE.workHoursRestaurant;
  const hoursC = s.WORK_HOURS_CLUB || SITE.workHoursClub;
  const socials = [['SOCIAL_INSTAGRAM', '📷', 'اینستاگرام'], ['SOCIAL_TELEGRAM', '✈️', 'تلگرام'], ['SOCIAL_WHATSAPP', '💬', 'واتساپ']]
    .map(([k, ic, t]) => {
      const u = safeUrl(s[k]);
      return u ? <a key={k} href={u} target="_blank" rel="noopener noreferrer" title={t} aria-label={t}>{ic}</a> : null;
    });
  const year = (() => { try { return new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date()); } catch (e) { return '۱۴۰۵'; } })();

  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">ف</span>
            <span>مجموعه تفریحی فاضل<small>رستوران • کلوپ ورزشی — نجف‌آباد</small></span>
          </Link>
          <p style={{ marginTop: 12 }}>{SITE.tagline}</p>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: '1.15rem' }}>
            {socials.some(Boolean) ? socials : <span style={{ opacity: .7 }}>لینک شبکه‌های اجتماعی از پنل مدیریت تنظیم می‌شود</span>}
          </div>
        </div>
        <div>
          <h4>دسترسی سریع</h4>
          <ul>
            {FOOT_NAV.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4>اطلاعات تماس</h4>
          <ul>
            <li>📍 {address || 'آدرس: از پنل مدیریت یا متغیر محیطی ADDRESS تکمیل می‌شود'}</li>
            {phone && <li>☎️ تلفن: <a href={'tel:' + phone} style={{ direction: 'ltr' }}>{faNum(phone)}</a></li>}
            {mobile && <li>📱 موبایل: <a href={'tel:' + mobile} style={{ direction: 'ltr' }}>{faNum(mobile)}</a></li>}
            {email && <li>✉️ <a href={'mailto:' + email}>{email}</a></li>}
            <li>🍽️ رستوران: {hoursR}</li>
            <li>🎱 کلوپ ورزشی: {hoursC}</li>
          </ul>
        </div>
      </div>
      <div className="wrap foot-note">
        <span>© {year} مجموعه تفریحی فاضل — نجف‌آباد</span>
        <span>رزرو آنلاین با درگاه امن زرین‌پال 🎱</span>
      </div>
    </footer>
  );
}
