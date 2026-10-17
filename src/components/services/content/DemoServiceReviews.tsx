import { demoServiceReviews } from './contentData';
import SectionHeading from './SectionHeading';
import styles from './ServiceContent.module.css';

export default function DemoServiceReviews() {
  // The public API has no confirmed review-authenticity contract. Do not infer
  // authenticity from product.rating, review_count or arbitrary metadata flags.
  return <section className={`${styles.reviews} mb-40`} aria-labelledby="demo-service-reviews-heading">
    <SectionHeading id="demo-service-reviews-heading">Đánh giá</SectionHeading>
    <div className={styles.reviewGrid}>{demoServiceReviews.map(review => <article className={styles.reviewCard} key={review.author}>
      <h3>{review.author}</h3><p>{review.text}</p><small>Nội dung mẫu · không phải đánh giá thật</small>
    </article>)}</div>
  </section>;
}
