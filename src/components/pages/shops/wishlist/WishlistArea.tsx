'use client'
import Link from "next/link"
import Image from "next/image"
import type { StaticImageData } from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from '@/redux/features/cartSlice';
import UseWishlistInfo from '@/hooks/UseWishlistInfo';
import { removeFromWishlist } from "@/redux/features/wishlistSlice";
import type { Product } from "@/redux/features/wishlistSlice";
import { buildProductDetailHref } from "@/lib/productLinks";
import { formatCurrencyVnd } from "@/lib/servicePrice";

type WishlistImage = string | StaticImageData;

const normalizeWishlistImage = (thumb: Product["thumb"]): WishlistImage | null => {
  if (typeof thumb === "string") {
    const trimmed = thumb.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (thumb && typeof thumb.src === "string" && thumb.src.trim().length > 0) {
    return thumb;
  }

  return null;
};

const WishlistArea = () => {
  const { wishlistItems } = UseWishlistInfo();
  const dispatch = useDispatch();

  return (
    <div className="cart-area pb-100 pt-105">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {wishlistItems.length === 0 ? (
              <div className="mb-30">
                <div className="empty_bag text-center">
                  <p className="py-3">Your Wishlist is Empty</p>
                  <Link href={"/shop"} className="tg-btn">
                    Go To Shop
                  </Link>
                </div>
              </div>
            ) : (
              <form onClick={(e) => e.preventDefault()}>
                <div className="row gutter-y-30 gx-5">
                  <div className="tg-cart-table-content table-responsive mb-30">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th className="price">Price</th>
                          <th className="product-quantity">Add to Cart</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistItems.map((item, i) => {
                          const detailHref = item.cmsProduct
                            ? buildProductDetailHref(item.cmsProduct)
                            : "/shop-details";
                          const thumb = normalizeWishlistImage(item.thumb);

                          return (
                          <tr key={i}>
                            <td className="product-thumbnail">
                              <Link className="thumb" href={detailHref}>
                                {thumb ? (
                                  <Image src={thumb} alt="" width={100} height={100} />
                                ) : (
                                  <span aria-hidden="true" />
                                )}
                              </Link>
                              <Link className="texts" href={detailHref}>{item.title}</Link>
                            </td>
                            <td className="product-price2">
                              <span className="amount">{formatCurrencyVnd(item.price)}</span>
                            </td>
                            <td className="product-add-to-cart">
                              <button onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))} className="tg-btn">Add To Cart</button>
                            </td>
                            <td className="product-remove">
                              <a onClick={() => dispatch(removeFromWishlist(item))} style={{ cursor: "pointer" }}><i className="fa fa-times"></i></a>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistArea
