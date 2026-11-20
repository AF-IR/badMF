/* صفحه ادمین — پوسته سرور + پنل کلاینت */
import AdminPanel from '@/components/AdminPanel';
import { hasSupabase } from '@/lib/supabase/browser';

export const metadata = {
  title: 'پنل مدیریت',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  const on = hasSupabase();
  return (
    <main>
      <section className="section">
        <div className="admin-wrap">
          <AdminPanel supabaseOn={on} />
        </div>
      </section>
    </main>
  );
}
