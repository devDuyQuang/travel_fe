import Link from 'next/link';
import ContentImage from './ContentImage';
import type { Product } from '@/types/product';
import { relatedContentProducts } from './contentData';
import SectionHeading from './SectionHeading';
import ServiceListingCard from './ServiceListingCard';
import styles from './ServiceContent.module.css';

export default function RelatedServiceContent({ product, products }: { product: Product; products: Product[] }) {
  const related = relatedContentProducts(product, products);
  // Only the existing tee-time marketplace has a confirmed location filter route.
  const destinations = new Map<string, Product>();
  [product, ...related].filter(p => p.status === 1 && p.category?.layout_key === 'tee_time' && p.location?.trim()).forEach(p => {
    if (!destinations.has(p.location!)) destinations.set(p.location!, p);
  });
  if (!related.length && !destinations.size) return null;
  return <div className={`${styles.additions} pb-40`}><div className="container">
    {related.length > 0 && <section className="mb-40" aria-labelledby="related-service-content-heading">
      <SectionHeading id="related-service-content-heading">Bạn có thể sẽ thích</SectionHeading>
      <div className={`golfnity-home-listing ${styles.cards}`}>{related.map(item => <div className={styles.cardSlot} key={item.id}><ServiceListingCard product={item} /></div>)}</div>
    </section>}
    {destinations.size > 0 && <section className="mb-20" aria-labelledby="content-destinations-heading">
      <SectionHeading id="content-destinations-heading">Khám phá điểm đến</SectionHeading>
      <p className={styles.guidance}>Khám phá theo địa điểm của các dịch vụ hiện có. Ảnh minh họa trung tính được dùng khi chưa có ảnh điểm đến được xác minh.</p>
      <div className={styles.cards}>{[...destinations.entries()].slice(0, 4).map(([location]) => {
        const slug = location.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return <Link className={`golfnity-home-location__card ${styles.destination}`} key={location} href={`/dich-vu/dat-tee-time/danh-sach?${new URLSearchParams({ location: slug })}`}>
          <span className="golfnity-home-location__thumb"><ContentImage className="w-100" alt={`Điểm đến ${location}`} /></span><span className="golfnity-home-location__title">{location}</span><span className="golfnity-home-location__eyebrow">Khám phá dịch vụ ↗</span>
        </Link>;
      })}</div>
    </section>}
  </div></div>;
}
