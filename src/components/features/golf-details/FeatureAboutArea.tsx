import type { Product } from "@/types/product";
import AboutText from "./about/AboutText";
import Included from "./about/Included";
import Faq from "./about/Faq";
import FeatureSidebar from "./FeatureSidebar";

const FeatureAboutArea = ({ product }: { product: Product | null }) => {
  return (
    <div className="tg-tour-about-area tg-tour-about-border pt-40 pb-70">
      <div className="container">
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="tg-tour-about-content">
              <AboutText product={product} />

              <div className="tg-tour-about-border mb-40"></div>

              {/* Tạm thời comment mấy phần template cũ nếu không dùng */}
              {/* <Included /> */}
              {/* <div className="tg-tour-about-border mb-40"></div> */}
              {/* <Faq /> */}
            </div>
          </div>

          <div className="col-xl-3 col-lg-4">
            <FeatureSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureAboutArea;