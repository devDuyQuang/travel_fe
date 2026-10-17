'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { safeEditorialImage } from './contentData';
import styles from './ServiceContent.module.css';

export default function EditorialMedia({ images }: { images: string[]; captions?: string[] }) {
  const [index, setIndex] = useState(-1);
  // Keep the original sources; captions remain in CMS/props without public rendering.
  const sources = [...new Set(images.map(safeEditorialImage).filter((src): src is string => Boolean(src)))];
  if (!sources.length) return null;
  return <>
    <div className={styles.editorialGallery} role="group" aria-label="Hình ảnh nội dung dịch vụ">
      {sources.map((src, i) => <button type="button" key={src} onClick={() => setIndex(i)} aria-label={`Xem ảnh nội dung ${i + 1} ở kích thước lớn`}>
        <Image src={src} alt={`Ảnh nội dung dịch vụ ${i + 1}`} width={320} height={200} unoptimized />
      </button>)}
    </div>
    <Lightbox open={index >= 0} index={Math.max(0, index)} close={() => setIndex(-1)} slides={sources.map((src, i) => ({ src, alt: `Ảnh nội dung dịch vụ ${i + 1}` }))} controller={{ closeOnBackdropClick: true }} />
  </>;
}
