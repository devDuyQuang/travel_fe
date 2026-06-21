import BannerFormTwo from "@/components/common/banner-form/BannerFormTwo"
import type { ServiceSearchLabels } from "@/types/service-layout"

const BannerForm = ({ labels }: { labels?: ServiceSearchLabels }) => {
   return (
      <div className="tg-booking-form-area tg-booking-form-grid-space pb-50">
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-booking-form-item tg-booking-form-grid">
                     <BannerFormTwo labels={labels} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BannerForm
