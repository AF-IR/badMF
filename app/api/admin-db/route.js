// Route Handler پل امن ادمین — همه عملیات نوشتن ادمین از این مسیر عبور می‌کند:
// ۱) هویت ادمین با سوپابیس Auth (کوکی سشن) تایید می‌شود
// ۲) عملیات با کلید سرویس (service role) اجرا می‌شود
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceClient } from '@/lib/supabase/service';

const TABLES = ['categories', 'tariffs', 'sessions', 'posts', 'testimonials', 'bookings', 'settings'];
const res = (data, status = 200) => NextResponse.json(data, { status });

async function requireAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data || !data.user) return null;
  return data.user;
}

export async function GET(req) {
  const user = await requireAdmin();
  if (!user) return res({ error: 'دسترسی غیرمجاز — ابتدا وارد شوید.' }, 401);
  const sb = getServiceClient();
  if (!sb) return res({ error: 'سوپابیس تنظیم نشده است (SUPABASE_SERVICE_ROLE_KEY).' }, 400);
  const { searchParams } = new URL(req.url);
  const table = String(searchParams.get('table') || '');
  if (!TABLES.includes(table)) return res({ error: 'جدول نامعتبر' }, 400);
  try {
    const { data, error } = await sb.from(table).select('*');
    if (error) return res({ error: error.message }, 500);
    return res(data);
  } catch (e) { return res({ error: e.message }, 500); }
}

export async function POST(req) {
  const user = await requireAdmin();
  if (!user) return res({ error: 'دسترسی غیرمجاز — ابتدا وارد شوید.' }, 401);
  const sb = getServiceClient();
  if (!sb) return res({ error: 'سوپابیس تنظیم نشده است.' }, 400);
  const body = await req.json().catch(() => ({}));
  const table = String(body.table || '');
  const rows = body.rows;
  if (!TABLES.includes(table) || !Array.isArray(rows)) return res({ error: 'درخواست نامعتبر' }, 400);
  if (table === 'settings') {
    // upsert ردیف‌های {key, value}
    const { error } = await sb.from('settings').upsert(rows, { onConflict: 'key' });
    if (error) return res({ error: error.message }, 500);
    return res({ ok: true });
  }
  const { error } = await sb.from(table).upsert(rows, { onConflict: 'id' });
  if (error) return res({ error: error.message }, 500);
  return res({ ok: true });
}

export async function PATCH(req) {
  const user = await requireAdmin();
  if (!user) return res({ error: 'دسترسی غیرمجاز — ابتدا وارد شوید.' }, 401);
  const sb = getServiceClient();
  if (!sb) return res({ error: 'سوپابیس تنظیم نشده است.' }, 400);
  const body = await req.json().catch(() => ({}));
  const table = String(body.table || '');
  const { id, ...patch } = body.row || {};
  if (!TABLES.includes(table) || !id) return res({ error: 'درخواست نامعتبر' }, 400);
  const { error } = await sb.from(table).update(patch).eq('id', id);
  if (error) return res({ error: error.message }, 500);
  return res({ ok: true });
}

export async function DELETE(req) {
  const user = await requireAdmin();
  if (!user) return res({ error: 'دسترسی غیرمجاز — ابتدا وارد شوید.' }, 401);
  const sb = getServiceClient();
  if (!sb) return res({ error: 'سوپابیس تنظیم نشده است.' }, 400);
  const body = await req.json().catch(() => ({}));
  const table = String(body.table || '');
  const id = String(body.id || '');
  if (!TABLES.includes(table) || !id) return res({ error: 'درخواست نامعتبر' }, 400);
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) return res({ error: error.message }, 500);
  return res({ ok: true });
}
