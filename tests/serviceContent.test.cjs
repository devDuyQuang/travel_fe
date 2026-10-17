const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function modules() {
  const cache = {};
  function load(name, parent = process.cwd()) {
    if (name.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (name === 'yet-another-react-lightbox') return () => null;
    if (name === 'next/link') return ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children);
    if (name === 'next/image') return ({ src, alt, width, height }) => React.createElement('img', { src, alt, width, height });
    if (!name.startsWith('@/') && !name.startsWith('.')) return require(name);
    const base = name.startsWith('@/') ? path.join(process.cwd(), 'src', name.slice(2)) : path.resolve(parent, name);
    const file = fs.existsSync(base + '.ts') ? base + '.ts' : base + '.tsx';
    if (cache[file]) return cache[file];
    const exports = cache[file] = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText, { exports, require: name => load(name, path.dirname(file)), URL, URLSearchParams, process, console, Set, Map, Date });
    return exports;
  }
  return load;
}
const fixture = { id: 17, name: 'CMS service', slug: 'actual-service', status: 1, product_type: 'service', category: { id: 1, name: 'Tee time', slug: 'dat-tee-time', type: 'service', layout_key: 'tee_time' }, location: 'Đà Nẵng', price: null, image_url: 'https://api.voduyquang.com/storage/service.jpg', content: '<h2>Full CMS heading</h2><p>Full CMS text</p><h3>FAQ question</h3><ul><li>CMS condition</li></ul><p><a href="/contact">Contact</a></p>', attributes: { editorial_description: 'Legacy text', editorial_dress_code: ['Existing note'] } };
test('tee-time About keeps full sanitized rich text in SSR disclosure with unchanged section IDs and notes', () => {
  const Component = modules()('@/components/features/feature-details-one/about/AboutText').default;
  const html = renderToStaticMarkup(React.createElement(Component, { product: fixture }));
  assert.ok(html.includes('id="ve-dich-vu-nay"') && html.includes('id="nhung-dieu-can-luu-y"'));
  assert.ok(html.includes('<details') && html.includes('Xem thêm') && html.includes('Thu gọn'));
  assert.ok(html.includes('<h2>Full CMS heading</h2>') && html.includes('<h3>FAQ question</h3>') && html.includes('<li>CMS condition</li>') && html.includes('href="/contact"'));
  assert.ok(html.includes('Existing note') && !html.includes('Legacy text') && !html.includes('<h1'));
  assert.ok(!html.includes('Ảnh tham khảo &amp; chú thích gốc'));
});
test('empty CMS content retains existing editorial fallback and unsafe HTML cannot execute', () => {
  const Component = modules()('@/components/features/feature-details-one/about/AboutText').default;
  const html = renderToStaticMarkup(React.createElement(Component, { product: { ...fixture, content: '', attributes: { editorial_description: '<h1>Fallback title</h1><p onclick="alert(1)">Fallback text</p><script>alert(1)</script>' } } }));
  assert.ok(html.includes('<h2>Fallback title</h2>') && html.includes('Fallback text'));
  assert.ok(!html.includes('onclick') && !html.includes('<script') && !html.includes('<h1'));
});
test('editorial images render in a deduplicated gallery without disclosure or captions', () => {
  const load = modules(), { embeddedEditorialImages } = load('@/components/services/content/contentData');
  const images = embeddedEditorialImages('<img src="https://example.com/photo.jpg"><img src="https://example.com/photo.jpg"><img src="javascript:alert(1)"><img src="data:image/svg+xml,bad">');
  assert.deepEqual(Array.from(images), ['https://example.com/photo.jpg']);
  const Media = load('@/components/services/content/EditorialMedia').default;
  const html = renderToStaticMarkup(React.createElement(Media, { images, captions: ['Original caption'] }));
  assert.ok(html.includes('https://example.com/photo.jpg') && html.includes('type="button"'));
  assert.ok(!html.includes('<details') && !html.includes('Original caption'));
  const three = ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'https://example.com/3.jpg'];
  const gallery = renderToStaticMarkup(React.createElement(Media, { images: [...three, three[0], 'javascript:alert(1)'] }));
  assert.equal((gallery.match(/<img/g) || []).length, 3);
  assert.equal((gallery.match(/<button/g) || []).length, 3);
  three.forEach(src => assert.ok(gallery.includes(src)));
  assert.ok(!gallery.includes('javascript:'));
});
test('demo reviews are explicit fictional examples without stars, counts, photos or schema', () => {
  const Component = modules()('@/components/services/content/DemoServiceReviews').default;
  const html = renderToStaticMarkup(React.createElement(Component));
  assert.ok(html.includes('Khách hàng mẫu 01'));
  assert.equal((html.match(/Nội dung mẫu · không phải đánh giá thật/g) || []).length, 3);
  assert.ok(!html.includes('Đánh giá minh họa — dữ liệu demo') && !html.includes('Các thẻ dưới đây'));
  assert.ok(html.includes('tee-time-section-title'));
  assert.equal((html.match(/<article/g) || []).length, 3);
  for (const forbidden of ['AggregateRating', 'application/ld+json', '<img', 'fa-star', 'verified']) assert.ok(!html.includes(forbidden));
});
test('recommendations exclude self, inactive and incomplete records; use real links and contact price', () => {
  const load = modules(), Component = load('@/components/services/content/RelatedServiceContent').default;
  const other = { ...fixture, id: 18, name: 'Actual related product', slug: 'other' };
  const html = renderToStaticMarkup(React.createElement(Component, { product: fixture, products: [fixture, other, other, { ...other, id: 19, slug: 'bad', status: 0 }, { ...other, id: 20, slug: 'missing-image', image_url: null }] }));
  assert.ok(!html.includes('undefined'));
  assert.ok(html.includes('Bạn có thể sẽ thích') && html.includes('/dich-vu/dat-tee-time/other') && html.includes('Liên hệ'));
  assert.equal((html.match(/Actual related product/g) || []).length, 2); // image alt + name
  assert.ok(!html.includes('/dat-tee-time/bad') && !html.includes('/dat-tee-time/missing-image'));
  assert.ok(html.includes('Khám phá điểm đến') && html.includes('location=da-nang'));
  assert.ok(html.includes('golfnity-home-listing') && html.includes('tg-listing-card-item') && html.includes('golfnity-home-listing__cta'));
  assert.ok(html.includes('golfnity-home-location__card') && html.includes('golfnity-home-location__thumb'));
  assert.equal((html.match(/tee-time-section-title/g) || []).length, 2);
  assert.ok(!html.includes('tg-listing-card-review') && !html.includes('price-discount'));
});
test('unavailable recommendation and destination data hides both sections', () => {
  const Component = modules()('@/components/services/content/RelatedServiceContent').default;
  assert.equal(renderToStaticMarkup(React.createElement(Component, { product: { ...fixture, location: '', image_url: null }, products: [] })), '');
});

test('tee-time editorial photos retain baseline vertical figure markup and original source order', () => {
  const Component = modules()('@/components/features/feature-details-one/about/AboutText').default;
  const gallery = ['https://example.com/staff.jpg', 'https://example.com/bridge.jpg', 'https://example.com/practice.jpg'];
  const html = renderToStaticMarkup(React.createElement(Component, { product: { ...fixture, gallery } }));
  const figures = html.match(/<figure class="tee-time-about-media"[\s\S]*?<\/figure>/g) || [];
  assert.equal(figures.length, 3);
  gallery.forEach((src, index) => assert.ok(figures[index].includes(`src="${src}"`)));
  assert.ok(!figures.join('').includes('<button') && !figures.join('').includes('<details'));
});
