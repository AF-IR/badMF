/* ابزارهای مشترک (سمت سرور و کلاینت) */
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export function safeUrl(u) {
  u = String(u || '').trim();
  return /^(https?:\/\/|data:image\/)/i.test(u) ? u : '';
}
export function faNum(n) {
  try { return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]); } catch (e) { return String(n); }
}
export function money(n) {
  n = Number(n) || 0;
  try { return n.toLocaleString('fa-IR'); } catch (e) { return faNum(n.toLocaleString('en-US')); }
}
export function faTime(t) {
  t = String(t || '');
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const p = t.split(':');
    return faNum(String(+p[0]).padStart(2, '0') + ':' + p[1]);
  }
  return t || '—';
}
export const DAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
export function hoursBetween(start, end) {
  try {
    const [sh, sm] = String(start).split(':').map(Number);
    const [eh, em] = String(end).split(':').map(Number);
    return Math.max(1, (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0))) / 60;
  } catch (e) { return 1; }
}
export function slugify(title, id) {
  // slug خوانا برای مقالات: از عنوان + شناسه یکتا
  const map = { 'آ':'a','ا':'a','ب':'b','پ':'p','ت':'t','ث':'s','ج':'j','چ':'ch','ح':'h','خ':'kh','د':'d','ذ':'z','ر':'r','ز':'z','ژ':'zh','س':'s','ش':'sh','ص':'s','ض':'z','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'gh','ک':'k','گ':'g','ل':'l','م':'m','ن':'n','و':'v','ه':'h','ی':'y',' ': '-' };
  const base = String(title || '').split('').map(c => map[c] || (/[a-z0-9-]/i.test(c) ? c.toLowerCase() : '')).join('').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  return (base || 'post') + '-' + String(id || Date.now()).replace(/[^a-z0-9]/gi, '').slice(-6);
}
export function faDate() {
  try { return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { return ''; }
}
