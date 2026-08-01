import { Handshake, ShoppingBag, Phone, CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { PHONE_DISPLAY } from '../constants';

export default function Services() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800">خدمات ما</h1>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 mt-4 text-lg">همکاری با بزرگترین تولیدکننده‌ی بادام صادراتی ایران</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* کارت نمایندگی */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 hover:border-green-300 transition group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-200 transition">
              <Handshake className="w-8 h-8 text-green-700" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">دریافت نمایندگی فروش</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            با پیوستن به شبکه‌ی نمایندگان ما، از مزایای زیر بهره‌مند شوید:
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">پشتیبانی کامل</strong> – تیم ما در تمام مراحل فروش در کنار شماست.</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">سودآوری بالا</strong> – قیمت‌های ویژه و حاشیه‌ی سود عالی.</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-sky-500 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">محصول انحصاری</strong> – دسترسی به بهترین مرغوبیت بادام.</span>
            </li>
          </ul>
          <div className="mt-8 p-4 bg-green-50 rounded-2xl text-center">
            <p className="font-bold text-green-800">برای ثبت درخواست نمایندگی کلیک کنید</p>
            <a href={`tel:${PHONE_DISPLAY}`} className="text-2xl font-bold text-amber-600 hover:text-amber-700">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* کارت خرید مستقیم */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-amber-100 hover:border-amber-300 transition group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-amber-100 rounded-2xl group-hover:bg-amber-200 transition">
              <ShoppingBag className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-amber-800">خرید مستقیم از مزرعه</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            بادام‌های تازه و درجه‌یک را مستقیماً بدون واسطه تهیه کنید:
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">تضمین تازگی</strong> – برداشت روز و ارسال سریع.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">قیمت عمده</strong> – مناسب برای فروشگاه‌ها، عمده‌فروشان و کارخانه‌جات.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">ارسال به سراسر کشور</strong> – با بسته‌بندی ایمن و استاندارد.</span>
            </li>
          </ul>
          <div className="mt-8 p-4 bg-amber-50 rounded-2xl text-center">
            <p className="font-bold text-amber-800">ثبت سفارش خرید عمده</p>
            <a href={`tel:${PHONE_DISPLAY}`} className="text-2xl font-bold text-green-700 hover:text-green-800">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      {/* بنر پایین خدمات */}
      <div className="bg-gradient-to-l from-green-700 to-green-800 rounded-3xl p-8 text-center text-white">
        <Phone className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className="text-lg">مشاوره رایگان برای شروع همکاری</p>
        <p className="text-3xl font-bold mt-2">{PHONE_DISPLAY}</p>
      </div>
    </div>
  );
}
