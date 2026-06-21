import type { Product } from "@/types/product";

type AboutTextProps = {
  product: Product | null;
};

const AboutText = ({ product }: AboutTextProps) => {
  return (
    <>
      {product?.highlights && (
        <div className="golf-highlight-box">
          <div className="golf-highlight-line"></div>
          <p>{product.highlights}</p>
        </div>
      )}

      {product?.attributes?.golf_information && (
        <div
          className="tg-tour-about-inner mb-40 golf-information-content"
          dangerouslySetInnerHTML={{ __html: String(product.attributes.golf_information) }}
        />
      )}

      {(product?.content || product?.short_description) && (
        <div className="tg-tour-about-inner mb-25 golf-description-content">
          <h4 className="tg-tour-about-title mb-15">Mô Tả Sân Golf</h4>
          <div
            className="golf-content"
            dangerouslySetInnerHTML={{
              __html: product?.content || "",
            }}
          />
        </div>
      )}
    </>
  );
};

export default AboutText;
