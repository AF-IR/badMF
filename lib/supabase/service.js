// کلاینت سوپابیس با کلید سرویس (فقط سمت سرور — هرگز به مرورگر نمی‌رود)
// برای نوشتن امن در Route Handlers (رزرو، ادمین، دستیار)
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let adminClient = null;
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  if (!adminClient) {
    adminClient = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return adminClient;
}
export function isServiceConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
