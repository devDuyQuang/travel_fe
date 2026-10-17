const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/serviceDescription.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, { exports: exportsObject, require });
const { sanitizeServiceDescription: sanitize, resolveServiceDescription: resolve } = exportsObject;

test('CMS content wins; only one description is selected', () => {
  assert.equal(resolve('<p>CMS editor copy</p>', '<p>Legacy</p>'), '<p>CMS editor copy</p>');
});
test('empty editor markup and unsafe-only content use ordered editorial fallbacks', () => {
  for (const empty of [null, '', ' ', '<p><br></p>', '<p>&nbsp;</p>', '<script>alert(1)</script>']) {
    assert.equal(resolve(empty, '', '<p>Editorial</p>', '<p>Long</p>'), '<p>Editorial</p>');
  }
  assert.equal(resolve('', 'demo content', '<p>Long description</p>'), '<p>Long description</p>');
  assert.equal(resolve('', '', ''), '');
});
test('mixed headings, paragraphs, lists, emphasis and canonical internal links survive', () => {
  const html = '<h2>Course</h2><p><strong>Golf</strong> and <em>travel</em></p><h3>Included</h3><ul><li>Caddie</li></ul><ol><li>Book</li></ol><p><a href="/dich-vu/dat-tee-time">Tee time</a></p>';
  assert.equal(sanitize(html), html);
  assert.equal(sanitize('<h1>Title</h1><p>Text</p>'), '<h2>Title</h2><p>Text</p>');
});
test('active content, event handlers, styles and unsafe link schemes are removed', () => {
  const html = '<script>alert(1)</script><style>body{display:none}</style><iframe src="x">hidden</iframe><svg onload="alert(1)">hidden</svg><p onclick="alert(1)" style="position:fixed">Safe<img src="x" onerror="alert(1)"></p><a href="java&#x73;cript:alert(1)">Bad</a><a href="data:text/html,evil">Data</a><a href="//evil.test">Relative host</a>';
  assert.equal(sanitize(html), '<p>Safe</p><a>Bad</a><a>Data</a><a>Relative host</a>');
  assert.equal(sanitize('<a href="https://example.com" target="_blank" title="Details">Details</a>'), '<a href="https://example.com" title="Details">Details</a>');
});
test('sanitization is stable for hydration and malformed HTML', () => {
  const result = sanitize('<p>Hello<ul><li>One</li></ul><a href="javascript:alert(1)">Link</a>');
  assert.equal(sanitize(result), result);
  assert.ok(!result.includes('javascript:'));
});

test('tee-time component renders rich text once and preserves original vertical editorial images and notes', () => {
  const componentExports = {};
  const source = fs.readFileSync('src/components/features/feature-details-one/about/AboutText.tsx', 'utf8');
  const dependencies = (name) => {
    if (name === 'yet-another-react-lightbox') return () => null;
    if (name.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (name === '@/lib/serviceDescription') return exportsObject;
    if (name === '@/lib/servicePrice') return { resolveProductBookingType: () => 'tee_time' };
    if (name === '@/services/post.service') return { resolveMediaUrl: (url) => url };
    if (name.startsWith('@/')) {
      const base = 'src/' + name.slice(2);
      const file = fs.existsSync(base + '.ts') ? base + '.ts' : base + '.tsx';
      const result = {};
      vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      }).outputText, { exports: result, require: dependencies, process, URL });
      return result;
    }
    if (name === './contentData') return dependencies('@/components/services/content/contentData');
    return require(name);
  };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, { exports: componentExports, require: dependencies });
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const html = renderToStaticMarkup(React.createElement(componentExports.default, { product: {
    name: 'Test course', content: '<h2>CMS heading</h2><p>Editor copy</p><ul><li>Included</li></ul>',
    gallery: ['/course.jpg'], attributes: { editorial_description: '<p>Old copy</p>', editorial_gallery_captions: ['Verified caption'], editorial_dress_code: ['Golf shoes'] },
  } }));
  assert.equal(html.split('CMS heading').length - 1, 1);
  assert.ok(html.includes('<ul><li>Included</li></ul>'));
  assert.ok(!html.includes('Old copy'));
  assert.ok(!html.includes('<h1'));
  assert.ok(html.includes('Golf shoes'));
  assert.ok(html.includes('Verified caption') && html.includes('/course.jpg'));
  assert.ok(html.includes('class="tee-time-about-media"'));
});
