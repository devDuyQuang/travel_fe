import BannerFormTwo from "@/components/common/banner-form/BannerFormTwo"
import type { ServiceSearchLabels } from "@/types/service-layout"
import type { ServiceLayoutKey } from "@/lib/serviceLayoutRegistry";

const BannerForm = ({
   labels,
   layoutKey,
   categorySlug,
}: {
   labels?: ServiceSearchLabels;
   layoutKey?: ServiceLayoutKey | string | null;
   categorySlug?: string;
}) => {
   return (
      <div className="tg-booking-form-area tg-booking-form-grid-space pb-50">
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-booking-form-item tg-booking-form-grid">
                     <BannerFormTwo labels={labels} layoutKey={layoutKey} categorySlug={categorySlug} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BannerForm
