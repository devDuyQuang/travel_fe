# Audit field layout dịch vụ

| Layout key | Component listing / detail | Field đang render | Field template | Canonical API | DB hiện tại | Trạng thái | Fallback |
|---|---|---|---|---|---|---|---|
| `tee_time` | `feature-two` / `feature-details-one` | tên, ảnh, địa điểm, thời lượng, giá, rating, review; gallery, nội dung, CTA, sidebar | `title`, `thumb`, `location`, `duration`, `price`, `review`, `total_review` | `name`, `image_url`, `location`, `duration`, `price`, `rating`, `review_count`, `attributes.holes`, `par`, `course_type`, `opening_hours` | field chung + `attributes` | Đã map; phí và quy định dùng trong nội dung chuyên biệt/API, theme chưa có slot card riêng | Item tương ứng của `shop_2` |
| `tour` | `feature-three` / `feature-details-one` | tên, ảnh, địa điểm/điểm đến, thời lượng, giá, rating; feature list, nội dung, CTA, sidebar | `title`, `thumb`, `location`, `duration`, `price`, `guest`, `language` | field chung + `attributes.destination`, `days`, `nights`, `max_guests`, `languages`, `itinerary` | field chung + `attributes` | Đã map card/detail; itinerary và policy đi qua content/attributes | Item tương ứng của `shop_3` |
| `accommodation` | `feature-one` / `feature-details-two` | tên, ảnh, địa điểm, giá, rating; gallery, amenities, nội dung, sidebar, related | `title`, `thumb`, `location`, `price`, `amenities`, `review` | field chung + `attributes.property_type`, `classification_rating`, `full_address`, `max_guests`, `amenities` | field chung + `attributes` | Đã map; số phòng/giường/policy chưa có slot riêng trong theme | Item tương ứng của `shop_1` |
| `transport` | `feature-three` / `feature-details-one` | tên, ảnh, giá, địa điểm, rating; loại xe, số chỗ, hộp số, tài xế | `title`, `thumb`, `location`, `price`, `review` | field chung + `attributes.vehicle_type`, `seat_count`, `transmission`, `driver_included`, `pickup_location` | field chung + `attributes` | Đã map; brand/model/luggage/policy chưa có slot card riêng | Item tương ứng của `shop_3` |
| `attraction` | `feature-three` / `feature-details-one` | tên, ảnh, địa điểm, thời lượng, giá, rating; loại vé, giờ mở cửa, tuổi tối thiểu | `title`, `thumb`, `location`, `duration`, `price`, `review` | field chung + `attributes.ticket_type`, `visit_duration`, `adult_price`, `opening_time`, `minimum_age` | field chung + `attributes` | Đã map; child/infant price và ticket note chưa có slot card riêng | Item tương ứng của `shop_3` |

## Audit theo vùng giao diện

| Vùng | Nguồn CMS | Cách fallback |
|---|---|---|
| Listing card | canonical Product + attributes phù hợp layout | Giữ item `ShopData` cùng vị trí |
| Detail header | name, location, price, rating, review_count | Giữ text/giá/rating template |
| Gallery/video | image_url, gallery, video_url | Giữ ảnh/video theme |
| Feature list | `category.layout_key` chọn đúng 4 field attributes | Giữ từng field template bị thiếu |
| Nội dung/highlight/facility | content, highlights, facilities | Giữ section template tương ứng |
| Sidebar/CTA | price và dữ liệu UI theme | Không tạo booking/order; submit chỉ giữ UI |
| Search form | UI theme hiện tại | Không gửi booking/order giả |
| Related Product | Product cùng category, loại trừ slug hiện tại | Giữ related template nếu danh sách CMS trống |

## Field chưa thể map trực tiếp

Theme hiện không có vị trí riêng trên card/detail cho toàn bộ policy, surcharge,
course fee, child/infant price, bedroom/bathroom count, luggage capacity và ticket
notes. Các field vẫn được quản lý trong CMS, trả qua `attributes`, không bị mất; UI
tiếp tục dùng fallback cho đến khi có section theme phù hợp.
