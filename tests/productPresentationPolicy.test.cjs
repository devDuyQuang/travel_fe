const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function load(file) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { exports, require, setTimeout, clearTimeout });
  return exports;
}
test('review hold is isolated to Product 17 and preserves original data', () => {
  const { canDisplayProductReviews } = load('src/lib/productPresentationPolicy.ts');
  const p = { id: 17, rating: '4.4', review_count: 1267 };
  assert.equal(canDisplayProductReviews(p), false);
  for (const id of [1, 16, 18, 19]) assert.equal(canDisplayProductReviews({ id }), true);
  assert.equal(canDisplayProductReviews(null), true);
  assert.deepEqual(p, { id: 17, rating: '4.4', review_count: 1267 });
});
test('no voucher entry or modal renders without a verified source, even when open', () => {
  const C = load('src/components/features/feature-details-one/TeeTimeVoucherSection.tsx').default;
  for (const isOpen of [false, true]) {
    assert.equal(renderToStaticMarkup(React.createElement(C, { isOpen, onClose() {}, onOpen() {} })), '');
  }
});
test('explicit production voucher input retains voucher UI', () => {
  const C = load('src/components/features/feature-details-one/TeeTimeVoucherSection.tsx').default;
  const html = renderToStaticMarkup(React.createElement(C, { isOpen: false, onClose() {}, onOpen() {}, verifiedVouchers: [{ code: 'TEST-FIXTURE', title: 'Verified fixture', discountLabel: 'Fixture offer', category: 'platform' }] }));
  assert.ok(html.includes('tee-time-voucher-chip') && html.includes('Fixture offer'));
  assert.ok(!/GOLF100|GOLF200|GOLF5/.test(html));
});
