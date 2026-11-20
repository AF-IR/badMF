'use client';
/* پنل مدیریت — ورود با سوپابیس Auth + CRUD امن از طریق /api/admin-db
   حالت آزمایشی: بدون سوپابیس، داده‌ها در مرورگر ذخیره می‌شوند */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient, hasSupabase } from '@/lib/supabase/browser';
import { DEFAULT_DB, catName as cn, catIcon as ci } from '@/lib/data';
import { SETTINGS_KEYS } from '@/lib/config';
import { faNum, money, faTime, DAY_NAMES, faDate } from '@/lib/utils';

const BK_STATUS = {
  pending: ['در انتظار پرداخت', 'badge-soon'],
  paid: ['پرداخت شده', 'badge-ok'],
  'paid-demo': ['پرداخت آزمایشی', 'badge-ok'],
  'paid-manual': ['پرداخت حضوری', 'badge-ok'],
  failed: ['ناموفق', 'badge-off'],
  canceled: ['لغو شده', 'badge-off']
};

const SPEC = {
  sessions: {
    label: 'سانس', key: 'sessions',
    cols: [['دسته', r => ci(DEFAULT_DB, r.categoryId) + ' ' + cn(DEFAULT_DB, r.categoryId)], ['روز', r => DAY_NAMES[+r.day] || '—'], ['ساعت', r => faTime(r.start) + ' تا ' + faTime(r.end)], ['ظرفیت', r => faNum(r.capacity) + ' نفر'], ['قیمت', r => money(r.price)], ['جنسیت', r => r.gender || 'مختلط'], ['وضعیت', r => r.active ? '✔' : '✖']],
    fields: [
      { k: 'categoryId', l: 'دسته‌بندی', t: 'select', opts: () => DEFAULT_DB.categories.map(c => ({ v: c.id, t: c.icon + ' ' + c.name })) },
      { k: 'day', l: 'روز هفته', t: 'select', opts: () => DAY_NAMES.map((d, i) => ({ v: i, t: d })) },
      { k: 'start', l: 'ساعت شروع', t: 'time' }, { k: 'end', l: 'ساعت پایان', t: 'time' },
      { k: 'capacity', l: 'ظرفیت (نفر)', t: 'number' }, { k: 'price', l: 'قیمت هر نفر (تومان)', t: 'number' },
      { k: 'gender', l: 'جنسیت سانس', t: 'select', opts: ['مختلط', 'آقایان', 'بانوان'] },
      { k: 'active', l: '', t: 'check' }
    ]
  },
  cats: {
    label: 'دسته‌بندی', key: 'categories',
    cols: [['دسته', r => r.icon + ' ' + r.name], ['توضیح', r => String(r.desc || '').slice(0, 42) + '…'], ['وضعیت', r => r.active ? '✔ فعال' : '✖ غیرفعال']],
    fields: [{ k: 'name', l: 'نام دسته' }, { k: 'icon', l: 'آیکون (ایموجی)' }, { k: 'desc', l: 'توضیح', t: 'textarea' }, { k: 'active', l: '', t: 'check' }]
  },
  tariffs: {
    label: 'تعرفه', key: 'tariffs',
    cols: [['دسته', r => cn(DEFAULT_DB, r.categoryId)], ['عنوان', r => r.title], ['واحد', r => r.unit], ['قیمت', r => money(r.price)], ['توضیح', r => r.note || '—']],
    fields: [
      { k: 'categoryId', l: 'دسته‌بندی', t: 'select', opts: () => DEFAULT_DB.categories.map(c => ({ v: c.id, t: c.icon + ' ' + c.name })) },
      { k: 'title', l: 'عنوان تعرفه' }, { k: 'unit', l: 'واحد (مثال: هر ساعت)' },
      { k: 'price', l: 'قیمت (تومان)', t: 'number' }, { k: 'note', l: 'توضیح (اختیاری)' }
    ]
  },
  posts: {
    label: 'مطلب بلاگ', key: 'posts',
    cols: [['عنوان', r => r.title], ['برچسب', r => r.tag], ['تاریخ', r => r.date]],
    fields: [
      { k: 'title', l: 'عنوان' }, { k: 'tag', l: 'برچسب (مثال: آموزش)' },
      { k: 'date', l: 'تاریخ (مثال: ۱۴۰۵/۰۹/۰۱)' },
      { k: 'image', l: 'تصویر (آپلود یا لینک)', t: 'image' },
      { k: 'excerpt', l: 'خلاصه', t: 'textarea' },
      { k: 'body', l: 'متن کامل (پاراگراف‌ها را با دو بار Enter جدا کنید)', t: 'textarea' }
    ]
  },
  testimonials: {
    label: 'نظر مشتری', key: 'testimonials',
    cols: [['نام', r => r.name], ['متن نظر', r => String(r.text || '').slice(0, 48) + '…'], ['وضعیت', r => r.active !== false ? '✔' : '✖']],
    fields: [{ k: 'name', l: 'نام / نام نمایشی' }, { k: 'active', l: '', t: 'check' }, { k: 'text', l: 'متن نظر', t: 'textarea' }]
  }
};

const SETTING_GROUPS = [
  ['عمومی', ['SITE_NAME', 'SITE_TAGLINE', 'SITE_URL', 'CLUB_OPENING_NOTE', 'FLOOR2_NOTE']],
  ['تماس و آدرس', ['CONTACT_PHONE', 'CONTACT_MOBILE', 'CONTACT_EMAIL', 'ADDRESS', 'WORK_HOURS_RESTAURANT', 'WORK_HOURS_CLUB', 'MAP_EMBED_URL', 'GEO_LAT', 'GEO_LNG']],
  ['شبکه‌های اجتماعی', ['SOCIAL_INSTAGRAM', 'SOCIAL_TELEGRAM', 'SOCIAL_WHATSAPP']],
  ['تصاویر (آپلود در استوریج سوپابیس یا لینک)', ['IMAGES_HERO', 'IMAGES_RESTAURANT', 'IMAGES_RESTAURANT_2', 'IMAGES_RESTAURANT_3', 'IMAGES_CLUB', 'IMAGES_BILLIARD', 'IMAGES_GAMES', 'IMAGES_FOOD', 'IMAGES_GALLERY_1', 'IMAGES_GALLERY_2', 'IMAGES_GALLERY_3', 'IMAGES_GALLERY_4', 'IMAGES_GALLERY_5', 'IMAGES_GALLERY_6', 'IMAGES_OG']],
  ['پیکربندی جغرافیایی', ['GEO_LAT', 'GEO_LNG']]
];
const IMAGE_KEYS = SETTING_GROUPS[3][1];

export default function AdminPanel({ supabaseOn }) {
  const [mode, setMode] = useState(supabaseOn ? 'cloud' : 'local'); // cloud | local
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('dash');
  const [db, setDb] = useState(() => JSON.parse(JSON.stringify(DEFAULT_DB)));
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState(null); // {kind, id}
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  /* داده آزمایشی مرورگر */
  useEffect(() => {
    if (supabaseOn) return;
    try {
      const saved = JSON.parse(localStorage.getItem('fazel_db_v1') || 'null');
      if (saved && saved.categories) setDb(saved);
    } catch (e) { /* ignore */ }
  }, [supabaseOn]);

  /* ---- بارگذاری اولیه: سشن ادمین ---- */
  useEffect(() => {
    if (!supabaseOn) return;
    const sb = createClient();
    sb.auth.getSession().then(({ data }) => {
      if (data && data.session && data.session.user) {
        setUser(data.session.user);
        loadRemote();
      }
    });
  }, [supabaseOn]);

  /* ---- بارگذاری داده ریموت از پل امن ادمین ---- */
  async function loadRemote() {
    const tables = ['categories', 'tariffs', 'sessions', 'posts', 'testimonials', 'bookings', 'settings'];
    try {
      const res = await Promise.all(tables.map(t => fetch('/api/admin-db?table=' + t).then(r => r.json())));
      const next = {};
      tables.forEach((t, i) => { next[t] = res[i]; });
      if (Object.values(res).some(v => v && v.error)) {
        showToast('خطا در بارگذاری: ' + (res.find(r => r.error) || {}).error);
        return;
      }
      const merged = { ...DEFAULT_DB };
      tables.forEach(t => {
        if (t === 'settings') merged.settings = next.settings || {};
        else if (Array.isArray(next[t]) && next[t].length) merged[t === 'cats' ? 'categories' : t] = next[t];
      });
      setDb(merged);
    } catch (e) {
      showToast('ارتباط با سرور ناموفق بود.');
    }
  }

  /* ---- ورود / خروج ---- */
  async function login(e) {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.target);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');
    if (supabaseOn) {
      setBusy(true);
      const sb = createClient();
      const { error } = await sb.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { setErr('ورود ناموفق: ' + error.message); return; }
      const { data } = await sb.auth.getUser();
      setUser(data && data.user);
      showToast('خوش آمدید 👋');
      loadRemote();
    } else {
      /* حالت آزمایشی — رمز از تنظیمات محلی */
      const localPw = db.settings.ADMIN_PASSWORD || 'admin123';
      if (password === localPw) {
        try { localStorage.setItem('fazel_admin', '1'); } catch (e) {}
        showToast('حالت آزمایشی فعال شد (ذخیره‌سازی در مرورگر)');
      } else setErr('رمز اشتباه است.');
    }
  }
  async function logout() {
    if (supabaseOn) { try { await createClient().auth.signOut(); } catch (e) {} }
    setUser(null);
    try { localStorage.removeItem('fazel_admin'); } catch (e) {}
    setTab('dash');
  }

  /* ---- عملیات CRUD ---- */
  async function apiCall(method, table, extra) {
    const r = await fetch('/api/admin-db', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, ...extra })
    });
    return r.json();
  }

  async function saveEntity(kind, form) {
    const sp = SPEC[kind];
    const item = {};
    sp.fields.forEach(f => {
      const el = form.querySelector('[name="' + f.k + '"]');
      if (f.t === 'check') item[f.k] = el.checked;
      else if (f.t === 'number') item[f.k] = Number(el.value) || 0;
      else item[f.k] = (el.value || '').trim();
    });
    setBusy(true);
    if (mode === 'cloud' && user) {
      const id = modal.id;
      if (id) await apiCall('PATCH', sp.key, { row: { id, ...item } });
      else {
        item.id = kind.slice(0, 3) + Date.now();
        if (kind === 'posts' && !item.slug) {
          const { slugify } = await import('@/lib/utils');
          item.slug = slugify(item.title, item.id);
        }
        await apiCall('POST', sp.key, { rows: [item] });
      }
      await loadRemote();
    } else {
      const arr = db[sp.key] || [];
      if (modal.id) {
        const idx = arr.findIndex(x => x.id === modal.id);
        if (idx > -1) arr[idx] = { ...arr[idx], ...item };
      } else {
        item.id = kind.slice(0, 3) + Date.now();
        arr.push(item);
      }
      persistLocal({ [sp.key]: arr });
    }
    setBusy(false);
    setModal(null);
    showToast('با موفقیت ذخیره شد ✓');
  }

  async function delEntity(kind, id) {
    const sp = SPEC[kind];
    if (!window.confirm('این مورد حذف شود؟')) return;
    if (mode === 'cloud' && user) {
      await apiCall('DELETE', sp.key, { id });
      await loadRemote();
    } else {
      persistLocal({ [sp.key]: (db[sp.key] || []).filter(x => x.id !== id) });
    }
    showToast('حذف شد');
  }

  async function setBookingStatus(id, status) {
    if (mode === 'cloud' && user) {
      await apiCall('PATCH', 'bookings', { row: { id, status } });
      await loadRemote();
    } else {
      persistLocal({ bookings: (db.bookings || []).map(b => b.id === id ? { ...b, status } : b) });
    }
    showToast('وضعیت به‌روزرسانی شد');
  }

  /* ---- تنظیمات + آپلود تصویر ---- */
  async function saveSettings(e) {
    e.preventDefault();
    const vals = {};
    e.target.querySelectorAll('[name]').forEach(inp => { vals[inp.name] = inp.value.trim(); });
    if (mode === 'cloud' && user) {
      const rows = Object.keys(vals).map(k => ({ key: k, value: vals[k] }));
      await apiCall('POST', 'settings', { rows });
      showToast('تنظیمات در سوپابیس ذخیره شد ✓');
    } else {
      persistLocal({ settings: { ...db.settings, ...vals } });
      showToast('تنظیمات محلی ذخیره شد ✓');
    }
  }

  async function uploadImage(key, file) {
    if (!supabaseOn) { showToast('آپلود فقط در حالت ابری (سوپابیس) فعال است؛ در حالت آزمایشی لینک تصویر را دستی وارد کنید.'); return; }
    try {
      const sb = createClient();
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = 'admin/' + key.toLowerCase() + '-' + Date.now() + '.' + ext;
      const { error } = await sb.storage.from('site-images').upload(path, file, { upsert: false });
      if (error) { showToast('آپلود ناموفق: ' + error.message); return; }
      const { data } = sb.storage.from('site-images').getPublicUrl(path);
      const url = data && data.publicUrl;
      if (mode === 'cloud' && user) {
        await apiCall('POST', 'settings', { rows: [{ key: 'IMAGES_' + key, value: url }] });
        await loadRemote();
        showToast('تصویر آپلود و تنظیم شد ✓');
      }
    } catch (e) { showToast('خطا در آپلود: ' + e.message); }
  }

  function persistLocal(patch) {
    const next = { ...db, ...patch };
    setDb(next);
    try { localStorage.setItem('fazel_db_v1', JSON.stringify(next)); } catch (e) {}
  }

  const S = (key) => (db.settings || {})[key] ?? '';

  /* ================= رندر ================= */
  if (supabaseOn && !user) {
    return (
      <>
        <div className="card admin-login">
          <h2 className="center" style={{ marginBottom: 8 }}>⚙️ پنل مدیریت</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', textAlign: 'center', marginBottom: 20 }}>
            ورود با حساب ادمین سوپابیس — کاربر ادمین را در Authentication → Users سوپابیس بسازید (راهنما در docs/SETUP.md).
          </p>
          <form onSubmit={login} noValidate>
            <div className="field"><label>ایمیل ادمین</label><input name="email" type="email" style={{ direction: 'ltr', textAlign: 'start' }} /></div>
            <div className="field" style={{ marginTop: 10 }}><label>رمز عبور</label><input name="password" type="password" style={{ direction: 'ltr', textAlign: 'start' }} /></div>
            <p className="form-err">{err}</p>
            <button className="btn btn-primary btn-block" style={{ marginTop: 8 }} type="submit" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود به پنل'}</button>
          </form>
        </div>
        {toast && <div className="toastbox">{toast}</div>}
      </>
    );
  }

  if (!supabaseOn) {
    return (
      <>
        <div className="info-box blue" style={{ marginBottom: 18 }}>
          💾 حالت آزمایشی: سوپابیس تنظیم نشده است. با تنظیم متغیرهای <b>NEXT_PUBLIC_SUPABASE_URL</b> و <b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b> و <b>SUPABASE_SERVICE_ROLE_KEY</b>، پنل به دیتابیس ابری وصل می‌شود.
        </div>
        <AdminTabs db={db} tab={tab} setTab={setTab} S={S} SPEC={SPEC} SETTING_GROUPS={SETTING_GROUPS} IMAGE_KEYS={IMAGE_KEYS}
          mode={mode} user={user} supabaseOn={supabaseOn}
          onAdd={(kind) => setModal({ kind, id: '' })}
          onEdit={(kind, id) => setModal({ kind, id })}
          onDel={delEntity} onBkStatus={setBookingStatus} onSaveSettings={saveSettings}
          onUpload={uploadImage} logout={logout} busy={busy}
          setDb={setDb} persistLocal={persistLocal} />
        {modal && <EntityModal kind={modal.kind} id={modal.id} db={db} onClose={() => setModal(null)} onSave={saveEntity} />}
        {toast && <div className="toastbox">{toast}</div>}
      </>
    );
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h2>⚙️ پنل مدیریت</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem' }}>
            ☁️ اتصال ابری فعال — {user && user.email} | تغییرات مستقیم در سوپابیس ذخیره می‌شود و حداکثر تا ۶۰ ثانیه در سایت اعمال می‌گردد.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="btn btn-ghost btn-sm" href="/">مشاهده سایت</Link>
          <button className="btn btn-danger btn-sm" onClick={logout}>خروج</button>
        </div>
      </div>
      <AdminTabs db={db} tab={tab} setTab={setTab} S={S} SPEC={SPEC} SETTING_GROUPS={SETTING_GROUPS} IMAGE_KEYS={IMAGE_KEYS}
        mode={mode} user={user} supabaseOn={supabaseOn}
        onAdd={(kind) => setModal({ kind, id: '' })}
        onEdit={(kind, id) => setModal({ kind, id })}
        onDel={delEntity} onBkStatus={setBookingStatus} onSaveSettings={saveSettings}
        onUpload={uploadImage} logout={logout} busy={busy} setDb={setDb} persistLocal={persistLocal} />
      {modal && <EntityModal kind={modal.kind} id={modal.id} db={db} onClose={() => setModal(null)} onSave={saveEntity} />}
      {toast && <div className="toastbox">{toast}</div>}
    </>
  );
}

/* ---------------- تب‌ها ---------------- */
function AdminTabs({ db, tab, setTab, S, SPEC, SETTING_GROUPS, IMAGE_KEYS, mode, user, supabaseOn, onAdd, onEdit, onDel, onBkStatus, onSaveSettings, onUpload, logout, busy, setDb, persistLocal }) {
  const TABS = [
    ['dash', '📊 داشبورد'], ['sessions', '🕐 سانس‌ها'], ['cats', '🎯 دسته‌بندی‌ها'], ['tariffs', '💰 تعرفه‌ها'],
    ['bookings', '🧾 رزروها'], ['posts', '📰 بلاگ'], ['testimonials', '💬 نظرات'], ['settings', '⚙️ تنظیمات']
  ];
  let body = '';
  if (tab === 'dash') {
    const pend = (db.bookings || []).filter(b => b.status === 'pending').length;
    body = (
      <>
        <div className="dash-cards">
          <div className="dash-card"><div className="dv">{faNum((db.sessions || []).length)}</div><div className="dl">سانس تعریف‌شده</div></div>
          <div className="dash-card"><div className="dv">{faNum((db.categories || []).length)}</div><div className="dl">دسته‌بندی</div></div>
          <div className="dash-card"><div className="dv">{faNum(pend)}</div><div className="dl">رزرو در انتظار</div></div>
          <div className="dash-card"><div className="dv">{faNum((db.posts || []).length)}</div><div className="dl">مطلب بلاگ</div></div>
        </div>
        <div className="h2-bar"><h3 style={{ fontSize: '1.05rem' }}>آخرین رزروها</h3></div>
        <BookingsTable rows={(db.bookings || []).slice(-5).reverse()} onStatus={onBkStatus} />
      </>
    );
  } else if (tab === 'bookings') {
    body = <BookingsTable rows={(db.bookings || []).slice().reverse()} onStatus={onBkStatus} full />;
  } else if (tab === 'settings') {
    body = (
      <form onSubmit={onSaveSettings} noValidate>
        <div className="info-box">📌 مقادیر این جدول روی متغیرهای محیطی اولویت دارند؛ مقدار خالی یعنی استفاده از متغیر محیطی.</div>
        {SETTING_GROUPS.map(([group, keys]) => (
          <div key={group}>
            <div className="h2-bar" style={{ marginTop: 20 }}><h3 style={{ fontSize: '1rem' }}>{group}</h3></div>
            <div className="form-grid">
              {keys.filter(k => ![...SETTING_GROUPS[1][1], ...SETTING_GROUPS[4][1]].slice(0, keys.length).includes(k) || true).map(k => (
                <div className="field" key={k}>
                  <label>{k}</label>
                  {IMAGE_KEYS.includes(k)
                    ? <ImageField k={k} value={S(k)} onUpload={onUpload} />
                    : <input name={k} defaultValue={S(k)} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 20 }} type="submit" disabled={busy}>ذخیره تنظیمات</button>
      </form>
    );
  } else if (SPEC[tab] || tab === 'cats') {
    const kind = tab === 'cats' ? 'cats' : tab;
    const sp = SPEC[kind];
    const rows = db[sp.key] || [];
    body = (
      <>
        <div className="admin-actions">
          <button className="btn btn-primary btn-sm" onClick={() => onAdd(kind)}>+ افزودن {sp.label}</button>
          <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>تعداد: {faNum(rows.length)}</span>
        </div>
        <div className="tbl-wrap" style={{ marginTop: 12 }}>
          <table>
            <thead><tr>{sp.cols.map(([h]) => <th key={h}>{h}</th>).concat(<th key="op">عملیات</th>)}</tr></thead>
            <tbody>
              {rows.length ? rows.map(r => (
                <tr key={r.id}>
                  {sp.cols.map(([, fn], i) => <td key={i}>{fn(r)}</td>)}
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => onEdit(kind, r.id)}>ویرایش</button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDel(kind, r.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={sp.cols.length + 1}>موردی ثبت نشده است.</td></tr>}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="admin-head">
        <div>
          <h2>⚙️ پنل مدیریت</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem' }}>{supabaseOn ? '☁️ حالت ابری — سوپابیس' : '💾 حالت آزمایشی — مرورگر'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="btn btn-ghost btn-sm" href="/">مشاهده سایت</Link>
          <button className="btn btn-danger btn-sm" onClick={logout}>خروج</button>
        </div>
      </div>
      <div className="admin-tabs">
        {TABS.map(([k, label]) => <button key={k} className={'tab' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{label}</button>)}
      </div>
      {body}
    </>
  );
}

/* ---------------- فیلد تصویر: آپلود + لینک ---------------- */
function ImageField({ k, value, onUpload }) {
  return (
    <>
      <input name={'IMAGES_' + k} defaultValue={value || ''} placeholder="لینک تصویر یا آپلود کنید" style={{ marginBottom: 6 }} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label className="btn btn-ghost btn-sm" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
          📂 آپلود
          <input type="file" accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            onChange={e => { if (e.target.files && e.target.files[0]) onUpload(k, e.target.files[0]); }} />
        </label>
        {value && <img src={value} alt="پیش‌نمایش" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8 }} />}
      </div>
    </>
  );
}

/* ---------------- جدول رزروها ---------------- */
function BookingsTable({ rows, onStatus, full }) {
  if (!rows.length) return <div className="info-box blue">هنوز رزروی ثبت نشده است.</div>;
  return (
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>کد</th><th>رزروکننده</th><th>دسته / سانس</th><th>نفرات</th><th>مبلغ (تومان)</th><th>وضعیت</th><th>عملیات</th></tr></thead>
        <tbody>
          {rows.map(b => {
            const st = BK_STATUS[b.status] || [b.status, 'badge-off'];
            return (
              <tr key={b.id}>
                <td style={{ direction: 'ltr' }}>{b.id}</td>
                <td>{b.name}<br /><span style={{ color: 'var(--muted)', fontSize: '.76rem', direction: 'ltr' }}>{faNum(b.phone)}</span></td>
                <td>{b.categoryName}<br /><span style={{ color: 'var(--muted)', fontSize: '.76rem' }}>{DAY_NAMES[+b.day]} {faTime(b.start)} تا {faTime(b.end)}</span></td>
                <td>{faNum(b.count)}</td>
                <td>{money(b.amount)}</td>
                <td><span className={'badge ' + st[1]}>{st[0]}</span></td>
                <td>
                  <div className="admin-actions">
                    {(b.status === 'pending' || b.status === 'failed') && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => onStatus(b.id, 'paid-manual')}>حضوری</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => onStatus(b.id, 'canceled')}>لغو</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- مودال ویرایش ---------------- */
function fieldHTML(f, item) {
  const v = item[f.k] != null ? item[f.k] : '';
  if (f.t === 'check') return (
    <div className="field full" key={f.k}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', flexDirection: 'row' }}>
        <input type="checkbox" name={f.k} defaultChecked={v} style={{ width: 'auto' }} /> فعال باشد (در سایت نمایش داده شود)
      </label>
    </div>
  );
  if (f.t === 'select') {
    const opts = typeof f.opts === 'function' ? f.opts() : f.opts;
    return (
      <div className="field" key={f.k}>
        <label>{f.l}</label>
        <select name={f.k} defaultValue={String(v)}>
          {opts.map(o => { const val = typeof o === 'object' ? o.v : o, lab = typeof o === 'object' ? o.t : o; return <option key={String(val)} value={String(val)}>{lab}</option>; })}
        </select>
      </div>
    );
  }
  if (f.t === 'textarea') return <div className="field full" key={f.k}><label>{f.l}</label><textarea name={f.k} defaultValue={v} /></div>;
  if (f.t === 'number') return <div className="field" key={f.k}><label>{f.l}</label><input type="number" name={f.k} defaultValue={v} min="0" /></div>;
  if (f.t === 'time') return <div className="field" key={f.k}><label>{f.l}</label><input type="time" name={f.k} defaultValue={v} /></div>;
  if (f.t === 'image') return <div className="field full" key={f.k}><label>{f.l}</label><input name={f.k} defaultValue={v} placeholder="لینک تصویر (آپلود از تب تنظیمات)" /></div>;
  return <div className="field" key={f.k}><label>{f.l}</label><input name={f.k} defaultValue={v} /></div>;
}

function EntityModal({ kind, id, db, onClose, onSave }) {
  const sp = SPEC[kind];
  const item = useMemo(() => {
    if (id) return (db[sp.key] || []).find(x => x.id === id) || {};
    return kind === 'posts' ? { date: faDate() } : {};
  }, [kind, id, db]);
  const submit = (e) => { e.preventDefault(); onSave(kind, e.target); };
  return (
    <div className="modal-back open">
      <div className="modal">
        <h3>{id ? 'ویرایش ' : 'افزودن '}{sp.label}</h3>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">{sp.fields.map(f => fieldHTML(f, item))}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" type="submit">ذخیره</button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onClose}>انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}
