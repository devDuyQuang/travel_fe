"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addToCart, clearCart, decreaseQuantity, removeCartItem } from "@/redux/features/cartSlice";
import UseCartInfo from "@/hooks/UseCartInfo";
import { buildProductDetailHref } from "@/lib/productLinks";
import { createIdempotencyKey, createOrder } from "@/services/transaction.service";

const CartArea = () => {
  const items = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch();
  const { total } = UseCartInfo();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingWard, setShippingWard] = useState("");
  const [shippingDistrict, setShippingDistrict] = useState("");
  const [shippingProvince, setShippingProvince] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await createOrder({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address_line: shippingAddress,
        shipping_ward: shippingWard,
        shipping_district: shippingDistrict,
        shipping_province: shippingProvince,
        customer_note: customerNote,
        payment_method: paymentMethod,
        idempotency_key: createIdempotencyKey("order"),
        items: items.map((item) => ({
          product_id: Number(item.id),
          quantity: Math.max(1, Number(item.quantity || 1)),
        })),
      });

      dispatch(clearCart());
      setSuccessMessage(`Đặt hàng thành công. Mã đơn hàng: ${response.data?.order_code || ""}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không tạo được đơn hàng, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-area pb-100 pt-105">
      <div className="container">
        {items.length === 0 && !successMessage ? (
          <div className="empty_bag text-center mb-30">
            <p className="py-3">Giỏ hàng của bạn đang trống</p>
            <Link href="/cua-hang" className="tg-btn">Tiếp tục mua sắm</Link>
          </div>
        ) : items.length > 0 ? (
          <div className="row gutter-y-30 gx-5">
            <div className="tg-cart-table-content table-responsive mb-30">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="price">Đơn giá</th>
                    <th>Số lượng</th>
                    <th className="subtotal">Thành tiền</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const href = item.cmsProduct
                      ? buildProductDetailHref(item.cmsProduct)
                      : item.slug
                        ? `/${item.slug}`
                        : "#";

                    return (
                      <tr key={item.id}>
                        <td className="product-thumbnail">
                          {item.thumb && (
                            <Link className="thumb" href={href}>
                              <Image src={item.thumb} width={100} height={80} alt={item.title} />
                            </Link>
                          )}
                          <Link className="texts" href={href}>{item.title}</Link>
                        </td>
                        <td className="product-price2">
                          <span className="amount">{item.price.toLocaleString("vi-VN")} đ</span>
                        </td>
                        <td className="product-quantity">
                          <div className="tg-product-details-quantity">
                            <div className="tg-booking-quantity-item">
                              <button type="button" onClick={() => dispatch(decreaseQuantity(item))} className="decrement">−</button>
                              <input className="tg-quantity-input" value={item.quantity} readOnly />
                              <button type="button" onClick={() => dispatch(addToCart(item))} className="increment">+</button>
                            </div>
                          </div>
                        </td>
                        <td className="product-subtotal">
                          <span className="amount">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</span>
                        </td>
                        <td className="product-remove">
                          <button type="button" onClick={() => dispatch(removeCartItem(item))} aria-label={`Xoá ${item.title}`}>
                            <i className="fa fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="row justify-content-end">
              <div className="col-xl-4 col-lg-5 col-md-6">
                <div className="tg-cart-page-total mb-20">
                  <ul className="mb-20">
                    <li>Tạm tính <span>{total.toLocaleString("vi-VN")} đ</span></li>
                    <li className="borders">Phí dịch vụ <span>0 đ</span></li>
                    <li>Tổng cộng <span>{total.toLocaleString("vi-VN")} đ</span></li>
                  </ul>
                  <a href="#checkout-form" className="tg-btn w-100 text-center">Tiến hành thanh toán</a>
                  <Link href="/cua-hang" className="d-block text-center mt-15">Tiếp tục mua sắm</Link>
                </div>
              </div>
            </div>
            <div className="row justify-content-end">
              <div className="col-xl-8 col-lg-9">
                <div className="tg-cart-page-total mb-20" id="checkout-form">
                  <h4 className="mb-20">Thông tin nhận hàng</h4>
                  {successMessage && <p className="text-success">{successMessage}</p>}
                  {errorMessage && <p className="form_error">{errorMessage}</p>}
                  {items.length > 0 && (
                    <form onSubmit={handleCheckout}>
                      <div className="row">
                        <div className="col-md-6 mb-15">
                          <input className="input" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required placeholder="Họ tên" />
                        </div>
                        <div className="col-md-6 mb-15">
                          <input className="input" type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} required placeholder="Email" />
                        </div>
                        <div className="col-md-6 mb-15">
                          <input className="input" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} required placeholder="Số điện thoại" />
                        </div>
                        <div className="col-md-6 mb-15">
                          <input className="input" value={shippingProvince} onChange={(event) => setShippingProvince(event.target.value)} required placeholder="Tỉnh/thành" />
                        </div>
                        <div className="col-md-6 mb-15">
                          <input className="input" value={shippingDistrict} onChange={(event) => setShippingDistrict(event.target.value)} placeholder="Quận/huyện" />
                        </div>
                        <div className="col-md-6 mb-15">
                          <input className="input" value={shippingWard} onChange={(event) => setShippingWard(event.target.value)} placeholder="Phường/xã" />
                        </div>
                        <div className="col-12 mb-15">
                          <input className="input" value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} required placeholder="Địa chỉ nhận hàng" />
                        </div>
                        <div className="col-12 mb-15">
                          <textarea className="input" value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} rows={3} placeholder="Ghi chú"></textarea>
                        </div>
                        <div className="col-12 mb-20">
                          <div className="tg-tour-about-time d-flex align-items-center mb-10">
                            <span className="time">Thanh toán:</span>
                            <div className="form-check mr-15">
                              <input className="form-check-input" type="radio" name="paymentMethod" id="order-pay-cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                              <label className="form-check-label" htmlFor="order-pay-cash">Tiền mặt</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="paymentMethod" id="order-pay-bank" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} />
                              <label className="form-check-label" htmlFor="order-pay-bank">Chuyển khoản</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button type="submit" disabled={isSubmitting} className="tg-btn w-100 text-center">
                        {isSubmitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {successMessage && items.length === 0 && (
          <div className="empty_bag text-center mb-30">
            <p className="py-3">{successMessage}</p>
            <Link href="/cua-hang" className="tg-btn">Tiếp tục mua sắm</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartArea;
