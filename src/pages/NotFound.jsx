import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-lg border border-amber-100">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-7xl font-black text-slate-800">۴۰۴</h1>
        <p className="text-xl text-slate-600 mt-4">اوه! صفحه‌ای که دنبالش هستید پیدا نشد!</p>
        <div className="w-20 h-1 bg-amber-400 mx-auto my-6"></div>
        <p className="text-slate-400 text-sm">شاید لینک اشتباه باشد یا صفحه حذف شده است.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg shadow-green-700/30"
        >
          <Home className="w-5 h-5" />
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
