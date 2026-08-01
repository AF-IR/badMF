import { ShieldCheck, Truck, Leaf, Heart } from 'lucide-react';
import { BUSINESS_NAME } from '../constants';

export default function About() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800">درباره {BUSINESS_NAME}</h1>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="prose prose-lg max-w-none text-slate-700">
        <p className="text-lg leading-relaxed">
          <strong>{BUSINESS_NAME}</strong> با بیش از ۱۵ سال تجربه در زمینه‌ی کشت، برداشت و صادرات بادام،
          یکی از معتبرترین تأمین‌کنندگان بادام مرغوب در ایران است. ما با تکیه بر دانش بومی و به‌روزترین
          روش‌های کشاورزی، محصولاتی با بالاترین کیفیت و مطابق با استانداردهای جهانی تولید می‌کنیم.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          فلسفه‌ی ما <strong>«از مزرعه تا سفره»</strong> است. با حذف واسطه‌ها، بادام‌های تازه و
          خوش‌طعم را با قیمتی منصفانه به دست مشتریان عزیز می‌رسانیم.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-green-600">
          <Leaf className="w-10 h-10 text-green-600 mx-auto" />
          <h4 className="font-bold mt-3">ارگانیک و طبیعی</h4>
          <p className="text-sm text-slate-500">بدون استفاده از سموم شیمیایی</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-amber-500">
          <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="font-bold mt-3">کیفیت تضمینی</h4>
          <p className="text-sm text-slate-500">کنترل کیفیت در تمام مراحل</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-sky-500">
          <Truck className="w-10 h-10 text-sky-500 mx-auto" />
          <h4 className="font-bold mt-3">ارسال سریع</h4>
          <p className="text-sm text-slate-500">به سراسر ایران و جهان</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-rose-400">
          <Heart className="w-10 h-10 text-rose-400 mx-auto" />
          <h4 className="font-bold mt-3">رضایت مشتری</h4>
          <p className="text-sm text-slate-500">اولویت اول ما</p>
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200 mt-6">
        <h3 className="text-2xl font-bold text-amber-800">چرا بادام ما؟</h3>
        <ul className="grid md:grid-cols-2 gap-3 mt-4 list-disc list-inside text-slate-700">
          <li>انواع بادام درختی (کاغذی، مامایی، سنگی) با درجه‌بندی دقیق</li>
          <li>قیمت‌های عمده و فوق‌العاده برای همکاران و نمایندگان</li>
          <li>بسته‌بندی‌های متناسب با نیاز صادراتی و داخلی</li>
          <li>پشتیبانی ۲۴ ساعته در طول شبانه‌روز</li>
        </ul>
      </div>
    </div>
  );
}
