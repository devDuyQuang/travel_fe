const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function modules(fetch) {
  const cache = {};
  function load(name) {
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const exports = cache[name] = {};
    const base = path.join(process.cwd(), 'src', name.slice(2));
    const file = fs.existsSync(base + '.ts') ? base + '.ts' : base + '.tsx';
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText,
      { exports, require: load, URL, URLSearchParams, process, console, fetch, AbortSignal, Set, Map, Date });
    return exports;
  }
  return load;
}
test('metadata uses absolute clean canonical and safe description fallback utilities', () => {
  const { pageMetadata, metadataDescription } = modules()('@/lib/seoMetadata');
  const m = pageMetadata('CMS title', '/dich-vu/dat-tee-time/course', metadataDescription('<p>CMS description</p>'));
  assert.equal(m.title, 'CMS title');
  assert.equal(m.description, 'CMS description');
  assert.equal(m.alternates.canonical, 'https://travel.voduyquang.com/dich-vu/dat-tee-time/course');
  assert.equal(m.openGraph.url, m.alternates.canonical);
  assert.equal(metadataDescription(' '), undefined);
  assert.equal(metadataDescription('x'.repeat(180)).length, 160);
});
test('breadcrumb schema has actual hierarchy, safe serialization and no invented offers/reviews', () => {
  const { serializeServiceBreadcrumb } = modules()('@/lib/serviceBreadcrumbSchema');
  const s = serializeServiceBreadcrumb({ name: '</script><script>alert(1)</script>', slug: 'course', category: { name: 'Tee time', slug: 'dat-tee-time' } });
  assert.ok(!s.includes('</script>'));
  const schema = JSON.parse(s);
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.deepEqual(schema.itemListElement.map(i => i.position), [1, 2, 3]);
  assert.equal(schema.itemListElement[2].item, 'https://travel.voduyquang.com/dich-vu/dat-tee-time/course');
  assert.ok(!s.includes('aggregateRating') && !s.includes('offers'));
});
test('sitemap collects multiple pages and excludes inactive and reserved service products', async () => {
  const category = { id: 1, name: 'Tee time', slug: 'dat-tee-time', type: 'service', layout_key: 'tee_time' };
  const product = { id: 1, name: 'Course', slug: 'course', status: 1, product_type: 'service', short_description: 'Book golf', category };
  const requests = [];
  const load = modules(async (url) => {
    requests.push(url);
    const u = new URL(url), p = u.searchParams;
    if (u.pathname.endsWith('/category')) return { ok: true, json: async () => ({ success: true, data: p.get('type') === 'service' ? [category] : [] }) };
    const service = p.get('product_type') === 'service', page = Number(p.get('page'));
    const rows = service ? (page === 1 ? [product] : [{ ...product, id: 2, slug: 'inactive', status: 0 }, { ...product, id: 3, slug: 'danh-sach' }]) : [];
    return { ok: true, json: async () => ({ success: true, data: rows, meta: { current_page: page, last_page: service ? 2 : 1, total: service ? 3 : 0 } }) };
  });
  const data = await load('@/lib/sitemapData').getSitemapData();
  assert.deepEqual(Array.from(data.serviceProducts, p => p.slug), ['course']);
  assert.ok(requests.some(u => u.includes('page=2')));
});

test('accommodation title renders exactly one H1 with the original visual class', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const Component = modules()('@/components/features/feature-details-two/TourDetailsArea').default;
  const html = renderToStaticMarkup(React.createElement(Component, { product: { name: 'Actual hotel', price: '100', service_options: [] } }));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('class="tg-tour-details-video-title mb-15"'));
  assert.ok(html.includes('Actual hotel'));
});
test('sitemap API failure stays visible rather than returning partial data', async () => {
  const load = modules(async () => ({ ok: false, status: 503 }));
  await assert.rejects(load('@/lib/sitemapData').getSitemapData(), /returned 503/);
});
