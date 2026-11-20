import { SITE } from '@/lib/config';
import { DEFAULT_DB } from '@/lib/data';

export default function sitemap() {
  const now = new Date();
  const pages = [
    ['/', 1.0, 'weekly'],
    ['/club', 0.9, 'weekly'],
    ['/booking', 0.9, 'weekly'],
    ['/restaurant', 0.8, 'monthly'],
    ['/blog', 0.7, 'weekly'],
    ['/about', 0.6, 'monthly']
  ].map(([path, priority, changeFrequency]) => ({
    url: SITE.url + (path === '/' ? '/' : path),
    lastModified: now,
    changeFrequency,
    priority
  }));
  const posts = (DEFAULT_DB.posts || []).map(p => ({
    url: `${SITE.url}/blog/${p.slug || p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  }));
  return [...pages, ...posts];
}
