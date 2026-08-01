import { Phone, MapPin, Clock, Mail, Navigation } from 'lucide-react';
import { PHONE_DISPLAY, MAP_LINK, BUSINESS_NAME } from '../constants';

export default function Contact() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800">تماس با ما</h1>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 mt-4 text-lg">ما ۲۴ ساعته پاسخگوی شما هستیم</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* کارت تلفن */}
        <div className="bg-white p-8 rounded-3xl shadow-md text-center border border-green-100 hover:shadow-xl transition">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-green-700" />
          </div>
          <h3 className="font-bold text-lg">تلفن تماس</h3>
          <a href={`tel:${PHONE_DISPLAY}`} className="text-2xl font-bold text-green-700 mt-2 block hover:text-amber-600 transition">
            {PHONE_DISPLAY}
          </a>
          <p className="text-sm text-slate-400 mt-1">(پاسخگویی ۸ صبح تا ۱۰ شب)</p>
        </div>

        {/* کارت موقعیت مکانی */}
        <div className="bg-white p-8 rounded-3xl shadow-md text-center border border-amber-100 hover:shadow-xl transition">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-amber-700" />
          </div>
          <h3 className="font-bold text-lg">موقعیت مکانی</h3>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 mt-2 block font-medium hover:underline flex items-center justify-center gap-1"
          >
            <Navigation className="w-4 h-4" />
            مشاهده در گوگل مپ
          </a>
          <p className="text-sm text-slate-400 mt-1">مشهد، ایران</p>
        </div>

        {/* کارت ساعت کاری */}
        <div className="bg-white p-8 rounded-3xl shadow-md text-center border border-sky-100 hover:shadow-xl transition">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-sky-700" />
          </div>
          <h3 className="font-bold text-lg">ساعت کاری</h3>
          <p className="text-slate-700 mt-2">شنبه تا پنجشنبه: <strong>۸:۰۰ – ۱۸:۰۰</strong></p>
          <p className="text-slate-500">جمعه: <span className="text-rose-500">تعطیل</span></p>
          <p className="text-xs text-slate-400 mt-2">* هماهنگی برای روزهای تعطیل امکان‌پذیر است.</p>
        </div>
      </div>

      {/* نقشه گوگل (جاسازی شده) */}
      <div className="bg-white p-4 rounded-3xl shadow-lg border border-green-100 overflow-hidden">
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDAwJzAwLjAiTiAwwrAwMCcwMC4wIkU!5e0!3m2!1sen!2sus!4v1700000000000"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`موقعیت ${BUSINESS_NAME}`}
          ></iframe>
        </div>
        <div className="text-center mt-4">
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition"
          >
            <MapPin className="w-5 h-5" />
            باز کردن مسیر در گوگل مپ
          </a>
        </div>
      </div>
    </div>
  );
}
