/* نان‌ریزه (Breadcrumb) با اسکیمای BreadcrumbList برای سئو */
import Link from 'next/link';
import JsonLd from './JsonLd';
import { SITE } from '@/lib/config';

export default function Breadcrumbs({ items }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE.url + '/' },
      ...items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: it.label,
        ...(it.href ? { item: SITE.url + it.href } : {})
      }))
    ]
  };
  return (
    <div className="crumbs">
      <Link href="/">خانه</Link>
      {items.map((it, i) => (
        <span key={i}>
          {' / '}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span>{it.label}</span>}
        </span>
      ))}
      <JsonLd data={ld} />
    </div>
  );
}
