"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { addToCart } from "@/redux/features/cartSlice";
import type { Product, ProductCategory } from "@/types/product";
import type { ProductListMeta } from "@/services/product.service";
import { buildProductDetailHref } from "@/lib/productLinks";
import ShopSidebar from "./ShopSidebar";
import ShopTop from "./ShopTop";

const formatVnd = (value?: string | number | null) => {
  const amount = Number(value || 0);
  return amount > 0 ? `${amount.toLocaleString("vi-VN")} ₫` : "Liên hệ";
};

const productPrice = (item: Product) => Number(item.sale_price || item.regular_price || item.price_discount || item.price || 0);

const ShopArea = ({ products = [], categories = [], meta }: { products?: Product[]; categories?: ProductCategory[]; meta?: ProductListMeta }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const currentPage = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;
  const totalItems = meta?.total || products.length;
  const startOffset = totalItems ? ((currentPage - 1) * (meta?.per_page || products.length)) + 1 : 0;
  const endOffset = Math.min(startOffset + products.length - 1, totalItems);
  const pageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    return params.toString() ? `/cua-hang?${params.toString()}` : "/cua-hang";
  };

  return (
    <div className="tg-shop-area pt-130 pb-80">
      <div className="container">
        <div className="row">
          <ShopSidebar categories={categories} />
          <div className="col-xl-9 col-lg-8">
            <div className="tg-shop-product-wrap mb-50">
              <ShopTop startOffset={startOffset} endOffset={endOffset} totalItems={totalItems} />
              <div className="row">
                {products.length === 0 && <div className="col-12"><p>Hiện chưa có sản phẩm phù hợp.</p></div>}
                {products.map((item) => (
                  <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                    <div className="tg-shop-product-item mb-25">
                      <div className="tg-shop-product-thumb mb-15 fix p-relative">
                        <Link href={buildProductDetailHref(item)}><Image className="w-100" src={item.image_url || "/assets/img/breadcrumb/breadcrumb.jpg"} alt={item.name} width={360} height={360} /></Link>
                        <div className="tg-shop-product-btn">
                          <button
                            type="button"
                            onClick={() => dispatch(addToCart({
                              id: item.id,
                              title: item.name,
                              slug: item.slug,
                              price: productPrice(item),
                              quantity: 1,
                              thumb: item.image_url || undefined,
                              cmsProduct: item,
                            }))}
                            className="wishlist"
                            aria-label="Thêm vào giỏ"
                          >
                            <i className="fa-regular fa-cart-shopping"></i>
                          </button>
                        </div>
                      </div>
                      <div className="tg-shop-product-content">
                        <h3 className="tg-shop-product-title"><Link href={buildProductDetailHref(item)}>{item.name}</Link></h3>
                        {item.rating && <div className="tg-shop-product-ratings"><span>{item.rating}</span></div>}
                        <span className="price">{formatVnd(item.sale_price || item.regular_price || item.price_discount || item.price)}</span>
                        {item.sale_price && item.regular_price && <span className="old-price ml-10"><del>{formatVnd(item.regular_price)}</del></span>}
                        {item.stock_status === "out_of_stock" && <p className="mb-0 text-danger">Tạm hết hàng</p>}
                      </div>
                    </div>
                  </div>
                ))}
                {lastPage > 1 && (
                  <div className="col-12">
                    <div className="tg-pagenation-wrap text-center pt-35 mb-30">
                      <nav>
                        <ul>
                          <li>{currentPage > 1 ? <Link className="p-btn" href={pageHref(currentPage - 1)}>Trang trước</Link> : <span className="p-btn disabled">Trang trước</span>}</li>
                          {Array.from({ length: lastPage }, (_, index) => index + 1).map((page) => (
                            <li key={page}><Link className={page === currentPage ? "active" : ""} href={pageHref(page)}>{page}</Link></li>
                          ))}
                          <li>{currentPage < lastPage ? <Link className="p-btn" href={pageHref(currentPage + 1)}>Trang sau</Link> : <span className="p-btn disabled">Trang sau</span>}</li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopArea;
