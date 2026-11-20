# مجموعه تفریحی فاضل — نجف‌آباد 🎱🍽️ (نسخه Next.js)

سایت رسمی و **واقعی** مجموعه تفریحی فاضل با **Next.js (App Router) + JavaScript** و اتصال **حرفه‌ای Supabase** — رندر سمت سرور (SSR/ISR)، سئوی تمام‌عیار، تصاویر واقعی با `next/image`، رزرو آنلاین با زرین‌پال، دستیار هوشمند با API رایگان z.ai و پنل مدیریت کامل.

> این نسخه، نسخه ارتقایافته‌ی پروژه است: همان طراحی و امکانات نسخه استاتیک، این بار با فریم‌ورک واقعی Next.js، URLهای اختصاصی برای هر مقاله بلاگ، آپلود تصویر در استوریج سوپابیس و امنیت مبتنی بر RLS.

---

## ✨ امکانات

| بخش | توضیح |
|---|---|
| 🌐 معماری | Next.js App Router — Server Components + ISR (بازخوانی محتوا هر ۶۰ ثانیه) |
| 🗄️ دیتابیس | Supabase (PostgreSQL) با **RLS حرفه‌ای**، کلاینت‌های استاندارد `@supabase/ssr` و service-role فقط سمت سرور |
| 🖼️ تصاویر | تصاویر واقعی پیش‌فرض + **آپلود در استوریج سوپابیس** از پنل ادمین + `next/image` با جای‌نگهدار هوشمند |
| 🔗 لینک‌دهی | URL اختصاصی هر مقاله (`/blog/[slug]`)، breadcrumb با اسکیما، لینک‌های متنی بین همه صفحات، sitemap داینامیک |
| 🔍 سئو | Metadata API کامل (OG/Twitter/canonical)، JSON-LD روی همه صفحات، `robots.ts`/`sitemap.ts` خودکار، geo tags |
| 📅 رزرو | ویزارد سه‌قدمی + درگاه **زرین‌پال** (request/verify سمت سرور) + ثبت امن در دیتابیس + حالت آزمایشی |
| 🤖 دستیار هوشمند | چت شناور همه صفحات با **API رایگان z.ai** (glm-4.5-flash) — کلید فقط سرور + fallback هوشمند |
| ⚙️ پنل ادمین | ورود با **Supabase Auth**، مدیریت سانس/تعرفه/دسته/بلاگ/نظرات/رزروها/تنظیمات/تصاویر |
| 🌗 تم | روشن/تیره با ذخیره انتخاب و بدون فلش اشتباه (اسکریپت pre-hydration) |

## 📁 ساختار پروژه

```
fazel-najafabad-nextjs/
├── app/
│   ├── layout.js              ← لایوت ریشه: متادیتای سراسری، هدر/فوتر/دستیار، JSON-LD وب‌سایت+کسب‌وکار
│   ├── page.js                ← خانه (۱۲ سکشن، ISR 60s)
│   ├── restaurant/page.js     ← رستوران
│   ├── club/page.js           ← کلوپ ورزشی (فیلتر روز با URL ?day=)
│   ├── booking/page.js        ← رزرو (?cat= پیش‌انتخاب)
│   ├── blog/page.js           ← فهرست مقالات
│   ├── blog/[slug]/page.js    ← صفحه هر مقاله (generateStaticParams + متادیتای داینامیک)
│   ├── about/page.js          ← درباره ما و تماس و نقشه
│   ├── payment/page.js        ← نتیجه پرداخت (callback زرین‌پال) — noindex
│   ├── admin/page.js          ← پنل مدیریت — noindex
│   ├── not-found.js           ← ۴۰۴ اختصاصی
│   ├── robots.js / sitemap.js ← سئوی فنی خودکار
│   └── api/
│       ├── bookings/route.js         ← ثبت رزرو + اتصال زرین‌پال
│       ├── bookings/confirm/route.js ← تایید پرداخت آزمایشی
│       ├── zarinpal/request/route.js
│       ├── zarinpal/verify/route.js
│       ├── assistant/route.js        ← دستیار هوشمند (z.ai + fallback)
│       └── admin-db/route.js         ← پل امن ادمین (تایید سشن + service role)
├── components/                ← Header، Footer، Assistant، BookingWizard، AdminPanel، SmartImage، …
├── lib/
│   ├── supabase/server.js     ← کلاینت سرور (@supabase/ssr + کوکی‌ها)
│   ├── supabase/browser.js    ← کلاینت مرورگر
│   ├── supabase/service.js    ← کلاینت service-role (فقط سرور)
│   ├── data.js                ← لایه داده: سوپابیس → fallback داده پیش‌فرض
│   ├── config.js              ← پیکربندی از متغیرهای محیطی
│   ├── images.js              ← تصاویر واقعی پیش‌فرض + resolve تنظیمات ادمین
│   └── utils.js               ← ابزارها (اعداد فارسی، مبلغ، اسلاگ…)
├── supabase/schema.sql        ← اسکیمای کامل + RLS + استوریج + trigger
├── docs/
│   ├── SETUP.md               ← راهنمای گام‌به‌گام استقرار از صفر
│   ├── SUPABASE.md            ← اتصال حرفه‌ای سوپابیس و امنیت
│   └── CONTENT.md             ← مدیریت محتوا و تصاویر
├── .env.example               ← قالب کامل متغیرهای محیطی
└── package.json
```

## 🚀 اجرا

```bash
npm install
cp .env.example .env.local   # و مقادیر را پر کنید (اختیاری — بدون آن هم سایت با داده نمونه بالا می‌آید)
npm run dev                  # http://localhost:3000
```

## 📚 مستندات

- **[docs/SETUP.md](docs/SETUP.md)** — راهنمای گام‌به‌گام: از صفر تا استقرار روی Vercel (سوپابیس، زرین‌پال، z.ai، ادمین)
- **[docs/SUPABASE.md](docs/SUPABASE.md)** — معماری اتصال حرفه‌ای: سه کلاینت، RLS، service-role، استوریج
- **[docs/CONTENT.md](docs/CONTENT.md)** — مدیریت روزمره: سانس‌ها، تعرفه‌ها، بلاگ، تصاویر، نظرات

## ✅ چک‌لیست راه‌اندازی

- [ ] اجرای `supabase/schema.sql` در SQL Editor سوپابیس
- [ ] ساخت کاربر ادمین در Authentication → Users (راهنمای docs/SETUP.md)
- [ ] متغیرهای محیطی در Vercel (سوپابیس، زرین‌پال، z.ai، تماس و آدرس)
- [ ] Callback URL زرین‌پال = `https://دامنه/payment`
- [ ] Deploy روی Vercel (Framework: Next.js — تشخیص خودکار)
- [ ] ثبت سانس‌ها و تعرفه‌های واقعی از پنل `/admin`
