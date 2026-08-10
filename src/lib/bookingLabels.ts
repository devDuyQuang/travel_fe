export type BookingType =
  | "tour"
  | "attraction"
  | "hotel"
  | "transport"
  | "tee_time"
  | "golf_room"
  | "consultation";

type BookingCopy = {
  title: string;
  dateLabel: string;
  datePlaceholder: string;
  endDateLabel?: string;
  endDatePlaceholder?: string;
  timeLabel?: string;
  customerSectionTitle: string;
  participantSectionTitle: string;
  paymentTitle: string;
  priceLabel: string;
  priceQuoteText: string;
  submitLabel: string;
  confirmSubmitLabel: string;
  successTitle: string;
  successMessage: string;
};

const quoteText = "Giá sẽ được tư vấn";

export function getBookingCopy(
  bookingType: BookingType,
): BookingCopy {
  const common = {
    paymentTitle:
      "Phương thức thanh toán:",
    priceQuoteText: quoteText,
    confirmSubmitLabel: "Xác nhận gửi yêu cầu",
    successMessage:
      "Chúng tôi đã nhận thông tin của quý khách và sẽ kiểm tra tình trạng dịch vụ để phản hồi trong thời gian sớm nhất.",
  };

  if (bookingType === "hotel") {
    return {
      ...common,
      title: "Yêu cầu đặt phòng",
      dateLabel: "Nhận phòng",
      datePlaceholder: "Chọn ngày",
      endDateLabel: "Trả phòng",
      endDatePlaceholder: "Chọn ngày",
      timeLabel: "Giờ nhận phòng dự kiến:",
      customerSectionTitle:
        "Thông tin khách lưu trú:",
      participantSectionTitle:
        "Loại phòng",
      priceLabel: "Giá dự kiến:",
      submitLabel: "Gửi yêu cầu đặt phòng",
      successTitle:
        "Yêu cầu đặt phòng đã được tiếp nhận",
    };
  }

  if (bookingType === "transport") {
    return {
      ...common,
      title: "Yêu cầu thuê xe",
      dateLabel: "Ngày đón",
      datePlaceholder: "Chọn ngày",
      timeLabel: "Giờ đón:",
      customerSectionTitle:
        "Thông tin khách hàng:",
      participantSectionTitle:
        "Thông tin đưa đón:",
      priceLabel: "Giá dự kiến:",
      submitLabel: "Gửi yêu cầu thuê xe",
      successTitle:
        "Yêu cầu thuê xe đã được tiếp nhận",
    };
  }

  if (bookingType === "attraction") {
    return {
      ...common,
      title: "Yêu cầu đặt vé",
      dateLabel: "Ngày tham quan",
      datePlaceholder: "Chọn ngày",
      timeLabel: "Khung giờ tham quan:",
      customerSectionTitle:
        "Thông tin khách hàng:",
      participantSectionTitle:
        "Số vé:",
      priceLabel: "Giá dự kiến:",
      submitLabel: "Gửi yêu cầu đặt vé",
      successTitle:
        "Yêu cầu đặt vé đã được tiếp nhận",
    };
  }

  if (bookingType === "tee_time") {
    return {
      ...common,
      title: "Yêu cầu đặt tee time",
      dateLabel: "Ngày chơi",
      datePlaceholder: "Chọn ngày",
      timeLabel: "Giờ chơi:",
      customerSectionTitle:
        "Thông tin khách hàng:",
      participantSectionTitle:
        "Thông tin golfer:",
      paymentTitle:
        "Phương thức thanh toán dự kiến",
      priceLabel: "Giá dự kiến:",
      submitLabel: "Gửi yêu cầu đặt tee time",
      successTitle:
        "Yêu cầu đặt tee time đã được tiếp nhận",
      successMessage:
        "Chúng tôi đã ghi nhận yêu cầu của bạn và sẽ kiểm tra lịch sân để phản hồi trong thời gian sớm nhất.",
    };
  }

  if (
    bookingType === "golf_room" ||
    bookingType === "consultation"
  ) {
    return {
      ...common,
      title: "Yêu cầu tư vấn",
      dateLabel: "Ngày mong muốn tư vấn",
      datePlaceholder:
        "Chọn ngày",
      customerSectionTitle:
        "Thông tin liên hệ:",
      participantSectionTitle:
        "Thông tin tư vấn:",
      priceLabel: "Giá dự kiến:",
      submitLabel: "Gửi yêu cầu tư vấn",
      successTitle:
        "Yêu cầu tư vấn đã được tiếp nhận",
    };
  }

  return {
    ...common,
    title: "Yêu cầu tư vấn tour",
    dateLabel: "Ngày khởi hành",
    datePlaceholder: "Chọn ngày",
    endDateLabel: "Ngày kết thúc",
    endDatePlaceholder: "Chọn ngày",
    timeLabel: "Giờ khởi hành:",
    customerSectionTitle: "Thông tin khách hàng:",
    participantSectionTitle: "Số khách tham gia:",
    priceLabel: "Giá dự kiến:",
    submitLabel: "Gửi yêu cầu tư vấn tour",
    successTitle:
      "Yêu cầu tư vấn tour đã được tiếp nhận",
  };
}

export function formatBookingPrice(
  value: number | null,
  quoteTextValue = quoteText,
): string {
  return value && value > 0
    ? `${value.toLocaleString("vi-VN")} ₫`
    : quoteTextValue;
}
