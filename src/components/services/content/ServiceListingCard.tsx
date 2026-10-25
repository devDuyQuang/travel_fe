import ContentImage from './ContentImage';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { buildProductDetailHref } from '@/lib/productLinks';
import { formatCurrencyVnd, getProductStartingPrice } from '@/lib/servicePrice';

/** Homepage Listing.tsx card markup/classes; no template badges or review figures. */
export default function ServiceListingCard({ product }: { product: Product }) {
  const href = buildProductDetailHref(product);
  const price = getProductStartingPrice(product);
  return <div className="tg-listing-card-item mb-30">
    <div className="tg-listing-card-thumb fix mb-15 p-relative">
      <Link href={href}><ContentImage className="tg-card-border w-100" src={product.image_url} alt={`Ảnh dịch vụ · ${product.name}`} /></Link>
    </div>
    <div className="tg-listing-card-content">
      <h3 className="tg-listing-card-title"><Link href={href}>{product.name}</Link></h3>
      <div className="tg-listing-card-duration-tour">
        {product.location && <span className="tg-listing-card-duration-map mb-5">
          <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
            <path d="M12.3329 6.7071C12.3329 11.2324 6.55512 15.1111 6.55512 15.1111C6.55512 15.1111 0.777344 11.2324 0.777344 6.7071C0.777344 5.16402 1.38607 3.68414 2.46962 2.59302C3.55316 1.5019 5.02276 0.888916 6.55512 0.888916C8.08748 0.888916 9.55708 1.5019 10.6406 2.59302C11.7242 3.68414 12.3329 5.16402 12.3329 6.7071Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.55512 8.64649C7.61878 8.64649 8.48105 7.7782 8.48105 6.7071C8.48105 5.636 7.61878 4.7677 6.55512 4.7677C5.49146 4.7677 4.6292 5.636 4.6292 6.7071C4.6292 7.7782 5.49146 8.64649 6.55512 8.64649Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
          </svg>{product.location}
        </span>}
        {product.duration && <span className="tg-listing-card-duration-time">{product.duration}</span>}
      </div>
    </div>
    <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
      <div className="tg-listing-card-price-wrap price-bg d-flex align-items-start justify-content-center flex-column">
        <span className="tg-listing-card-currency-amount">{price.amount ? <><span className="currency-symbol">Từ</span> {formatCurrencyVnd(price.amount)}</> : 'Liên hệ nhận báo giá'}</span>
      </div>
    </div>
    <Link className="golfnity-home-listing__cta" href={href}>{product.category?.layout_key === 'tee_time' ? 'Xem sân' : 'Xem chi tiết'}</Link>
  </div>;
}
