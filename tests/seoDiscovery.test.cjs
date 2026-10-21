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
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText,
      { exports, require: load, URL, URLSearchParams, process, console, fetch, AbortSignal, Set, Map, Date });
    return exports;
  }
  return load;
}
function api(timestamps, failDates = false) {
  return async url => {
    const u = new URL(url), page = Number(u.searchParams.get('page'));
    if (u.pathname.endsWith('/post_sitemap')) return { ok: !failDates, status: 503, json: async () => timestamps };
    if (u.pathname.endsWith('/category')) return { ok: true, json: async () => ({ success: true, data: u.searchParams.get('type') === 'post' ? [{ id: 23, slug: 'guides', type: 'post' }] : [] }) };
    const isPost = u.pathname.endsWith('/post');
    const data = isPost ? [{ id: page, name: `Article ${page}`, slug: `article-${page}`, categories: [{ id: 23, type: 'post' }] }] : [];
    return { ok: true, json: async () => ({ success: true, data, meta: { current_page: page, last_page: isPost ? 2 : 1, total: isPost ? 2 : 0 } }) };
  };
}
test('news sitemap remains paginated; timestamps never introduce non-news URLs', async () => {
  const load = modules(api([{ slug: 'article-1', updated_at: '2026-10-19T13:45:08+00:00' }, { slug: 'article-2', updated_at: 'invalid' }, { slug: 'service-only', updated_at: '2026-10-19T13:45:08+00:00' }]));
  const result = await load('@/lib/sitemapData').getSitemapData();
  assert.deepEqual(Array.from(result.news, p => p.slug), ['article-1', 'article-2']);
  assert.equal(result.news[0].updated_at, '2026-10-19T13:45:08.000Z');
  assert.equal(result.news[1].updated_at, undefined);
  const sitemap = (await load('@/app/sitemap').default()).filter(row => row.url.includes('/tin-tuc/'));
  assert.equal(sitemap.length, 2);
  assert.equal(sitemap[0].lastModified.toISOString(), '2026-10-19T13:45:08.000Z');
  assert.equal(sitemap[1].lastModified, undefined);
  assert.ok(sitemap.every(row => row.url.startsWith('https://travel.voduyquang.com/tin-tuc/') && !row.url.includes('?')));
});
test('optional timestamp failure retains all verified discovery URLs', async () => {
  for (const [data, fail] of [[null, true], [{ unexpected: true }, false]]) {
    const result = await modules(api(data, fail))('@/lib/sitemapData').getSitemapData();
    assert.equal(result.news.length, 2);
    assert.ok(result.news.every(post => post.updated_at === undefined));
  }
});
test('article schema uses real fields; missing author/publication date is not fabricated', () => {
  const { postStructuredData } = modules()('@/lib/postStructuredData');
  const post = { id: 1, name: 'Actual CMS article', slug: 'actual-article', image: 'https://example.com/article.webp', created_at: '2026-10-19T13:40:30Z', updated_at: '2026-10-20T09:00:00Z', created_by: 1, description_seo: 'CMS description' };
  const graph = postStructuredData(post)['@graph'];
  const article = graph[0];
  assert.equal(article['@type'], 'BlogPosting');
  assert.equal(article.headline, post.name);
  assert.equal(article.mainEntityOfPage['@id'], 'https://travel.voduyquang.com/tin-tuc/actual-article');
  assert.equal(article.dateModified, '2026-10-20T09:00:00.000Z');
  assert.equal(article.dateCreated, '2026-10-19T13:40:30.000Z');
  assert.equal(article.datePublished, undefined);
  assert.equal(article.author, undefined);
  assert.deepEqual(Array.from(article.image), ['https://example.com/article.webp']);
  assert.equal(graph[1]['@type'], 'BreadcrumbList');
  assert.equal(graph[1].itemListElement[2].item, article.url);
});
test('structured data round-trips CMS strings safely, with no review markup', () => {
  const { serializePostStructuredData } = modules()('@/lib/postStructuredData');
  const name = '</script><script>alert(1)</script>';
  const json = serializePostStructuredData({ id: 1, name, slug: 'safe', author: { name: 'CMS author' }, published_at: '2026-10-19T00:00:00Z', updated_at: 'bad' });
  assert.ok(!json.includes('</script>') && !json.includes('AggregateRating') && !json.includes('"@type":"Review"'));
  const article = JSON.parse(json)['@graph'][0];
  assert.equal(article.headline, name);
  assert.equal(article.author.name, 'CMS author');
  assert.equal(article.datePublished, '2026-10-19T00:00:00.000Z');
  assert.equal(article.dateModified, undefined);
});
