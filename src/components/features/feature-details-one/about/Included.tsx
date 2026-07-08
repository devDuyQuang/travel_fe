import React from 'react'

const Included = () => {
   return (
      <div className="tg-tour-about-inner mb-40">
         <h4 className="tg-tour-about-title mb-20">Bao gồm / Không bao gồm</h4>
         <div className="row">
            <div className="col-lg-5">
               <div className="tg-tour-about-list  tg-tour-about-list-2">
                  <ul>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                        <span className="text">Dịch vụ đón và trả khách</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                        <span className="text">1 bữa ăn mỗi ngày</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                        <span className="text">Bữa tối và chương trình âm nhạc</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                        <span className="text">Tham quan các điểm nổi bật</span>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="col-lg-7">
               <div className="tg-tour-about-list tg-tour-about-list-2 disable">
                  <ul>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-xmark"></i></span>
                        <span className="text">Tiền tip</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-xmark"></i></span>
                        <span className="text">Đưa đón sân bay hai chiều</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-xmark"></i></span>
                        <span className="text">Xe cao cấp có điều hòa</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-sharp fa-solid fa-xmark"></i></span>
                        <span className="text">Vé phát sinh ngoài gói</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Included
