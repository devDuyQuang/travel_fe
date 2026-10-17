import { stripHtml } from '@/lib/blog';
import prose from '@/components/features/feature-details-one/about/AboutText.module.css';
import styles from './ServiceContent.module.css';

export default function CompactDescription({ html }: { html: string }) {
  if (!html) return null;
  const text = stripHtml(html.replace(/<h[23]\b[^>]*>[\s\S]*?<\/h[23]>/gi, ' '));
  return <details className={styles.description}>
    <summary>
      <span className={styles.preview}>{text.length > 280 ? `${text.slice(0, 277).trimEnd()}…` : text}</span>
      <span className={styles.more}>Xem thêm <span aria-hidden="true">＋</span></span>
      <span className={styles.less}>Thu gọn <span aria-hidden="true">−</span></span>
    </summary>
    <div className={`tee-time-rich-content ${prose.description} ${styles.fullContent}`} dangerouslySetInnerHTML={{ __html: html }} />
  </details>;
}
