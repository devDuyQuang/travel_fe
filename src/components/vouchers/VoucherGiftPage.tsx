"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";

import FooterFive from "@/layouts/footers/FooterFive";
import HeaderThree from "@/layouts/headers/HeaderThree";

import styles from "./VoucherGiftPage.module.css";

const voucherTypes = [
  "Tee time",
  "Tour golf",
  "Combo golf + khách sạn",
  "Golf doanh nghiệp",
];

const voucherValues = ["500.000đ", "1.000.000đ", "2.000.000đ", "5.000.000đ", "Liên hệ"];

const benefits = [
  ["fa-regular fa-paper-plane", "Dễ gửi", "Gửi yêu cầu nhanh, đội ngũ GOLFNITY hỗ trợ hoàn thiện voucher."],
  ["fa-regular fa-grid-2", "Dùng cho nhiều dịch vụ", "Tee time, tour golf, nghỉ dưỡng, xe đưa đón và combo linh hoạt."],
  ["fa-regular fa-handshake", "Phù hợp cá nhân & doanh nghiệp", "Tặng golfer, đối tác, khách hàng, nhân viên hoặc đội nhóm."],
  ["fa-regular fa-headset", "Có người hỗ trợ trước khi đặt lịch", "GOLFNITY xác nhận lịch, giá và điều kiện trước khi khách thanh toán."],
];

const useCases = [
  ["fa-regular fa-user-group", "Tặng bạn chơi golf"],
  ["fa-regular fa-briefcase", "Tặng đối tác"],
  ["fa-regular fa-building", "Quà doanh nghiệp"],
  ["fa-regular fa-people-group", "Team building golf"],
  ["fa-regular fa-cake-candles", "Sinh nhật / dịp đặc biệt"],
];

const faqs = [
  [
    "Voucher GOLFNITY dùng cho dịch vụ nào?",
    "Voucher có thể dùng cho tee time, tour golf, combo nghỉ dưỡng, thuê xe và các dịch vụ golf được GOLFNITY xác nhận.",
  ],
  [
    "Voucher có thời hạn bao lâu?",
    "Thẻ quà tặng mẫu có hiệu lực 12 tháng. Thời hạn chính thức sẽ được ghi rõ khi GOLFNITY phát hành voucher.",
  ],
  [
    "Có thể tặng cho nhiều người không?",
    "Có. GOLFNITY có thể hỗ trợ gói voucher cho nhóm golfer, doanh nghiệp hoặc nhiều người nhận khác nhau.",
  ],
  [
    "Có hoàn tiền voucher không?",
    "Voucher không quy đổi thành tiền mặt. Chính sách đổi/hủy sẽ được xác nhận theo từng dịch vụ và điều kiện phát hành.",
  ],
  [
    "Tôi có thể mua voucher cho doanh nghiệp không?",
    "Có. GOLFNITY hỗ trợ gói quà tặng golf cho khách hàng, nhân viên, đối tác và sự kiện doanh nghiệp.",
  ],
];

const terms = [
  "Voucher không quy đổi thành tiền mặt.",
  "Giá trị voucher được dùng theo điều kiện dịch vụ tại thời điểm đặt.",
  "GOLFNITY sẽ xác nhận lịch và giá trước khi thanh toán.",
  "Một số dịch vụ có thể cần phụ thu tùy lịch, sân hoặc đối tác cung cấp.",
];

const VoucherGiftPage = () => {
  const [selectedType, setSelectedType] = useState(voucherTypes[0]);
  const [selectedValue, setSelectedValue] = useState(voucherValues[1]);
  const [quantity, setQuantity] = useState("1");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3600);
  };

  return (
    <>
      <HeaderThree />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span>Voucher & Quà tặng GOLFNITY</span>
            <h1>Tặng một hành trình golf đáng nhớ</h1>
            <p>
              Voucher GOLFNITY phù hợp để tặng golfer, đối tác, khách hàng hoặc đội nhóm.
            </p>
            <div className={styles.heroActions}>
              <a href="#gift-card">Chọn voucher</a>
              <a href="#corporate">Liên hệ tư vấn</a>
            </div>
          </div>
        </section>

        <section className={styles.benefits} aria-label="Lợi ích voucher">
          {benefits.map(([icon, title, text]) => (
            <article key={title}>
              <i className={icon} aria-hidden="true" />
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className={styles.selectorSection} id="gift-card">
          <span className={styles.anchorTarget} id="tee-time" />
          <span className={styles.anchorTarget} id="tour-golf" />
          <div className={styles.sectionIntro}>
            <span>Gift card</span>
            <h2>Chọn voucher phù hợp</h2>
            <p>Tạo yêu cầu mua voucher trước, đội ngũ GOLFNITY sẽ xác nhận thông tin và hướng dẫn bước tiếp theo.</p>
          </div>

          <div className={styles.selectorGrid}>
            <aside className={styles.previewPanel} aria-label="Xem trước thẻ quà tặng">
              <div className={styles.giftCard}>
                <div className={styles.cardTop}>
                  <strong>GOLFNITY</strong>
                  <span>Golf gift card</span>
                </div>
                <div>
                  <span>Thẻ quà tặng GOLFNITY</span>
                  <h3>{selectedValue}</h3>
                  <p>{selectedType}</p>
                </div>
                <div className={styles.cardBottom}>
                  <span>Hiệu lực: 12 tháng</span>
                  <i className="fa-regular fa-golf-club" aria-hidden="true" />
                </div>
              </div>
            </aside>

            <form className={styles.voucherForm} onSubmit={handleSubmit}>
              <label>
                <span>Chọn loại voucher</span>
                <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                  {voucherTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend>Chọn mệnh giá</legend>
                <div className={styles.valueGrid}>
                  {voucherValues.map((value) => (
                    <button
                      className={selectedValue === value ? styles.valueActive : ""}
                      key={value}
                      onClick={() => setSelectedValue(value)}
                      type="button"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className={styles.formGrid}>
                <label>
                  <span>Số lượng</span>
                  <input min="1" onChange={(event) => setQuantity(event.target.value)} type="number" value={quantity} />
                </label>
                <label>
                  <span>Người gửi</span>
                  <input placeholder="Tên của bạn" type="text" />
                </label>
              </div>

              <label>
                <span>Email/SĐT người nhận</span>
                <input placeholder="email@example.com hoặc số điện thoại" type="text" />
              </label>

              <label>
                <span>Lời nhắn</span>
                <textarea placeholder="Gửi một lời chúc ngắn cho golfer..." rows={4} />
              </label>

              <label>
                <span>Ngày gửi mong muốn</span>
                <input type="date" />
              </label>

              <button className={styles.submitButton} type="submit">
                Gửi yêu cầu mua voucher
              </button>
            </form>
          </div>
        </section>

        <section className={styles.useCases}>
          <div className={styles.sectionIntro}>
            <span>Occasions</span>
            <h2>Voucher phù hợp cho</h2>
          </div>
          <div className={styles.useCaseGrid}>
            {useCases.map(([icon, title]) => (
              <article key={title}>
                <i className={icon} aria-hidden="true" />
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.redeemSection}>
          <div>
            <span>Redeem</span>
            <h2>Sử dụng voucher như thế nào?</h2>
            <p>Mã voucher sẽ được xác thực khi hệ thống thanh toán được kích hoạt.</p>
          </div>
          <form onSubmit={(event) => event.preventDefault()}>
            <input aria-label="Nhập mã voucher" placeholder="Nhập mã voucher" type="text" />
            <button type="submit">Kiểm tra</button>
          </form>
        </section>

        <section className={styles.corporateSection} id="corporate">
          <div>
            <span>Corporate golf</span>
            <h2>Bạn muốn mua voucher cho nhóm hoặc doanh nghiệp?</h2>
            <p>GOLFNITY hỗ trợ gói quà tặng golf cho khách hàng, nhân viên và đối tác.</p>
          </div>
          <Link href="/contact">Liên hệ GOLFNITY</Link>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.sectionIntro}>
            <span>FAQ</span>
            <h2>Câu hỏi thường gặp</h2>
          </div>
          <div className={styles.faqGrid}>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.termsSection}>
          <h2>Điều kiện sử dụng</h2>
          <ul>
            {terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </section>
      </main>

      {showToast && (
        <div className={styles.toast} role="status">
          GOLFNITY đã ghi nhận yêu cầu. Tính năng thanh toán voucher sẽ được kết nối ở bước sau.
        </div>
      )}
      <FooterFive />
    </>
  );
};

export default VoucherGiftPage;
