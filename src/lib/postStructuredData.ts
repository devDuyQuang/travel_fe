import type { CmsPost } from '@/types/cms-post';
import { metadataBase, metadataDescription, safeMetadataImage } from '@/lib/seoMetadata';
import { getPostExcerpt } from '@/lib/blog';
import { resolveMediaUrl } from '@/services/post.service';

function dateValue(value?: string | null): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function postStructuredData(post: CmsPost) {
  const url = new URL(`/tin-tuc/${encodeURIComponent(post.slug)}`, metadataBase).href;
  const image = safeMetadataImage(resolveMediaUrl(post.image_url || post.image));
  const author = [post.author, post.creator, post.user].map(person => person?.full_name?.trim() || person?.name?.trim()).find(Boolean);
  const dateCreated = dateValue(post.created_at);
  const datePublished = dateValue(post.published_at);
  const dateModified = dateValue(post.updated_at);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: post.name,
        description: metadataDescription(post.description_seo) || getPostExcerpt(post, 155),
        ...(image ? { image: [image] } : {}),
        ...(author ? { author: { '@type': 'Person', name: author } } : {}),
        ...(dateCreated ? { dateCreated } : {}),
        // A creation timestamp is not evidence of a publication timestamp.
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: new URL('/', metadataBase).href },
          { '@type': 'ListItem', position: 2, name: 'Tin tức', item: new URL('/tin-tuc', metadataBase).href },
          { '@type': 'ListItem', position: 3, name: post.name, item: url },
        ],
      },
    ],
  };
}

export function serializePostStructuredData(post: CmsPost): string {
  return JSON.stringify(postStructuredData(post)).replace(/</g, '\\u003c');
}
