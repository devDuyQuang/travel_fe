"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import type { Product } from "@/types/product";

const formatVnd = (value?: string | number | null) => {
  const amount = Number(value || 0);
  return amount > 0 ? `${amount.toLocaleString("vi-VN")} ₫` : "Liên hệ";
};

const productPrice = (product: Product) =>
  Number(product.sale_price || product.regular_price || product.price_discount || product.price || 0);

const ShopProductDetailsArea = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = useMemo(() => {
    const gallery = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : [];
    return [product.image_url, ...gallery].filter(Boolean) as string[];
  }, [product.gallery, product.image_url]);
  const productImages = images.length > 0 ? images : ["/assets/img/breadcrumb/breadcrumb.jpg"];
  const isOutOfStock = product.stock_status === "out_of_stock";
  const maxQuantity = product.manage_stock ? Math.max(Number(product.stock_quantity || 0), 0) : 99;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, Math.max(maxQuantity, 1)));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addToCart({
      id: product.id,
      title: product.name,
      slug: product.slug,
      price: productPrice(product),
      quantity,
      thumb: product.image_url || undefined,
      cmsProduct: product,
    }));
  };

  return (
    <div className="tg-shop-details-area pt-130 pb-35">
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-lg-6">
            <div className="tg-product-modal-thumb-wrapper mb-40">
              <div className="tg-product-details-thumb-tab">
                <div className="tg-product-details-thumb mb-10">
                  <div className="tab-content" id="nav-tabContents">
                    {productImages.map((image, index) => (
                      <div key={`${image}-${index}`} className={`tab-pane fade ${index === currentImageIndex ? "show active" : ""}`}>
                        <Image src={image} alt={product.name} width={620} height={620} />
                      </div>
                    ))}
                  </div>
                </div>
                {productImages.length > 1 && (
                  <div className="tg-product-details-thumb-nav cm-tab mb-10">
                    <div className="nav nav-tabs d-block" role="tablist">
                      <div className="row gx-10">
                        {productImages.slice(0, 4).map((image, index) => (
                          <div key={`${image}-thumb-${index}`} className="col-3">
                            <button
                              type="button"
                              onClick={() => setCurrentImageIndex(index)}
                              className={`nav-link ${index === currentImageIndex ? "active" : ""}`}
                            >
                              <Image src={image} alt={product.name} width={140} height={140} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-7 col-lg-6">
            <div className="tg-product-details-wrapper ml-55 mr-115 mb-40">
              <h1 className="tg-product-details-title mb-10">{product.name}</h1>
              {(product.sku || product.category?.name) && (
                <div className="tg-product-details-availability mb-20">
                  {product.sku && <><span className="availability">SKU:</span> <span className="stock">{product.sku}</span></>}
                  {product.category?.name && <span className="ml-20">{product.category.name}</span>}
                </div>
              )}
              <div className="tg-product-details-price">
                <h6 className="mb-10">{formatVnd(product.sale_price || product.regular_price || product.price_discount || product.price)}</h6>
                {product.sale_price && product.regular_price && (
                  <span><del>{formatVnd(product.regular_price)}</del></span>
                )}
              </div>
              <div className="tg-product-details-availability mb-20">
                <span className="availability">Tình trạng:</span>
                <span className="stock">{isOutOfStock ? "Tạm hết hàng" : "Còn hàng"}</span>
              </div>
              {product.short_description && <p className="tg-product-details-para mb-20">{product.short_description}</p>}

              <div className="tg-product-details-quantity mb-30">
                <span className="quantity mb-5 d-inline-block">Số lượng</span>
                <div className="tg-booking-quantity-item">
                  <button type="button" onClick={decreaseQuantity} className="decrement" aria-label="Giảm số lượng">
                    <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <input className="tg-quantity-input" type="text" value={quantity} readOnly />
                  <button type="button" onClick={increaseQuantity} className="increment" aria-label="Tăng số lượng">
                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.21924 7H13.3836" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.30176 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="tg-product-details-button mb-25">
                <button type="button" onClick={handleAddToCart} disabled={isOutOfStock} className="tg-btn mb-10">
                  Thêm vào giỏ
                </button>
                <Link href="/gio-hang" className="tg-btn tg-btn-2 mb-10">Xem giỏ hàng</Link>
              </div>
            </div>
          </div>
        </div>
        {product.content && (
          <div className="row">
            <div className="col-lg-12">
              <div className="blog-details-content pb-60" dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProductDetailsArea;
