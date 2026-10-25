"use client";

import Image from 'next/image';
import { useState } from 'react';
import { safeEditorialImage } from './contentData';

export const CONTENT_PLACEHOLDER = '/assets/img/service-placeholder.svg';

/** Content cards only: keep an unavailable CMS image from becoming a broken image. */
export default function ContentImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const source = safeEditorialImage(src || '') || CONTENT_PLACEHOLDER;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <Image src={failedSource === source ? CONTENT_PLACEHOLDER : source} alt={failedSource === source || source === CONTENT_PLACEHOLDER ? 'GOLFNITY — chưa có ảnh được xác minh' : alt} className={className} width={360} height={270} unoptimized onError={() => setFailedSource(source)} />;
}
