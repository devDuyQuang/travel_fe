const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
function modules(post) {
  const cache = {};
  const fetch = async () => ({ ok: true, json: async () => ({ success: Boolean(post), data: post }) });
  function load(name) {
    if (name === 'next/navigation') return { notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); } };
    if (name === '@/components/blogs/CmsPostDetail') return () => null;
    if (name === '@/layouts/Wrapper') return ({ children }) => React.createElement(React.Fragment, null, children);
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const exports = cache[name] = {};
    const base = path.join(process.cwd(), 'src', name.slice(2));
    const file = fs.existsSync(base + '.ts') ? base + '.ts' : base + '.tsx';
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText,
      { exports, require: load, URL, URLSearchParams, process, console, fetch, Set, Map, Date });
    return exports;
  }
  return load;
}
const article = { id: 101, name: 'Actual CMS article', slug: 'actual-guide', content: '<h2>Guide</h2><p>CMS copy</p>', title_seo: 'CMS SEO title', description_seo: 'CMS SEO description', categories: [{ id: 23, type: 'post' }] };
const props = { params: Promise.resolve({ slug: article.slug }) };
test('news type follows listing category semantics, not numeric ID or content length', () => {
  const { isNewsPost } = modules()('@/services/post.service');
  assert.ok(isNewsPost(article));
  assert.ok(isNewsPost({ ...article, id: 47, content: '', categories: [{ type: 'POST' }] }));
  assert.ok(isNewsPost({ ...article, categories: [{ type: 'service' }, { type: 'post' }] }));
  for (const post of [null, { ...article, categories: [] }, { ...article, categories: undefined }, { ...article, categories: [{ type: 'service' }] }]) assert.equal(isNewsPost(post), false);
});
test('valid articles keep CMS metadata/canonical and BlogPosting, including empty article content', async () => {
  for (const post of [article, { ...article, content: '' }]) {
    const route = modules(post)('@/app/tin-tuc/[slug]/page');
    const metadata = await route.generateMetadata(props);
    assert.equal(metadata.title, post.title_seo);
    assert.equal(metadata.description, post.description_seo);
    assert.equal(metadata.alternates.canonical, 'https://travel.voduyquang.com/tin-tuc/actual-guide');
    const page = await route.default(props);
    const script = page.props.children[0];
    const schema = JSON.parse(script.props.dangerouslySetInnerHTML.__html);
    assert.equal(schema['@graph'][0]['@type'], 'BlogPosting');
  }
});
test('empty and populated service posts both stop before article HTML/schema and metadata', async () => {
  for (const content of ['', '<p>Existing transport service copy</p>']) {
    const post = { ...article, id: 47, content, categories: [{ type: 'service' }] };
    const route = modules(post)('@/app/tin-tuc/[slug]/page');
    await assert.rejects(route.generateMetadata(props), /NEXT_HTTP_ERROR_FALLBACK;404/);
    await assert.rejects(route.default(props), /NEXT_HTTP_ERROR_FALLBACK;404/);
  }
});
test('missing slug and missing category evidence use the existing not-found signal', async () => {
  for (const post of [null, { ...article, categories: undefined }]) {
    const route = modules(post)('@/app/tin-tuc/[slug]/page');
    await assert.rejects(route.generateMetadata(props), /NEXT_HTTP_ERROR_FALLBACK;404/);
    await assert.rejects(route.default(props), /NEXT_HTTP_ERROR_FALLBACK;404/);
  }
});
test('raw post lookup remains available to legacy resolver without changing API contract', async () => {
  const post = { ...article, categories: [{ type: 'service' }] };
  const service = modules(post)('@/services/post.service');
  assert.equal((await service.getPostBySlug(post.slug)).id, post.id);
  assert.equal(service.isNewsPost(post), false);
});
