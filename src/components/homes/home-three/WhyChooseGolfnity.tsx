"use client";

const reasons = [
  {
    title: "Đặt dịch vụ rõ ràng",
    description:
      "Gửi yêu cầu tee time, tour golf, khách sạn và xe đưa đón trong một quy trình thống nhất.",
    icon: "fa-regular fa-calendar-check",
  },
  {
    title: "Tư vấn theo nhu cầu",
    description:
      "Gợi ý sân golf, điểm đến và dịch vụ phù hợp với lịch trình, ngân sách và nhu cầu thực tế.",
    icon: "fa-regular fa-route",
  },
  {
    title: "Biết giá trước khi xác nhận",
    description:
      "Lịch và chi phí được kiểm tra rõ ràng trước khi khách xác nhận đặt dịch vụ.",
    icon: "fa-regular fa-file-invoice-dollar",
  },
  {
    title: "Hỗ trợ nhóm golfer",
    description:
      "Hỗ trợ nhóm bạn, đoàn doanh nghiệp và các chuyến golf kết hợp nghỉ dưỡng.",
    icon: "fa-regular fa-users",
  },
];

const WhyChooseGolfnity = () => {
  return (
    <section className="golfnity-why-section">
      <div className="container">
        <div className="golfnity-why-section__heading">
          <span>An tâm trong từng hành trình</span>
          <h2>Vì sao chọn GOLFINITY?</h2>
        </div>
        <div className="golfnity-why-section__grid">
          {reasons.map((item) => (
            <article className="golfnity-why-section__card" key={item.title}>
              <span className="golfnity-why-section__icon" aria-hidden="true">
                <i className={item.icon}></i>
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseGolfnity;
