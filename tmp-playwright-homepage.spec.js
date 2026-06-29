const { test, chromium } = require('@playwright/test');

test('homepage network', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/api/api') || url.includes('/backend-api/api/api') || response.status() >= 400) {
      errors.push({ status: response.status(), url });
    }
  });
  page.on('pageerror', (error) => errors.push({ pageerror: error.message }));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push({ console: message.text() });
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
  const title = await page.title();
  const body = await page.locator('body').innerText({ timeout: 10000 }).catch(() => '');
  console.log(JSON.stringify({
    title,
    menuLoaded: body.includes('Đăng nhập') || body.includes('Đăng Nhập') || body.includes('Hotline'),
    badRequests: requests.filter((url) => url.includes('/api/api') || url.includes('/backend-api/api/api')),
    apiRequests: requests.filter((url) => url.includes('api.localhost') || url.includes('/backend-api')).slice(0, 80),
    errors: errors.slice(0, 30),
  }, null, 2));
  await browser.close();
});
