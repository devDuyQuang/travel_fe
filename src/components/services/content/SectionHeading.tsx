import type { ReactNode } from 'react';

/** Reuse the existing detail heading/accent rules without adding section padding. */
export default function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return <div className="tee-time-detail-about" style={{ paddingTop: 0 }}>
    <h2 id={id} className="tg-tour-about-title tee-time-section-title mb-20">{children}</h2>
  </div>;
}
