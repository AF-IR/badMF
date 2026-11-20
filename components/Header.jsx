'use client';
/* هدر مشترک همه صفحات — ناوبری، تم، منوی موبایل */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'خانه' },
  { href: '/restaurant', label: 'رستوران' },
  { href: '/club', label: 'کلوپ ورزشی' },
  { href: '/blog', label: 'بلاگ' },
  { href: '/about', label: 'درباره ما' }
];

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('fazel_theme', t); } catch (e) { /* ignore */ }
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  };

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <span className="brand-mark">ف</span>
          <span>مجموعه تفریحی فاضل<small>رستوران • کلوپ ورزشی — نجف‌آباد</small></span>
        </Link>
        <nav aria-label="ناوبری اصلی">
          <ul>
            {NAV.map(n => (
              <li key={n.href}>
                <Link href={n.href} className={isActive(n.href) ? 'active' : ''}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" id="themeBtn" onClick={toggleTheme} aria-label="تغییر تم روشن/تیره" title="تغییر تم روشن/تیره">
            {theme === 'light' ? '☀️' : '🌙'}
          </button>
          <Link className="btn btn-primary btn-sm nav-cta" href="/booking">📅 رزرو سانس</Link>
          <button className="burger" onClick={() => setOpen(v => !v)} aria-label="باز و بسته کردن منو" aria-expanded={open}>☰</button>
        </div>
      </div>
      <div id="drawer" className={open ? 'open' : ''}>
        {NAV.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        <Link href="/booking" style={{ color: 'var(--brand)' }}>📅 رزرو آنلاین سانس</Link>
      </div>
    </header>
  );
}
