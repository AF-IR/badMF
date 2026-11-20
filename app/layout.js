import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Assistant from '@/components/Assistant';
import JsonLd from '@/components/JsonLd';
import { SITE, CONTACT, SOCIAL, HAS_SUPABASE } from '@/lib/config';
import { getSiteData } from '@/lib/data';
import { resolveImage, IMAGE_ALTS } from '@/lib/images';
import { DEFAULT_IMAGES } from '@/lib/images';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} ${SITE.city} | رستوران، کلوپ ورزشی، بیلیارد و گیم + رزرو آنلاین سانس`,
    template: `%s | ${SITE.name} ${SITE.city}`
  },
  description: 'مجموعه تفریحی فاضل در نجف‌آباد؛ ساختمان سه‌طبقه با رستوران در طبقه همکف و کلوپ ورزشی (بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی) در طبقه اول — به‌زودی افتتاح. رزرو آنلاین سانس‌ها با پرداخت امن زرین‌پال.',
  keywords: ['مجموعه تفریحی فاضل', 'فاضل نجف آباد', 'رستوران نجف آباد', 'کلوپ ورزشی نجف آباد', 'بیلیارد نجف آباد', 'گیم نت نجف آباد', 'رزرو سانس بیلیارد', 'تفریح نجف آباد', 'اصفهان'],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: true, email: true },
  metadataVerification: [],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: '/',
    siteName: SITE.name,
    title: `${SITE.name} ${SITE.city} | رستوران، کلوپ ورزشی، بیلیارد و گیم`,
    description: 'ساختمان سه‌طبقه تفریحی در نجف‌آباد: رستوران در همکف و کلوپ ورزشی بیلیارد و گیم در طبقه اول (به‌زودی افتتاح). رزرو آنلاین سانس با پرداخت زرین‌پال.',
    images: [{ url: DEFAULT_IMAGES.OG, width: 1600, height: 800, alt: SITE.name }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} ${SITE.city}`,
    description: 'رستوران + کلوپ ورزشی (بیلیارد، گیم و…) در نجف‌آباد — رزرو آنلاین سانس‌ها با پرداخت زرین‌پال.',
    images: [DEFAULT_IMAGES.OG]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  other: {
    'geo.region': 'IR-04',
    'geo.placename': 'نجف‌آباد, اصفهان',
    'geo.position': `${SITE.geoLat};${SITE.geoLng}`,
    ICBM: `${SITE.geoLat}, ${SITE.geoLng}`
  }
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b1223' },
    { media: '(prefers-color-scheme: light)', color: '#f7f9fd' }
  ],
  width: 'device-width',
  initialScale: 1
};

/* اسکریپت تم — قبل از رندر اجرا می‌شود تا فلش تم اشتباه نداشته باشیم */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('fazel_theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default async function RootLayout({ children }) {
  const data = await getSiteData();
  const businessLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': SITE.url + '/#website',
        name: SITE.name,
        url: SITE.url + '/',
        inLanguage: 'fa-IR',
        publisher: { '@id': SITE.url + '/#business' }
      },
      {
        '@type': ['EntertainmentBusiness', 'LocalBusiness'],
        '@id': SITE.url + '/#business',
        name: SITE.name,
        description: 'مجموعه تفریحی سه‌طبقه با رستوران در طبقه همکف و کلوپ ورزشی بیلیارد، گیم، فوتبال دستی، دارت و تنیس روی میز در طبقه اول',
        url: SITE.url + '/',
        telephone: data.settings.CONTACT_PHONE || CONTACT.phone || '',
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.city,
          addressRegion: SITE.province,
          addressCountry: 'IR',
          streetAddress: data.settings.ADDRESS || CONTACT.address || ''
        },
        geo: { '@type': 'GeoCoordinates', latitude: SITE.geoLat, longitude: SITE.geoLng },
        openingHours: 'Mo-Su 12:00-23:00',
        priceRange: '$$',
        image: resolveImage(data.settings, 'HERO'),
        sameAs: [SOCIAL.instagram, SOCIAL.telegram, SOCIAL.whatsapp].filter(Boolean)
      }
    ]
  };
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b1223'/%3E%3Ctext x='32' y='44' font-size='32' text-anchor='middle' fill='%232dd4a7' font-family='sans-serif' font-weight='bold'%3E%D9%81%3C/text%3E%3C/svg%3E" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <JsonLd data={businessLd} />
      </head>
      <body data-supabase={HAS_SUPABASE ? 'on' : 'off'}>
        <Header />
        {children}
        <Footer settings={data.settings} />
        <Assistant />
      </body>
    </html>
  );
}
