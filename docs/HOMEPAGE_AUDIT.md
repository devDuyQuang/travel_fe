# Golfnity Homepage Audit

Route được audit: `src/app/page.tsx` → `src/components/homes/home-three/index.tsx`.

Không bao gồm các homepage demo khác.

| # | Khu vực | Component/file | Nội dung template hiện tại | Nguồn dữ liệu phù hợp | Setting key/API hiện có | Field cần quản trị | Fallback hiện tại | Phạm vi |
|---|---|---|---|---|---|---|---|---|
| 1 | Header | `layouts/headers/HeaderThree.tsx` | Logo Golfnity, menu, hotline, giỏ hàng, đăng nhập | Setting toàn site + Menu API | `site`, `site_assets_clinic`, Menu API | Không thêm field homepage | Logo/text Golfnity và menu template | Toàn site |
| 2 | Banner chính | `homes/home-three/Banner.tsx` | 5 ảnh nền; một cụm subtitle/title/description/price/button dùng chung | Setting homepage | Legacy `hero_home[_clinic]` đang là form y tế, frontend chưa dùng | Danh sách slide: enabled, sort, subtitle, title, description, price prefix/value/suffix, button text/link, image | Toàn bộ 5 ảnh và nội dung template | Chỉ homepage |
| 3 | Tìm kiếm dịch vụ | `common/banner-form/BannerFormThree.tsx` + `BannerFormTwo.tsx` | 6 tab demo Tour/Hotel/Restaurant/Rental/Activity/Car Rental; cùng một form demo | Category API `type=service` + cấu hình hiển thị homepage; registry theo `layout_key` | Category API đã có `layout_key`; chưa có setting search phù hợp | enabled, category_id, sort, display_name, placeholder, button label | Form/template hiện tại khi API lỗi hoặc không có category hợp lệ | Chỉ homepage |
| 4 | Giới thiệu ngắn | `homes/home-three/About.tsx` | “Most Popular Tour”, title, description, CTA, 4 ảnh; logo giữa là trang trí theme | Setting homepage | Chưa có key phù hợp | subtitle, title, description, button text/link, 4 images | Field-level từ template | Chỉ homepage |
| 5 | Sản phẩm nổi bật | `homes/home-three/Listing.tsx` | Tiêu đề section, 6 tab demo, card từ `ListingData`; Product API đang thay một phần card | Product API + Category API + Setting section | `services_home[_clinic]` tồn tại nhưng schema y tế; Product API có `is_featured`, `order_position` nhưng FE chưa yêu cầu featured | subtitle, title, description, limit, category ids/order, featured-first | Danh sách `ListingData` khi API rỗng/lỗi | Chỉ homepage |
| 6 | Vì sao chọn Golfnity | `homes/home-three/Choose.tsx` | Subtitle, title, description, 2 lợi ích, CTA, 2 ảnh; shape/big text là trang trí | Setting homepage | `why_choose_us_home[_clinic]` có thể giữ key và đổi UI/schema tương thích | enabled, subtitle, title, description, benefits, images, button text/link | Field-level từ template | Chỉ homepage |
| 7 | Video & ưu đãi | `homes/home-three/Cta.tsx` | Cover video, nút play, subtitle, title ưu đãi, CTA | Setting homepage | Chưa có key phù hợp | enabled, cover image, video URL, subtitle, title, description nếu component dùng, button text/link | Field-level từ template/video hiện tại | Chỉ homepage |
| 8 | Điểm đến nổi bật | `homes/home-three/Location.tsx` | Tiêu đề section và 4 card địa điểm tĩnh từ `LocationData` | Chưa có module Destination; chỉ map heading từ Setting | Chưa có key phù hợp | subtitle, title, description, limit | Giữ toàn bộ card template; không tự tạo module Destination | Chỉ homepage |
| 9 | CTA ảnh nền lớn | `homes/home-three/CtaTwo.tsx` | Background, subtitle, title, CTA, chữ lớn trang trí | Setting homepage | Chưa có key phù hợp | enabled, background, subtitle, title, button text/link | Field-level từ template | Chỉ homepage |
| 10 | Ý kiến khách hàng | `homes/home-three/Testimonial.tsx` | Heading và slider từ `TestimonialData`, luôn 5 sao | Setting homepage | `testimonials_home[_clinic]` có thể giữ key; frontend chưa dùng | enabled, subtitle, title, description, items: name/role/image/content/rating/status/sort | Toàn bộ testimonial template khi danh sách CMS rỗng | Chỉ homepage |
| 11 | Tin tức mới | `homes/home-three/Blog.tsx` | Heading; 3 bài template; Post API đang thay title/image/slug nhưng tag/date/read time còn demo | Post API `type=post` + Setting section | `blogs_home[_clinic]` có schema nhập bài thủ công, cần đổi UI nhưng giữ key | subtitle, title, description, limit, view-more text/link | Toàn bộ blog template khi Post API rỗng/lỗi | Chỉ homepage |
| 12 | CTA/app cuối trang | `homes/home-one/Cta.tsx` được homepage-three tái sử dụng | Background, ảnh điện thoại, subtitle/title, Google Play/App Store | Setting homepage | Chưa có key phù hợp | enabled, background, phone image, subtitle, title, store links/images nếu thực sự dùng | Field-level từ template | Chỉ homepage hiện tại |
| 13 | Footer | `layouts/footers/FooterThree.tsx` → `BrandedFooter.tsx` | Logo, mô tả, liên hệ, copyright; quick links/social vẫn phần lớn hard-code | Setting toàn site + Menu API | `site`, `site_assets_clinic`, `floating_info_clinic` | Không thêm field homepage; hoàn thiện mapping social/menu ở cấu hình site | Nội dung Golfnity an toàn | Toàn site |

## Kết luận kiến trúc

- Giữ nguyên thứ tự và JSX/CSS của `home-three`; chỉ thay nguồn dữ liệu và thêm điều kiện `enabled`.
- Category và Product/Post là nguồn xác thực. Setting chỉ giữ cấu hình trình bày, ID tham chiếu và nội dung heading.
- Form tìm kiếm do frontend registry quyết định theo `Category.layout_key`; CMS không lưu technical field keys.
- Mỗi section dùng field-level fallback. Danh sách CMS/API rỗng không được xóa danh sách template.
- Các key legacy đang có dữ liệu phải được đọc tương thích. Giao diện quản trị được thay theo nghiệp vụ Golfnity, không tạo lại dữ liệu Product/Post trong Setting.
- Mã clinic/bác sĩ được loại bỏ theo dependency graph riêng, sau khi homepage/Cấu hình Site không còn gọi tới các route, model, view hoặc key đó.
