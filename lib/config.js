// پیکربندی سایت — از متغیرهای محیطی با مقادیر پیش‌فرض امن
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'مجموعه تفریحی فاضل',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'رستوران، کلوپ ورزشی و تفریح خانوادگی در قلب نجف‌آباد',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://YOUR-DOMAIN.vercel.app').replace(/\/+$/, ''),
  city: 'نجف‌آباد',
  province: 'اصفهان',
  geoLat: Number(process.env.NEXT_PUBLIC_GEO_LAT) || 32.6346,
  geoLng: Number(process.env.NEXT_PUBLIC_GEO_LNG) || 51.3661,
  workHoursRestaurant: process.env.NEXT_PUBLIC_WORK_HOURS_RESTAURANT || 'همه‌روزه از ۱۲ تا ۲۳',
  workHoursClub: process.env.NEXT_PUBLIC_WORK_HOURS_CLUB || 'پس از افتتاح، ساعت کاری اعلام می‌شود',
  clubOpeningNote: process.env.NEXT_PUBLIC_CLUB_OPENING_NOTE || 'به‌زودی؛ تاریخ دقیق افتتاح به‌محض نهایی شدن اعلام می‌شود.',
  floor2Note: process.env.NEXT_PUBLIC_FLOOR2_NOTE || 'این فضا در حال آماده‌سازی است؛ کاربری نهایی آن به‌زودی اعلام می‌شود.'
};

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  mobile: process.env.NEXT_PUBLIC_CONTACT_MOBILE || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  address: process.env.NEXT_PUBLIC_ADDRESS || ''
};

export const SOCIAL = {
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
  telegram: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM || '',
  whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || ''
};

export const HAS_SUPABASE = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const HAS_ZARINPAL = !!process.env.ZARINPAL_MERCHANT_ID;
export const HAS_ZAI = !!(process.env.ZAI_API_KEY || process.env.ZAI_BASE_URL);

/* مقادیر محتوایی که ادمین می‌تواند از پنل بازنویسی کند (در جدول settings) */
export const SETTINGS_KEYS = [
  'CONTACT_PHONE', 'CONTACT_MOBILE', 'CONTACT_EMAIL', 'ADDRESS',
  'WORK_HOURS_RESTAURANT', 'WORK_HOURS_CLUB', 'CLUB_OPENING_NOTE', 'FLOOR2_NOTE',
  'MAP_EMBED_URL',
  'SOCIAL_INSTAGRAM', 'SOCIAL_TELEGRAM', 'SOCIAL_WHATSAPP',
  'IMAGES_HERO', 'IMAGES_RESTAURANT', 'IMAGES_RESTAURANT_2', 'IMAGES_RESTAURANT_3',
  'IMAGES_CLUB', 'IMAGES_BILLIARD', 'IMAGES_GAMES', 'IMAGES_FOOD',
  'IMAGES_GALLERY_1', 'IMAGES_GALLERY_2', 'IMAGES_GALLERY_3',
  'IMAGES_GALLERY_4', 'IMAGES_GALLERY_5', 'IMAGES_GALLERY_6', 'IMAGES_OG'
];
