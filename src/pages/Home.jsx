import { Link } from 'react-router-dom';
import { Award, Tree, MapPin, Phone, Users, Package, TrendingUp, ShieldCheck } from 'lucide-react';
import { PHONE_DISPLAY, BUSINESS_NAME } from '../constants';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* بخش Hero با گرادیان و جلوه‌ی شیشه‌ای */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 via-amber-50 to-white p-8 md:p-16 shadow-lg border border-green-100/50">
        <div className="relative z-10 text-center">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            🌰 بهترین بادام‌های ایران
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 leading-tight">
            {BUSINESS_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mt-4 max-w-2xl mx-auto">
            مستقیم از مزارع به دست شما <br />
            <span className="text-amber-600 font-semibold">بدون واسطه · با کیفیت صادراتی</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/services"
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-green-700/30 transition flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              دریافت نمایندگی
            </Link>
            <Link
              to="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/30 transition flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              تماس با ما
            </Link>
          </div>
        </div>
        {/* المان‌های تزئینی پس‌زمینه */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full translate-x-1/3 translate-y-1/2 blur-3xl"></div>
      </section>

      {/* آمار و ارقام */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { number: '۱۵+', label: 'سال تجربه', icon: TrendingUp },
          { number: '۵۰۰+', label: 'تن صادرات', icon: Package },
          { number: '۱۲۰+', label: 'مشتری راضی', icon: Users },
          { number: '۱۰۰%', label: 'کیفیت تضمینی', icon: ShieldCheck },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-md text-center border border-green-50">
            <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-800">{stat.number}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* سه ویژگی اصلی */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition border border-green-100/50 hover:border-green-300 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition">
            <Award className="w-8 h-8 text-green-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">کیفیت صادراتی</h3>
          <p className="text-slate-500 mt-2">بادام‌های درجه‌یک با استانداردهای بین‌المللی و بسته‌بندی حرفه‌ای</p>
        </div>

        <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition border border-green-100/50 hover:border-green-300 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition">
            <Tree className="w-8 h-8 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">مستقیم از مزرعه</h3>
          <p className="text-slate-500 mt-2">بدون واسطه، تازه‌ترین محصول با قیمت مناسب و عادلانه</p>
        </div>

        <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition border border-green-100/50 hover:border-green-300 text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-200 transition">
            <MapPin className="w-8 h-8 text-sky-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">دسترسی آسان</h3>
          <p className="text-slate-500 mt-2">موقعیت مکانی دقیق در گوگل مپ و ارتباط سریع با تیم ما</p>
        </div>
      </div>

      {/* بنر تماس */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
        <Phone className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <p className="text-xl md:text-2xl font-light">برای سفارش عمده یا دریافت نمایندگی، همین حالا تماس بگیرید</p>
        <a
          href={`tel:${PHONE_DISPLAY}`}
          className="inline-block mt-6 bg-amber-500 hover:bg-amber-400 text-white px-10 py-4 rounded-2xl text-2xl font-bold transition shadow-lg shadow-black/20"
        >
          {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
