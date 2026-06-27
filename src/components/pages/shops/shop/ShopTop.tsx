"use client";

import NiceSelect from "@/ui/NiceSelect";
import { useRouter, useSearchParams } from "next/navigation";

const ShopTop = ({ startOffset, endOffset, totalItems }: { startOffset: number; endOffset: number; totalItems: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (item: { value: string; text: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (item.value) params.set("sort", item.value);
    else params.delete("sort");
    params.delete("page");
    router.push(params.toString() ? `/cua-hang?${params.toString()}` : "/cua-hang");
  };

  return (
    <div className="tg-listing-box-filter tg-shop-product-filter mb-25">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-5 mb-15">
          <div className="tg-listing-box-number-found">
            <span>Hiển thị {startOffset}-{endOffset} của {totalItems} sản phẩm</span>
          </div>
        </div>
        <div className="col-lg-7 col-md-7 mb-15">
          <div className="tg-listing-box-view-type d-flex justify-content-end align-items-center">
            <div className="tg-listing-select-price ml-10">
              <NiceSelect
                className="select"
                options={[
                  { value: "", text: "Sắp xếp mặc định" },
                  { value: "latest", text: "Mới nhất" },
                  { value: "price_asc", text: "Giá thấp đến cao" },
                  { value: "price_desc", text: "Giá cao đến thấp" },
                ]}
                defaultCurrent={0}
                onChange={handleSort}
                name=""
                placeholder=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopTop;
