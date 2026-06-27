"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { removeCartItem } from "@/redux/features/cartSlice";
import UseCartInfo from "@/hooks/UseCartInfo";
import { buildProductDetailHref } from "@/lib/productLinks";

const HeaderCart = () => {
  const items = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch();
  const { total } = UseCartInfo();

  return (
    <div className="minicart">
      {items.length === 0 ? (
        <div className="empty_bag text-center">
          <p className="py-3">Giỏ hàng đang trống</p>
          <Link href="/dat-tee-time" className="swiftcart-btn-black swiftcart-btn-black-large">
            Xem dịch vụ
          </Link>
        </div>
      ) : (
        <>
          {items.slice(0, 4).map((item) => {
            const href = item.cmsProduct
              ? buildProductDetailHref(item.cmsProduct)
              : item.slug
                ? `/cua-hang/${item.slug}`
                : "/gio-hang";

            return (
              <div key={item.id} className="cart-content-wrap d-flex align-items-center justify-content-between">
                <div className="cart-img-info d-flex align-items-center">
                  {item.thumb && (
                    <div className="cart-thumb">
                      <Link href={href}>
                        <Image src={item.thumb} width={70} height={70} alt={item.title} />
                      </Link>
                    </div>
                  )}
                  <div className="cart-content">
                    <h5 className="cart-title"><Link href={href}>{item.title}</Link></h5>
                    <span>{item.price.toLocaleString("vi-VN")} đ × {item.quantity}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeCartItem(item))}
                  className="cart-del-icon"
                  aria-label={`Xoá ${item.title}`}
                >
                  <i className="fa-light fa-trash-can"></i>
                </button>
              </div>
            );
          })}
          <div className="cart-total-price d-flex align-items-center justify-content-between">
            <span>Tổng:</span>
            <span>{total.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="minicart-btn">
            <Link className="cart-btn cart-btn-black" href="/gio-hang"><span>Xem giỏ hàng</span></Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderCart;
