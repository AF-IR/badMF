// تصاویر پیش‌فرض واقعی سایت — از جست‌وجوی تصویر (OSS پایدار) تهیه شده‌اند.
// ادمین می‌تواند از پنل، هر تصویر را با آپلود در سوپابیس استوریج یا لینک جدید جایگزین کند.
export const DEFAULT_IMAGES = {
  HERO: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/03b8bed9f8f2.webp',
  RESTAURANT: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5a2fce1e425e.jpg',
  RESTAURANT_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/278593ad3d37.jpeg',
  RESTAURANT_3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce5a83b9e9f2.jpg',
  CLUB: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4691fe2bf3d8.jpeg',
  BILLIARD: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/96de6d9024d2.jpg',
  GAMES: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0a6e7fcd8501.jpg',
  FOOD: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0b7b32917569.jpg',
  GALLERY_1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/091a11a67459.jpg',
  GALLERY_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8f80ef04e57f.png',
  GALLERY_3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ae0835b8e68e.jpg',
  GALLERY_4: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/89dca5e09578.jpg',
  GALLERY_5: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/95213c057364.jpg',
  GALLERY_6: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ec9c443b5241.jpg',
  OG: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/03b8bed9f8f2.webp'
};

/* تصاویر اضافی برای مقالات بلاگ و بخش‌های دیگر */
export const EXTRA_IMAGES = {
  BILLIARD_PLAY: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3e9d3301ea2a.jpg',
  GAME_PORTRAIT: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/68d0cf0ce7df.png',
  FOOD_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d1189079ca6e.jpg',
  FOOD_3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5197d57a9b58.jpg',
  BOARD_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cf3fed651c30.webp',
  BOARD_3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f58b1a02e832.webp',
  DARTS_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8dc7e29a43a3.jpg',
  FOOS_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9abda01729db.jpg',
  PING_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d22762b170bb.jpg',
  FAMILY: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eeaeab69c955.jpg',
  FAMILY_2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/931541623770.png'
};

export const IMAGE_ALTS = {
  HERO: 'نمای سالن اصلی مجموعه تفریحی فاضل',
  RESTAURANT: 'سالن رستوران مجموعه تفریحی فاضل',
  RESTAURANT_2: 'میزهای رستوران فاضل',
  RESTAURANT_3: 'محیط پذیرایی رستوران',
  CLUB: 'سالن کلوپ ورزشی مجموعه فاضل',
  BILLIARD: 'میزهای بیلیارد کلوپ فاضل',
  GAMES: 'بخش گیم و کنسول کلوپ',
  FOOD: 'غذاهای رستوران فاضل',
  GALLERY_1: 'دورهمی بازی در مجموعه',
  GALLERY_2: 'سالن بازی مجموعه فاضل',
  GALLERY_3: 'بخش دارت کلوپ ورزشی',
  GALLERY_4: 'میز فوتبال دستی کلوپ',
  GALLERY_5: 'میز تنیس روی میز کلوپ',
  GALLERY_6: 'بازی‌های رومیزی مجموعه',
  OG: 'مجموعه تفریحی فاضل نجف‌آباد'
};

/** مقدار نهایی تصویر: تنظیم ادمین (settings) > پیش‌فرض واقعی */
export function resolveImage(settings, key) {
  const s = settings || {};
  if (s['IMAGES_' + key]) return s['IMAGES_' + key];
  return DEFAULT_IMAGES[key] || '';
}
