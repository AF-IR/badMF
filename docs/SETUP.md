# راهنمای گام‌به‌گام راه‌اندازی (SETUP)

این سند از صفر تا استقرار کامل روی Vercel را قدم‌به‌قدم توضیح می‌دهد. زمان لازم: حدود ۳۰ دقیقه.

---

## قدم ۱ — ساخت پروژه سوپابیس (دیتابیس)

1. به [supabase.com](https://supabase.com) بروید و با حساب گیت‌هاب/گوگل ثبت‌نام کنید.
2. **New project** بسازید (نام: مثلاً `fazel-najafabad`؛ region نزدیک: `Frankfurt` یا `Bahrain`؛ رمز دیتابیس را در جای امن ذخیره کنید).
3. بعد از آماده شدن پروژه، از منوی **SQL Editor** فایل [`supabase/schema.sql`](../supabase/schema.sql) را کامل کپی و **Run** کنید.
   - این فایل همه جدول‌ها، ایندکس‌ها، پالیسی‌های RLS، Bucket تصاویر و تریگر `updated_at` را می‌سازد.
4. از **Project Settings → API** این سه مقدار را بردارید:
   - `Project URL` → بعداً در `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **محرمانه — هرگز در کلاینت استفاده نشود**

## قدم ۲ — ساخت کاربر ادمین (برای ورود به پنل)

1. در سوپابیس: **Authentication → Users → Add user → Create new user**.
2. ایمیل و رمز ادمین را وارد کنید (مثلاً `admin@fazel-najafabad.ir`)، **Auto Confirm User** را فعال کنید.
3. در فایل `supabase/schema.sql` بخش تابع `is_admin()`، ایمیل ادمین را در آرایه `admin_emails` جایگزین کنید و دوباره همان تابع را اجرا کنید:
   ```sql
   create or replace function is_admin() returns boolean as $$
     declare admin_emails text[] := array['admin@fazel-najafabad.ir'];
     begin
       return auth.uid() is not null and (auth.email()) = any(admin_emails);
     end;
   $$ language plpgsql security definer;
   ```
4. حالا در سایت، مسیر `/admin` با همین ایمیل/رمز باز می‌شود.

## قدم ۳ — اجرای محلی (اختیاری)

```bash
cd fazel-najafabad-nextjs
npm install
cp .env.example .env.local
# .env.local را با مقادیر سوپابیس پر کنید
npm run dev        # http://localhost:3000
```

بدون هیچ متغیر محیطی هم سایت با داده‌های نمونه و پرداخت/دستیار «حالت آزمایشی» بالا می‌آید — برای دیدن طراحی عالی است.

## قدم ۴ — استقرار روی Vercel

1. ریپو را به گیت‌هاب پوش کنید.
2. در [vercel.com](https://vercel.com) → **Add New → Project** → ریپو را Import کنید.
3. Vercel به‌طور خودکار **Next.js** را تشخیص می‌دهد (بدون تنظیم build اضافه).
4. قبل از Deploy، در بخش **Environment Variables** این‌ها را وارد کنید:

| متغیر | مقدار |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | آدرس نهایی سایت (مثلاً `https://fazel-najafabad.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | از قدم ۱ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | از قدم ۱ |
| `SUPABASE_SERVICE_ROLE_KEY` | از قدم ۱ (محرمانه) |
| `NEXT_PUBLIC_CONTACT_PHONE` / `CONTACT_MOBILE` / `CONTACT_EMAIL` | شماره‌های مجموعه |
| `NEXT_PUBLIC_ADDRESS` | آدرس کامل مجموعه |
| `ZARINPAL_MERCHANT_ID` | قدم ۵ |
| `ZAI_BASE_URL` + `ZAI_API_KEY` | قدم ۶ |

5. **Deploy** بزنید. بعد از انتشار:
   - `robots.txt` و `sitemap.xml` به‌صورت خودکار از `NEXT_PUBLIC_SITE_URL` ساخته می‌شوند.
   - اگر دامنه اختصاصی دارید، در **Settings → Domains** اضافه و `NEXT_PUBLIC_SITE_URL` را به آن تغییر دهید و یک بار Redeploy بزنید.

## قدم ۵ — فعال‌سازی درگاه زرین‌پال

1. در [zarinpal.com](https://zarinpal.com) حساب فروشگاهی بسازید و تأیید کنید.
2. از پنل، **مرچنت ID (۳۶ کاراکتری)** را بردارید → متغیر `ZARINPAL_MERCHANT_ID`.
3. Callback URL درگاه را روی `https://YOUR-DOMAIN.vercel.app/payment` تنظیم کنید (صفحه نتیجه از قبل آماده است).
4. از این لحظه رزروها با پرداخت واقعی قطعی می‌شوند و در جدول `bookings` با وضعیت `paid` ثبت می‌شوند. بدون مرچنت، پرداخت «حالت آزمایشی» شبیه‌سازی می‌شود.

## قدم ۶ — دستیار هوشمند (API رایگان z.ai)

1. در z.ai حساب بسازید و یک **API Key** بگیرید (مدل‌های GLM Flash لایه رایگان دارند).
2. در Vercel این دو متغیر را بگذارید:
   - `ZAI_BASE_URL=https://api.z.ai/api/paas/v4`
   - `ZAI_API_KEY=…` (و اختیاری `ZAI_MODEL=glm-4.5-flash`)
3. Redeploy بزنید. دکمه 💬 شناور در همه صفحات حالا با هوش مصنوعی واقعی پاسخ می‌دهد و اطلاعات زنده (تعرفه‌ها، سانس‌ها) را از دیتابیس در متن پاسخ لحاظ می‌کند.
4. **تا زمان تنظیم کلید هم دستیار کار می‌کند** (حالت آزمایشی با پاسخ‌های مبتنی بر کلیدواژه).

## قدم ۷ — ورود به پنل و ثبت محتوا

1. به `https://دامنه/admin` بروید و با ایمیل/رمز ادمین وارد شوید.
2. سانس‌ها، تعرفه‌ها و دسته‌بندی‌های واقعی را ثبت کنید.
3. تصاویر واقعی مجموعه را از تب **تنظیمات → تصاویر** آپلود کنید (در استوریج سوپابیس ذخیره می‌شود).
4. مقالات بلاگ و نظرات مشتریان را اضافه کنید.
5. حداکثر ۶۰ ثانیه بعد، تغییرات در سایت عمومی اعمال می‌شود (ISR).

## عیب‌یابی سریع

| مشکل | علت رایج | راه‌حل |
|---|---|---|
| سایت داده نمونه نشان می‌دهد | متغیرهای سوپابیس تنظیم نشده/اشتباه | قدم ۱ و ۴ را چک کنید؛ بعد Redeploy |
| ورود ادمین ناموفق | کاربر ادمین ساخته نشده یا `is_admin()` ایمیل را نمی‌شناسد | قدم ۲ — ایمیل در آرایه `admin_emails` |
| «دسترسی غیرمجاز» در ذخیره پنل | لاگین منقضی شده | یک بار خروج و ورود مجدد |
| آپلود تصویر خطا می‌دهد | Bucket یا پالیسی استوریج ساخته نشده | `schema.sql` بخش ۶ را دوباره اجرا کنید |
| پرداخت دمو باز می‌شود | `ZARINPAL_MERCHANT_ID` خالی است | قدم ۵ |
| دستیار «حالت آزمایشی» است | `ZAI_API_KEY` خالی است | قدم ۶ |
