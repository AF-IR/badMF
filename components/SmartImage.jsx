/* تصویر هوشمند — next/image با جای‌نگهدار زیبا وقتی URL نیست */
import Image from 'next/image';

export default function SmartImage({ src, alt, h = 240, priority = false, sizes = '(max-width: 680px) 100vw, 50vw', className = '' }) {
  if (src) {
    return (
      <div className={'ph-img ' + className} style={{ '--ph-h': h + 'px', position: 'relative' }}>
        <Image
          src={src}
          alt={alt || ''}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover' }}
          priority={priority}
        />
      </div>
    );
  }
  return (
    <div className={'ph ' + className} style={{ '--ph-h': h + 'px' }}>
      <span className="ph-ic">🖼️</span>
      <span className="ph-cap">{alt || 'تصویر'}</span>
    </div>
  );
}
