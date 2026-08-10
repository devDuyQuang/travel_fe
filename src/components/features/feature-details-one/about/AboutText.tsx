import type { Product } from "@/types/product";
import { resolveProductBookingType } from "@/lib/servicePrice";
import { resolveMediaUrl } from "@/services/post.service";

const INTERNAL_COPY_PATTERN = /(demo|cms|seed|internal|dữ liệu demo|tee time trong cms)/i;

function customerText(value?: string | null) {
   if (!value || INTERNAL_COPY_PATTERN.test(value)) {
      return "";
   }

   return value.trim();
}

function splitHtmlBlocks(value?: string | null) {
   const html = customerText(value);

   if (!html) return [];

   const paragraphMatches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi);

   if (paragraphMatches?.length) {
      return paragraphMatches
         .map((block) => block.trim())
         .filter((block) => block && !INTERNAL_COPY_PATTERN.test(block));
   }

   return [html];
}

function splitFirstHtmlBlocks(...values: unknown[]) {
   for (const value of values) {
      if (typeof value !== "string") continue;

      const blocks = splitHtmlBlocks(value);

      if (blocks.length > 0) {
         return blocks;
      }
   }

   return [];
}

function recordValue(value: unknown): Record<string, unknown> {
   return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
}

function textArray(value: unknown) {
   if (!Array.isArray(value)) return [];

   return value
      .map((item) => (typeof item === "string" ? customerText(item) : ""))
      .filter(Boolean);
}

function firstTextArray(...values: unknown[]) {
   for (const value of values) {
      const items = textArray(value);

      if (items.length > 0) {
         return items;
      }
   }

   return [];
}

function galleryMedia(product: Product | null) {
   const gallery = Array.isArray(product?.gallery) ? product.gallery : [];
   const images = gallery.length > 0 ? gallery : product?.image_url ? [product.image_url] : [];

   return images
      .map((item) => resolveMediaUrl(item))
      .filter((item): item is string => Boolean(item))
      .slice(0, 3);
}

function packageDetails(product: Product | null) {
   const option = product?.service_options?.find((item) => item?.is_active !== false && item?.metadata);
   const metadata = recordValue(option?.metadata);

   return recordValue(metadata.package_details);
}

function editorialCaptions(product: Product | null) {
   const attributes = recordValue(product?.attributes);
   const metadata = recordValue(product?.metadata);
   const details = packageDetails(product);

   return firstTextArray(
      attributes.editorial_gallery_captions,
      attributes.gallery_captions,
      metadata.editorial_gallery_captions,
      details.gallery_captions
   );
}

function editorialDressCode(product: Product | null) {
   const attributes = recordValue(product?.attributes);
   const metadata = recordValue(product?.metadata);
   const details = packageDetails(product);
   const bookingNotes = recordValue(details.bookingNotes || details.booking_notes);

   return firstTextArray(
      attributes.editorial_dress_code,
      attributes.dress_code,
      metadata.editorial_dress_code,
      details.dress_code,
      bookingNotes.dressCode,
      bookingNotes.dress_code
   );
}

const AboutText = ({ product }: { product: Product | null }) => {
   const bookingType = resolveProductBookingType(product);
   const isTeeTime = bookingType === "tee_time";

   if (isTeeTime) {
      const attributes = recordValue(product?.attributes);
      const metadata = recordValue(product?.metadata);
      const descriptionBlocks = splitFirstHtmlBlocks(
         attributes.editorial_description,
         attributes.long_description,
         metadata.editorial_description,
         metadata.long_description,
         product?.content,
         product?.short_description
      );
      const media = galleryMedia(product);
      const captions = editorialCaptions(product);
      const dressCode = editorialDressCode(product);

      return (
         <>
            <section
               id="ve-dich-vu-nay"
               className="tg-tour-about-inner mb-40 tee-time-scroll-section tee-time-about-editorial"
               tabIndex={-1}
            >
               <h4 className="tg-tour-about-title mb-20">Về dịch vụ này</h4>
               <div className="tee-time-about-editorial__body">
                  {descriptionBlocks.length > 0 && (
                     <div className="tee-time-rich-content">
                        {descriptionBlocks.map((block, index) => (
                           <div
                              key={`${index}-${block.slice(0, 24)}`}
                              dangerouslySetInnerHTML={{ __html: block }}
                           />
                        ))}
                     </div>
                  )}
               </div>
               {media.map((image, index) => (
                  <figure className="tee-time-about-media" key={image}>
                     <img src={image} alt={`${product?.name || "Dịch vụ golf"} ${index + 1}`} />
                     {captions[index] && <figcaption>{captions[index]}</figcaption>}
                  </figure>
               ))}
            </section>

            {dressCode.length > 0 && (
               <section
                  id="nhung-dieu-can-luu-y"
                  className="tg-tour-about-inner mb-40 tee-time-scroll-section tee-time-notes-editorial"
                  tabIndex={-1}
               >
                  <h4 className="tg-tour-about-title mb-20">Những điều cần lưu ý</h4>
                  <h5>Nên mặc gì:</h5>
                  <ul>
                     {dressCode.map((item) => (
                        <li key={item}>{item}</li>
                     ))}
                  </ul>
               </section>
            )}
         </>
      );
   }

   return (
      <>
         <div className="tg-tour-about-inner mb-25">
            <h4 className="tg-tour-about-title mb-15">About This Tour</h4>
            {product?.short_description ? (
               <p className="text-capitalize lh-28">{product.short_description}</p>
            ) : (
               <p className="text-capitalize lh-28">isiting Stonehenge, Bath, and Windsor Castle in one day is next to impossible. Designed specifically for
               lers with limited time in London, this tour allows you to check off a range of southern England‘s are l
               attractions in just one day by eliminating the hassle of traveling between each one independently. Travel
               by comfortable coach and witness your guide bring each.</p>
            )}
            {product?.content && (
               <div dangerouslySetInnerHTML={{ __html: product.content }} />
            )}
         </div>
         <div className="tg-tour-about-inner mb-40">
            <h4 className="tg-tour-about-title mb-20">Trip Highlights</h4>
            <div className="tg-tour-about-list">
               {product?.highlights ? (
                  <div dangerouslySetInnerHTML={{ __html: product.highlights }} />
               ) : <ul>
                  <li>
                     <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                     <span className="text">Tour the city with a licensed NYC tour guide, who</span>
                  </li>
                  <li>
                     <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                     <span className="text">Explore with a guide to delve deeper into the history</span>
                  </li>
                  <li>
                     <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                     <span className="text">Great for history buffs and travelers with limited time</span>
                  </li>
               </ul>}
            </div>
            {product?.facilities && (
               <div className="mt-25" dangerouslySetInnerHTML={{ __html: product.facilities }} />
            )}
         </div>
      </>
   )
}

export default AboutText
