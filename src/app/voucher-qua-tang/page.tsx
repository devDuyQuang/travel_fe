import { pageMetadata } from "@/lib/seoMetadata";
import VoucherGiftPage from "@/components/vouchers/VoucherGiftPage";

export const metadata = pageMetadata("Voucher & Quà tặng GOLFNITY", "/voucher-qua-tang", "Voucher và thẻ quà tặng golf dành cho golfer, đối tác và doanh nghiệp.");

const page = () => {
  return <VoucherGiftPage />;
};

export default page;
