// POST /api/assistant — دستیار هوشمند با API رایگان z.ai (GLM Flash)
// پیکربندی: ZAI_BASE_URL + ZAI_API_KEY (+ اختیاری ZAI_MODEL / ZAI_TOKEN)
// بدون کلید یا در خطا: پاسخ هوشمند مبتنی بر کلیدواژه (حالت آزمایشی)
import { NextResponse } from 'next/server';
import { getSiteData, catName as cn } from '@/lib/data';
import { money, faNum } from '@/lib/utils';
import { DEFAULT_DB } from '@/lib/data';

const DEFAULT_MODEL = 'glm-4.5-flash';
const MAX_MSGS = 12;
const SYSTEM_PROMPT =
  'تو «دستیار هوشمند مجموعه تفریحی فاضل» در نجف‌آباد هستی؛ دستیار وب‌سایت رسمی مجموعه.\n' +
  'قوانین پاسخ‌دهی:\n' +
  '۱) فقط فارسی، لحن دوستانه، پرانرژی و کوتاه (حداکثر ۴ جمله) پاسخ بده.\n' +
  '۲) فقط بر اساس «اطلاعات مجموعه» که در پیام سیستم داده شده جواب بده؛ از حدس زدن قیمت یا سانسی که در اطلاعات نیست خودداری کن و در آن صورت بگو برای اطلاعات دقیق با مجموعه تماس بگیرد یا به صفحه مربوطه سر بزند.\n' +
  '۳) برای راهنمایی رزرو، کاربر را به صفحه «رزرو سانس» (لینک /booking) و برای تعرفه‌ها به صفحه «کلوپ ورزشی» (/club) هدایت کن.\n' +
  '۴) از دادن اطلاعات شخصی، مباحث سیاسی یا هر موضوع خارج از مجموعه معذرت‌خواهی کن و بحث را به خدمات مجموعه برگردان.\n' +
  '۵) شماره تماس و آدرس فقط اگر در اطلاعات مجموعه مقدار واقعی وجود دارد را بگو؛ در غیر این صورت بگو پس از تکمیل اطلاعات در سایت نمایش داده می‌شود.';

function loadZaiConfig() {
  const baseUrl = (process.env.ZAI_BASE_URL || '').trim().replace(/\/+$/, '');
  const apiKey = (process.env.ZAI_API_KEY || process.env.Z_AI_API_KEY || '').trim();
  if (baseUrl && apiKey) {
    return { baseUrl, apiKey, token: (process.env.ZAI_TOKEN || '').trim(), model: (process.env.ZAI_MODEL || '').trim() || DEFAULT_MODEL };
  }
  return null;
}

function demoReply(q, ctxSummary) {
  const t = String(q || '');
  const has = (...ws) => ws.some(w => t.includes(w));
  if (has('سلام', 'درود', 'خوبی')) return 'سلام! 👋 من دستیار هوشمند مجموعه فاضل هستم. درباره رزرو سانس، تعرفه‌ها، ساعات کاری و آدرس می‌توانم کمک‌تان کنم. بپرسید!';
  if (has('رزرو', 'سانس', 'وقت', 'نوبت')) return 'رزرو سانس خیلی ساده است: از صفحه «رزرو سانس» (/booking) ابتدا دسته‌بندی (بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز یا بازی‌های رومیزی) را انتخاب کنید، بعد روز و سانس دلخواه را بزنید و مبلغ را با درگاه امن زرین‌پال پرداخت کنید؛ رزرو بلافاصله قطعی می‌شود. 🎱';
  if (has('قیمت', 'تعرفه', 'چند', 'تومان', 'هزینه')) return 'تعرفه‌ها به تومان و شفاف در صفحه «کلوپ ورزشی» (/club) منتشر می‌شود. برای قیمت دقیق سانس انتخابی، در صفحه رزرو سانس دلخواه را بزنید؛ مبلغ پیش از پرداخت نمایش داده می‌شود.';
  if (has('آدرس', 'کجا', 'موقعیت', 'مسیر')) return 'مجموعه تفریحی فاضل در شهر نجف‌آباد (استان اصفهان) قرار دارد؛ ساختمان سه‌طبقه با رستوران در طبقه همکف و کلوپ ورزشی در طبقه اول. نقشه و آدرس دقیق در صفحه «درباره ما» (/about) است.';
  if (has('افتتاح', 'کی ', 'زمان', 'باز')) return 'کلوپ ورزشی طبقه اول به‌زودی افتتاح می‌شود و تاریخ دقیق آن به‌محض نهایی شدن در همین سایت و بلاگ اعلام می‌گردد. رستوران طبقه همکف فعال است. 🍽️';
  if (has('رستوران', 'غذا', 'منو', 'شام', 'ناهار')) return 'رستوران فاضل در طبقه همکف با فضای خانوادگی و غذاهای ایرانی و گریل، همه‌روزه از ۱۲ تا ۲۳ پذیرای شماست؛ می‌توانید برنامه «شام + بازی» را در یک آدرس بچینید.';
  if (has('تماس', 'شماره', 'تلفن', 'موبایل')) return 'شماره تماس مجموعه پس از تنظیم در پنل مدیریت، در فوتر همه صفحات و صفحه «درباره ما» نمایش داده می‌شود. برای رزرو نیازی به تماس نیست؛ رزرو کاملاً آنلاین است.';
  if (has('بانوان', 'آقایان', 'تفکیک')) return 'بله؛ سانس‌های ویژه بانوان و آقایان در برنامه سانس‌ها با برچسب مخصوص مشخص می‌شوند و سانس‌های «مختلط» برای همه باز است.';
  if (has('پرداخت', 'زرین', 'پول')) return 'پرداخت‌ها فقط از طریق درگاه رسمی زرین‌پال انجام می‌شود و پس از پرداخت، رسید آنلاین و کد رزرو صادر می‌گردد. تا قبل از پرداخت هیچ مبلغی کسر نمی‌شود.';
  return 'مجموعه تفریحی فاضل یک مقصد کامل برای تفریح در نجف‌آباد است: رستوران در همکف و کلوپ ورزشی (بیلیارد، گیم، فوتبال دستی، دارت، تنیس روی میز و بازی‌های رومیزی) در طبقه اول به‌زودی افتتاح می‌شود. درباره رزرو سانس، تعرفه‌ها یا آدرس بپرسید! 😊';
}

async function buildContext() {
  try {
    const data = await getSiteData();
    const cats = (data.categories || []).filter(c => c.active).map(c => c.name).join('، ');
    const tariff = (data.tariffs || []).slice(0, 4).map(t => cn(DEFAULT_DB, t.categoryId) + ' ' + money(t.price) + ' تومان/' + (t.unit || '')).join(' | ');
    const n = (data.sessions || []).filter(s => s.active).length;
    const settings = data.settings || {};
    return {
      text:
        '- دسته‌بندی‌ها: ' + cats + '\n' +
        '- نمونه تعرفه‌ها: ' + (tariff || '—') + '\n' +
        '- تعداد سانس‌های فعال هفته: ' + faNum(n) + '\n' +
        '- رستوران همکف: ' + (settings.WORK_HOURS_RESTAURANT || 'همه‌روزه از ۱۲ تا ۲۳') + '\n' +
        '- کلوپ: ' + (settings.WORK_HOURS_CLUB || 'پس از افتتاح اعلام می‌شود') + '\n' +
        '- آدرس: ' + (settings.ADDRESS || 'در انتظار تکمیل') + '\n' +
        '- تلفن: ' + (settings.CONTACT_PHONE || settings.CONTACT_MOBILE || 'در انتظار تکمیل'),
      supabase: data.source === 'supabase'
    };
  } catch (e) {
    return { text: '—', supabase: false };
  }
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  let msgs = Array.isArray(body.messages) ? body.messages : [];
  msgs = msgs.slice(-MAX_MSGS)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: String(m.content || '').slice(0, 1200) }))
    .filter(m => m.content);
  const lastUser = [...msgs].reverse().find(m => m.role === 'user');
  if (!lastUser) return NextResponse.json({ error: 'پیامی ارسال نشده است.' }, { status: 400 });

  const ctx = await buildContext();
  const page = String(body.page || '').slice(0, 120);
  const cfg = loadZaiConfig();

  if (cfg) {
    const system =
      SYSTEM_PROMPT +
      '\n\n### اطلاعات مجموعه (مبنای پاسخ):\n' +
      '- نام: مجموعه تفریحی فاضل — نجف‌آباد، استان اصفهان\n' +
      '- ساختار: سه طبقه — همکف: رستوران فعال | طبقه اول: کلوپ ورزشی (به‌زودی افتتاح) | طبقه دوم: در حال آماده‌سازی\n' +
      '- رزرو: کاملاً آنلاین از صفحه رزرو سانس با پرداخت زرین‌پال\n' +
      '- صفحات سایت: / (خانه)، /club (کلوپ و تعرفه‌ها)، /restaurant، /booking (رزرو)، /blog، /about (درباره و تماس)\n' +
      '- صفحه فعلی کاربر: ' + (page || '/') + '\n' +
      '- داده‌های زنده دیتابیس (' + (ctx.supabase ? 'سوپابیس' : 'پیش‌فرض') + '):\n' + ctx.text;
    try {
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.apiKey, 'X-Z-AI-From': 'Z' };
      if (cfg.token) headers['X-Token'] = cfg.token;
      const r = await fetch(cfg.baseUrl + '/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({ model: cfg.model, messages: [{ role: 'user', content: system }, ...msgs], thinking: { type: 'disabled' } })
      });
      if (r.ok) {
        const j = await r.json();
        const reply = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (reply && String(reply).trim()) {
          return NextResponse.json({ ok: true, reply: String(reply).trim(), engine: 'z.ai' });
        }
      }
    } catch (e) { /* خطای شبکه → fallback */ }
  }

  return NextResponse.json({ ok: true, reply: demoReply(lastUser.content), engine: 'demo' });
}
