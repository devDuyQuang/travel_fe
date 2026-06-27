"use client"
import { useEffect, useState } from "react";
import type { FaqItem } from "@/types/faq";

type FaqData = FaqItem & {
   showAnswer: boolean;
};

const FaqArea = ({ faqs = [] }: { faqs?: FaqItem[] }) => {

   const [faqData, setFaqData] = useState<FaqData[]>([]);

   useEffect(() => {
      const updatedData = faqs.map((item, index) => ({
         ...item,
         showAnswer: index === 0
      }));
      setFaqData(updatedData);
   }, [faqs]);

   const toggleAnswer = (faqId: number) => {
      setFaqData((prevFaqData) =>
         prevFaqData.map((faq) => ({
            ...faq,
            showAnswer: faq.id === faqId
         }))
      );
   };

   return (
      <div className="tg-pricing-area pb-120 pt-125 p-relative">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-lg-10">
                  <div className="tg-faq-content-wrap">
                     <div className="tg-faq-section-title text-center mb-40">
                        <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">Bạn cần được giải đáp?</h5>
                        <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Câu hỏi thường gặp</h2>
                     </div>
                     <div className="tg-faq-content">
                        <div className="accordion tg-custom-accordion" id="accordionExample">
                           {faqData.length === 0 && <p className="text-center">Thông tin FAQ đang được cập nhật.</p>}
                           {faqData.map((item) => (
                              <div key={item.id} className={`accordion-item ${item.showAnswer ? "tg-faq-active" : ""} mb-10 wow fadeInUp`} data-wow-delay=".3s" data-wow-duration=".9s">
                                 <h2 className="accordion-header" onClick={() => toggleAnswer(item.id)}>
                                    <button className="accordion-button" type="button">
                                       {item.question}
                                    </button>
                                 </h2>
                                 <div id="collapseOne" className={`accordion-collapse collapse ${item.showAnswer ? "show" : ""}`}>
                                    <div className="accordion-body">
                                       <div className="mb-0" dangerouslySetInnerHTML={{ __html: item.answer || "" }} />
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FaqArea
