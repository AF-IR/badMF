import { Outlet, NavLink } from 'react-router-dom';
import { Phone, MapPin, Menu, X } from 'lucide-react';
import { NAV_ITEMS, PHONE_DISPLAY, BUSINESS_NAME } from '../constants';
import { useState } from 'react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* لوگو */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌰</span>
              <div>
                <h1 className="text-xl font-bold text-green-800 leading-tight">
                  {BUSINESS_NAME}
                </h1>
                <span className="text-xs text-amber-600 font-medium">صادرات · کیفیت · مستقیم از مزرعه</span>
              </div>
            </div>

            {/* دکمه منو موبایل */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-green-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* لینک‌های ناوبری */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <a
                href={`tel:${PHONE_DISPLAY}`}
                className="mr-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                تماس فوری
              </a>
            </nav>
          </div>

          {/* منوی موبایل */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-green-100">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-700 text-white'
                        : 'text-slate-700 hover:bg-green-50'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <a
                href={`tel:${PHONE_DISPLAY}`}
                className="mt-2 block text-center bg-amber-500 text-white px-4 py-3 rounded-lg text-sm font-medium"
              >
                تماس فوری: {PHONE_DISPLAY}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      {/* فوتر */}
      <footer className="bg-white border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>🌰</span>
              <span>{BUSINESS_NAME}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href={`tel:${PHONE_DISPLAY}`} className="hover:text-green-700 flex items-center gap-1">
                <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
              </a>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 flex items-center gap-1"
              >
                <MapPin className="w-4 h-4" /> موقعیت در مپ
              </a>
            </div>
            <p className="text-xs text-slate-400">© ۱۴۰۴ - تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
