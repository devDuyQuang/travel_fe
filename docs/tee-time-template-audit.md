# Audit template Tee time

Phạm vi:

- Listing: `/dich-vu/dat-tee-time`
- Detail: `/{tee-time-product-slug}`
- Không gồm các route demo.

## Component thực tế

| Vùng | Component/file |
|---|---|
| Route listing | `src/app/dich-vu/[slug]/page.tsx` |
| Registry | `src/lib/serviceLayoutRegistry.ts` → `tee_time.listing = FeatureTwo` |
| Listing layout | `src/components/features/feature-two/index.tsx` |
| Breadcrumb listing | `src/components/common/BreadCrumb.tsx` |
| Search form | `src/components/features/feature-two/BannerForm.tsx` → `common/banner-form/BannerFormTwo.tsx` |
| Card/grid | `src/components/features/feature-two/FeatureArea.tsx` |
| Sidebar/filter | `src/components/features/feature-two/FeatureSidebar.tsx` |
| Sort/view switch | `src/components/features/feature-two/FeatureTop.tsx` |
| Pagination | `ReactPaginate` trong `FeatureArea.tsx` |
| Route detail | `src/app/[slug]/page.tsx` |
| Registry detail | `tee_time.detail = FeatureDetailsOne` |
| Detail layout | `src/components/features/feature-details-one/index.tsx` |
| Breadcrumb detail | `feature-details-one/Breadcrumb.tsx` |
| Header/gallery/pricing | `feature-details-one/FeatureDetailsArea.tsx` |
| Feature list | `feature-details-one/FeatureList.tsx` |
| Content/map | `feature-details-one/FeatureAboutArea.tsx`, `about/AboutText.tsx` |
| Booking/contact sidebar | `feature-details-one/FeatureSidebar.tsx` |
| Related products | Không có trong template `feature-details-one` gốc |

## Bảng field thật

| Vị trí hiển thị | Component/file | Field template | Ví dụ template | API hiện có | DB hiện có | CMS? | Canonical | Fallback |
|---|---|---|---|---|---|---|---|---|
| Tiêu đề breadcrumb listing | `common/BreadCrumb` | `title` | Đặt tee time | Category `name` | `categories.name` | Có | `category.name` | Tên mặc định của `FeatureTwo` |
| Slug category | route listing | `slug` | dat-tee-time | Category `slug` | `categories.slug` | Có | `category.slug` | Dữ liệu service tĩnh |
| Giao diện | registry | `layoutKey` | tee_time | Category `layout_key` | `categories.layout_key` | Có | `category.layout_key` | Registry mặc định |
| Tên card | `FeatureArea` | `item.title` | Two Hour Walking Tour… | `name` | `products.name` | Có | `name` | `ShopData.shop_2.title` |
| Link card/detail | `FeatureArea` | `item.slug` | slug sản phẩm | `slug` | `products.slug` | Có | `slug` | Route template hiện hữu |
| Ảnh card | `FeatureArea` | `item.thumb` | `shop2_img1` | `image_url` | `products.image` | Có | `image_url` | Ảnh `ShopData` cùng vị trí |
| Nhãn card | `FeatureArea` | `item.tag` | New | `badge` | `products.badge_text` | Có | `badge` | `ShopData.tag` |
| Nhãn nổi bật | `FeatureArea` | `item.featured` | Featured | `is_featured`, `badge` | `products.is_featured`, `badge_text` | Có | `is_featured` | `ShopData.featured` |
| Nhãn offer | `FeatureArea` | `item.offer` | % Offer | Không có field trực tiếp | Không | Không | Không tạo | `ShopData.offer` |
| Địa điểm card | `FeatureArea` | `item.location` | Dubai, Emirates | `location` | `products.location` | Có | `location` | `ShopData.location` |
| Thời lượng card | `FeatureArea` | `item.duration` | 3 Days | `duration` | `products.duration` | Có | `duration` | `ShopData.duration` |
| Giá cũ | `FeatureArea` | `item.delete_price` | 299 | `price_discount` | `products.price_discount` | Có | `price_discount` | `ShopData.delete_price` |
| Giá hiện tại | `FeatureArea` | `item.price` | 240 | `price` | `products.price` | Có | `price` | `ShopData.price` |
| Số review card | `FeatureArea` | `item.total_review` | 15 | `review_count` | `products.review_count` | Có | `review_count` | `ShopData.total_review` |
| Rating filter/sort | `FeatureSidebar`, `FeatureTop` | `item.review` | 5 | `rating` | `products.review_rating` | Có | `rating` | `ShopData.review` |
| Destination filter | `FeatureSidebar` | `item.destination` | Italy | `location` có thể tái sử dụng | `products.location` | Không thêm | map `location → destination` | `ShopData.destination` |
| Amenities filter | `FeatureSidebar` | `item.amenities` | Car Parking | `facilities` có thể tái sử dụng | `products.facility` | Không thêm | map `facilities → amenities` | `ShopData.amenities` |
| Language filter | `FeatureSidebar` | `item.language` | English | Không có dữ liệu tee time phù hợp | Không | Không | Không tạo | `ShopData.language` |
| Price range | `FeatureSidebar` | `item.price` | 0–330 | `price` | `products.price` | Có | `price` | Giá template |
| Pagination/count | `FeatureArea`, `FeatureTop` | độ dài mảng | 1–9/12 | Dẫn xuất từ list | Không | Không | Không tạo | Mảng template |
| Search labels | `BannerFormTwo` | labels cấu hình | Sân golf, Ngày chơi | Registry tĩnh | Không | Không | Không tạo | Label mặc định |
| Search locations | `BannerFormTwo` | danh sách tĩnh | Chicago, Dubai | Không | Không | Không trong bước này | Không tạo | Template |
| Ngày chơi/golfer | `BannerFormTwo` | state UI | ngày hiện tại, counter | Không | Không | Không | Không tạo booking field | UI template |
| Breadcrumb detail | `Breadcrumb` | category/name | Home › Đặt tee time › … | `category`, `name` | Category + Product | Có | hiện có | Text template |
| Tên detail | `FeatureDetailsArea` | `product.name` | Vatican Museums… | `name` | `products.name` | Có | `name` | Text template |
| Địa điểm detail/map | detail area/about | `product.location` | Street Bintage… | `location` | `products.location` | Có | `location` | Text template |
| Rating detail | `FeatureDetailsArea` | `product.rating` | 5 sao | `rating` | `review_rating` | Có | `rating` | 5 |
| Review count detail | `FeatureDetailsArea` | `product.review_count` | 5 Reviews | `review_count` | `review_count` | Có | `review_count` | 5 |
| Ảnh chính | `FeatureDetailsArea` | `product.image_url` | thumb-4.jpg | `image_url` | `products.image` | Có | `image_url` | `thumb_1` |
| Ba ảnh gallery | `FeatureDetailsArea` | `product.gallery[0..2]` | thumb-1..3.jpg | `gallery` | gallery columns + `product_images` | Có | `gallery` | 3 ảnh template |
| Video button | `FeatureDetailsArea` | hard-code `videoId` | eEzD-Y97ges | `video_url` có nhưng chưa được đọc | `products.video_url` | Chưa cần thêm | Giữ field chung | Video template |
| Giá detail/sidebar | detail area/sidebar | `product.price` | 59 / 20 | `price` | `products.price` | Có | `price` | Giá template |
| Feature: Duration | `FeatureList` | `Duration` | 4 days | `duration` | `products.duration` | Có | `duration` | 4 days |
| Feature: Type | `FeatureList` | `Type` | Adventure | `attributes.course_type` | `products.attributes` | Có, field chuyên biệt duy nhất | `attributes.course_type` | Adventure/category name |
| Feature: Group Size | `FeatureList` | `Group Size` | 50 People | Không có field tee time phù hợp | Không | Không | Không tạo | 50 People |
| Feature: Languages | `FeatureList` | `Languages` | English | Không có field tee time phù hợp | Không | Không | Không tạo | English |
| Mô tả ngắn | `about/AboutText` | `short_description` | đoạn giới thiệu | `short_description` | `products.description` | Có | `short_description` | Đoạn template |
| Nội dung | `about/AboutText` | `content` | HTML nội dung | `content` | `products.content` | Có | `content` | Không render thêm nếu trống |
| Điểm nổi bật | `about/AboutText` | `highlights` | 3 bullet | `highlights` | `products.highlight` | Có | `highlights` | Bullet template |
| Tiện ích | `about/AboutText` | `facilities` | HTML tiện ích | `facilities` | `products.facility` | Có | `facilities` | Nội dung template còn lại |
| Included/Excluded | `about/Included` | dữ liệu tĩnh | Accommodation, Guide… | Không | Không | Không trong bước này | Không tạo | Template |
| Tour plan/FAQ | `about/Faq` | dữ liệu tĩnh | Day-01… | Không | Không | Không phù hợp tee time | Không tạo | Template |
| Review summary/list/form | `Review*` | dữ liệu tĩnh | 4.9, 1582… | Chưa nối review API | Không trong Product | Không trong bước này | Không tạo | Template |
| Booking sidebar date/time/tickets/extras | `FeatureSidebar` | dữ liệu tĩnh + `price` | 12:00, Adult… | Chỉ `price` | `products.price` | Chỉ giá | `price` | Toàn bộ UI còn lại giữ template |
| Related products | `feature-details-one/index` | Không có trong template gốc | — | — | — | Không | Không thêm section | Không áp dụng |

## Kết luận trước khi sửa

1. Listing dùng `FeatureTwo`; detail dùng `FeatureDetailsOne`.
2. Có 42 vị trí/giá trị được audit, tương ứng khoảng 20 field dữ liệu distinct.
3. Backend đã có toàn bộ field Product chung cần thiết.
4. Các tên khác nhau chỉ cần adapter/Resource: `title→name`, `thumb→image_url`,
   `delete_price→price_discount`, `review→rating`,
   `total_review→review_count`, `amenities→facilities`.
5. Field chuyên biệt thực sự cần quản lý: `attributes.course_type`.
6. Không cần migration/schema mới.
7. Không đưa icon, class, animation, pagination state, search state, booking UI,
   offer trang trí, FAQ/review mẫu hoặc related section vào DB.
