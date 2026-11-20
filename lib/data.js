// لایه داده سایت: داده پیش‌فرض + خواندن از سوپابیس با fallback کامل
// هر تابع خواندنی: اگر سوپابیس تنظیم نباشد یا خطا بدهد، داده پیش‌فرض برمی‌گردد.
import { getServiceClient } from './supabase/service';
import { DEFAULT_IMAGES } from './images';

export const DEFAULT_DB = {
  categories: [
    { id: 'billiard', name: 'بیلیارد', icon: '🎱', desc: 'میزهای استاندارد اسنوکر و پول در فضایی حرفه‌ای برای بازی‌کنان مبتدی و حرفه‌ای.', active: true },
    { id: 'console', name: 'گیم و کنسول', icon: '🎮', desc: 'گیم‌نت با سیستم‌های به‌روز برای بازی‌های گروهی، آنلاین و رقابتی.', active: true },
    { id: 'foosball', name: 'فوتبال دستی', icon: '⚽', desc: 'میزهای فوتبال دستی برای مسابقه‌های دوستانه، سریع و پرهیجان.', active: true },
    { id: 'darts', name: 'دارتی (دارت)', icon: '🎯', desc: 'تخته‌های دارت استاندارد برای تمرین دقت و رقابت گروهی.', active: true },
    { id: 'pingpong', name: 'تنیس روی میز', icon: '🏓', desc: 'میزهای پینگ‌پنگ با راکت و توپ استاندارد.', active: true },
    { id: 'board', name: 'بازی‌های رومیزی', icon: '🎲', desc: 'شطرنج، مونوپولی، منچ و انواع بازی‌های فکری خانوادگی.', active: true }
  ],
  tariffs: [
    { id: 't1', categoryId: 'billiard', title: 'ساعت عادی (شنبه تا چهارشنبه)', unit: 'هر ساعت', price: 80000, note: 'نرخ نمونه — از پنل مدیریت ویرایش کنید' },
    { id: 't2', categoryId: 'billiard', title: 'ساعت پیک (پنجشنبه و جمعه)', unit: 'هر ساعت', price: 100000, note: '' },
    { id: 't3', categoryId: 'console', title: 'گیم‌نت عادی', unit: 'هر ساعت', price: 60000, note: '' },
    { id: 't4', categoryId: 'foosball', title: 'فوتبال دستی', unit: 'هر نفر / هر ساعت', price: 50000, note: '' },
    { id: 't5', categoryId: 'darts', title: 'دارتی', unit: 'هر نفر / هر ساعت', price: 40000, note: '' },
    { id: 't6', categoryId: 'pingpong', title: 'تنیس روی میز', unit: 'هر ساعت', price: 50000, note: '' },
    { id: 't7', categoryId: 'board', title: 'بازی‌های رومیزی', unit: 'هر نفر / هر ساعت', price: 35000, note: '' }
  ],
  sessions: [
    { id: 's1', categoryId: 'billiard', day: 0, start: '16:00', end: '18:00', capacity: 6, price: 80000, gender: 'مختلط', active: true },
    { id: 's2', categoryId: 'billiard', day: 2, start: '18:00', end: '20:00', capacity: 6, price: 80000, gender: 'مختلط', active: true },
    { id: 's3', categoryId: 'billiard', day: 3, start: '10:00', end: '12:00', capacity: 4, price: 80000, gender: 'بانوان', active: true },
    { id: 's4', categoryId: 'billiard', day: 5, start: '16:00', end: '18:00', capacity: 6, price: 100000, gender: 'مختلط', active: true },
    { id: 's5', categoryId: 'billiard', day: 6, start: '12:00', end: '14:00', capacity: 6, price: 100000, gender: 'مختلط', active: true },
    { id: 's6', categoryId: 'console', day: 0, start: '17:00', end: '19:00', capacity: 8, price: 60000, gender: 'مختلط', active: true },
    { id: 's7', categoryId: 'console', day: 6, start: '15:00', end: '17:00', capacity: 8, price: 60000, gender: 'مختلط', active: true },
    { id: 's8', categoryId: 'foosball', day: 5, start: '18:00', end: '19:00', capacity: 4, price: 50000, gender: 'مختلط', active: true },
    { id: 's9', categoryId: 'foosball', day: 6, start: '17:00', end: '18:00', capacity: 4, price: 50000, gender: 'مختلط', active: true },
    { id: 's10', categoryId: 'darts', day: 6, start: '19:00', end: '20:00', capacity: 4, price: 40000, gender: 'مختلط', active: true },
    { id: 's11', categoryId: 'pingpong', day: 2, start: '17:00', end: '19:00', capacity: 4, price: 50000, gender: 'مختلط', active: true },
    { id: 's12', categoryId: 'board', day: 5, start: '20:00', end: '22:00', capacity: 10, price: 35000, gender: 'مختلط', active: true }
  ],
  posts: [
    { id: 'p1', slug: 'billiard-beginners-guide-p1', title: 'راهنمای شروع بیلیارد برای مبتدیان', tag: 'آموزش', date: '۱۴۰۵/۰۸/۱۲', image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3e9d3301ea2a.jpg', excerpt: 'اگر تازه می‌خواهید بیلیارد را شروع کنید، این نکات ساده به شما کمک می‌کند از همان جلسه‌های اول بازی بهتری داشته باشید.',
      body: 'بیلیارد بازی‌ای است که ترکیبی از دقت، آرامش و محاسبه است و برخلاف تصور، شروع آن چندان سخت نیست.\n\nنخست به حالت ایستگاهی خود توجه کنید؛ پاها به عرض شانه، بدنه پایین و ثابت و دست پشتیبان (بریج) محکم روی میز. دوم، چوب را نه با فشار بلکه با حرکت روان و مستقیم به سمت نقطه هدف بزنید. انتخاب چوب استاندارد با وزن مناسب هم تفاوت زیادی در کیفیت ضربه ایجاد می‌کند.\n\nدر تمرین‌های اولیه بهتر است به‌جای ضربه‌های سخت، روی قرارگیری میوه بعدی تمرکز کنید؛ بازی‌کنان حرفه‌ای از هر ضربه برای ضربه بعدی نقشه می‌کشند. اگر سانس‌های منظم تمرین داشته باشید، معمولاً پس از چند هفته پیشرفت محسوسی می‌بینید. پس از افتتاح کلوپ ورزشی فاضل، می‌توانید سانس‌های تمرینی خود را به‌راحتی از همین سایت رزرو کنید.' },
    { id: 'p2', slug: 'foosball-real-competition-p2', title: 'فوتبال دستی؛ هیجان یک رقابت واقعی در چند دقیقه', tag: 'سرگرمی', date: '۱۴۰۵/۰۸/۲۰', image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/89dca5e09578.jpg', excerpt: 'فوتبال دستی یکی از سریع‌ترین و گروهی‌ترین بازی‌های رومیزی است؛ بدون آماده‌سازی طولانی، فقط چند دقیقه تا شروع مسابقه فاصله دارید.',
      body: 'کمتر بازی‌ای را می‌توانید پیدا کنید که مثل فوتبال دستی، در کمتر از یک دقیقه همه را پشت میز بیاورد؛ نه نیاز به تجهیزات جانبی دارد و نه وقت‌گیری است.\n\nجذابیت فوتبال دستی در تعادل بین شانس و مهارت است: دفاع بسته، پاس‌های سریع از خط میانی و شوت‌های غافلگیرکننده از مهاجم‌ها، سه مهارتی است که با تمرین به‌سرعت رشد می‌کند. برای جمع‌های دوستانه و خانوادگی هم گزینه‌ای کم‌هزینه و پرانرژی است و مسابقه‌های دوستانه بین تیم‌ها معمولاً ساعت‌ها ادامه پیدا می‌کند.\n\nدر برنامه سانس‌های کلوپ ورزشی فاضل، بخشی از ظرفیت به فوتبال دستی اختصاص دارد تا گروه‌ها بتوانند با رزرو آنلاین، زمان بازی خود را قطعی کنند.' },
    { id: 'p3', slug: 'online-booking-step-by-step-p3', title: 'آموزش گام‌به‌گام رزرو سانس در سایت', tag: 'راهنما', date: '۱۴۰۵/۰۸/۲۴', image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0b7b32917569.jpg', excerpt: 'رزرو سانس در مجموعه فاضل فقط چهار قدم دارد: انتخاب دسته‌بندی، انتخاب روز، انتخاب سانس و پرداخت آنلاین با درگاه امن زرین‌پال.',
      body: 'برای اینکه سانس دلخواه شما در روزهای شلوغ مثل پنجشنبه و جمعه از دست نرود، بهتر است از چند روز قبل رزرو کنید.\n\nمسیر رزرو ساده است: وارد صفحه «رزرو سانس» شوید و ابتدا دسته‌بندی موردعلاقه (بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز یا بازی‌های رومیزی) را انتخاب کنید. سپس روز هفته را مشخص کنید تا لیست سانس‌های فعال همان روز نمایش داده شود؛ روی هر سانس ظرفیت و قیمت به‌صورت شفاف نوشته شده است.\n\nبعد از انتخاب سانس، نام و شماره موبایل خود را وارد کنید و مبلغ را از طریق درگاه زرین‌پال پرداخت کنید. رسید پرداخت به‌صورت آنلاین صادر می‌شود و کافی است روز مراجعه، نام رزروکننده را اعلام کنید. اگر سانس ویژه بانوان یا آقایان فعال باشد، در لیست سانس‌ها با برچسب مخصوص نمایش داده می‌شود.' },
    { id: 'p4', slug: 'family-evening-three-floors-p4', title: 'یک عصر خانوادگی در مجموعه‌ای سه‌طبقه', tag: 'مجموعه', date: '۱۴۰۵/۰۸/۲۸', image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eeaeab69c955.jpg', excerpt: 'شام در طبقه همکف، چند دست بازی در طبقه اول و خاطره‌ای که تا هفته‌ها درباره‌اش حرف می‌زنید؛ طرحی ساده برای یک جمع دوستانه یا خانوادگی.',
      body: 'برنامه‌ریزی یک جمع خوب معمولاً به جایی ختم می‌شود که هم غذا داشته باشد، هم سرگرمی و هم فضای کافی برای نشستن و گفت‌وگو.\n\nمجموعه تفریحی فاضل دقیقاً برای همین طراحی شده است: طبقه همکف رستوران است و میزبان شام یا ناهار شما؛ طبقه اول زیربنای کلوپ ورزشی است که با بیلیارد، گیم، فوتبال دستی و بازی‌های رومیزی به‌زودی افتتاح می‌شود. یعنی می‌توانید برنامه «شام + بازی» را در یک آدرس بچینید.\n\nپیشنهاد ما برای جمع‌های دوستانه این است که سانس بازی را از قبل رزرو کنید تا هم زمان‌بندی جمع قطعی شود و هم مطمئن باشید میز آزاد در انتظارتان است. خبر افتتاح کلوپ و جزئیات سانس‌های ابتدایی را در همین بلاگ و صفحه کلوپ ورزشی دنبال کنید.' }
  ],
  testimonials: [
    { id: 'r1', name: 'مریم ح.', text: 'فضای مجموعه خیلی خانوادگی و تمیز است؛ رستوران طبقه همکف کیفیت غذای خوبی دارد و بچه‌ها برای طبقه بازی لحظه‌شمار می‌کنند.', active: true },
    { id: 'r2', name: 'علی ر.', text: 'رزرو آنلاین سانس بیلیارد خیلی راحت بود؛ پرداخت زرین‌پال بدون دردسر انجام شد و روز مراجعه میز آماده بود.', active: true },
    { id: 'r3', name: 'س. کاظمی', text: 'تنوع بازی‌ها عالیه؛ از فوتبال دستی تا دارت و تنیس روی میز. برای دورهمی‌های جمعه یک گزینه کامل در نجف‌آباد است.', active: true },
    { id: 'r4', name: 'زهرا م.', text: 'سانس‌های تفکیک‌شده خیلی خوب فکر شده؛ با خیال راحت با خانواده می‌رویم. منتظر افتتاح رسمی طبقه اول هستیم.', active: true }
  ],
  settings: {}
};

const TABLES = ['categories', 'tariffs', 'sessions', 'posts', 'testimonials'];

/** خواندن امن یک جدول از سوپابیس با کلید سرویس؛ خطا → null */
async function tryFetch(table) {
  const sb = getServiceClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from(table).select('*');
    if (error || !Array.isArray(data) || data.length === 0) return null;
    return data;
  } catch (e) { return null; }
}

/** تنظیمات ادمین → آبجکت key/value */
export async function getSettings() {
  const sb = getServiceClient();
  if (!sb) return { ...DEFAULT_DB.settings };
  try {
    const { data, error } = await sb.from('settings').select('key,value');
    if (error || !Array.isArray(data) || data.length === 0) return { ...DEFAULT_DB.settings };
    const o = {};
    data.forEach(r => { if (r && r.key) o[r.key] = r.value; });
    return o;
  } catch (e) { return { ...DEFAULT_DB.settings }; }
}

/** کل داده عمومی سایت در یک فراخوانی (برای Server Components) */
export async function getSiteData() {
  const [categories, tariffs, sessions, posts, testimonials, settings] = await Promise.all([
    tryFetch('categories'), tryFetch('tariffs'), tryFetch('sessions'),
    tryFetch('posts'), tryFetch('testimonials'), getSettings()
  ]);
  return {
    categories: categories || DEFAULT_DB.categories,
    tariffs: tariffs || DEFAULT_DB.tariffs,
    sessions: sessions || DEFAULT_DB.sessions,
    posts: (posts || DEFAULT_DB.posts).map(p => ({ ...p, slug: p.slug || p.id })),
    testimonials: testimonials || DEFAULT_DB.testimonials,
    settings,
    source: categories ? 'supabase' : 'defaults'
  };
}

export async function getPost(slug) {
  const sb = getServiceClient();
  if (sb) {
    try {
      const { data, error } = await sb.from('posts').select('*').eq('slug', slug).limit(1);
      if (!error && data && data.length) return data[0];
    } catch (e) { /* fallback */ }
  }
  return DEFAULT_DB.posts.find(p => (p.slug || p.id) === slug) || null;
}

export function catName(data, id) {
  const c = (data.categories || []).find(c => c.id === id);
  return c ? c.name : '—';
}
export function catIcon(data, id) {
  const c = (data.categories || []).find(c => c.id === id);
  return c ? c.icon : '🏅';
}
export function defaultImage(settings, key) {
  const s = settings || {};
  if (s['IMAGES_' + key]) return s['IMAGES_' + key];
  return DEFAULT_IMAGES[key] || '';
}
