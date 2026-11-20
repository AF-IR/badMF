import { SITE } from '@/lib/config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/payment', '/api/']
      }
    ],
    sitemap: SITE.url + '/sitemap.xml'
  };
}
