const { chromium } = require('C:/Users/Малеша Никита/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage();
  const base = pathToFileURL(path.resolve('dist/index.html')).href;
  const lab = pathToFileURL(path.resolve('dist/showcase.html')).href;
  const dashboard = pathToFileURL(path.resolve('dist/dashboard.html')).href;
  const care = pathToFileURL(path.resolve('dist/care.html')).href;
  for (const width of [320, 375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(850);
    const state = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, title: document.title, h1: document.querySelectorAll('h1').length }));
    if (state.width > state.viewport + 1) throw new Error(`Horizontal overflow at ${width}: ${state.width}`);
    if (state.h1 !== 1) throw new Error(`Expected one H1 at ${width}`);
    if (!await page.locator('img[src="./assets/hero-dog.jpg"]').evaluate(img => img.complete && img.naturalWidth > 0)) throw new Error('Hero image failed');
    console.log(`main ${width}px OK`);
    if (width === 375 || width === 1440) await page.screenshot({ path: `qa-main-${width}.png` });
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(lab, { waitUntil: 'domcontentloaded' });
  let state = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, tasks: document.querySelectorAll('section[id^="task-"]').length }));
  if (state.width > state.viewport + 1) throw new Error(`Showcase horizontal overflow: ${state.width}`);
  if (state.tasks !== 15) throw new Error(`Expected 15 tasks, got ${state.tasks}`);
  await page.locator('label[for="lab-menu"]').click();
  if (!await page.locator('#lab-menu').isChecked()) throw new Error('CSS burger failed');
  await page.locator('[data-add-cart]').first().click();
  if (await page.locator('[data-cart-count]').textContent() !== '1') throw new Error('Cart failed');
  await page.locator('[data-theme-toggle]').first().click();
  if (!await page.locator('html').evaluate(el => el.classList.contains('dark'))) throw new Error('Theme toggle failed');
  await page.locator('[data-step-next]').click();
  if (!await page.locator('[data-wizard-status]').textContent()) throw new Error('Wizard validation failed');
  await page.locator('[name="wizard-name"]').fill('Анна');
  await page.locator('[name="wizard-email"]').fill('anna@example.com');
  await page.locator('[data-step-next]').click();
  if (!await page.locator('[data-step-label]').textContent().then(s => s.includes('2 из 4'))) throw new Error('Wizard next failed');
  await page.locator('[data-filter-open]').click();
  if (await page.locator('[data-filter-open]').getAttribute('aria-expanded') !== 'true') throw new Error('Mobile filters failed');
  await page.locator('[data-filter-close]').click();
  await page.locator('[data-modal-open]').click();
  if (!await page.locator('#demo-modal').isVisible()) throw new Error('Modal failed');
  await page.keyboard.press('Escape');
  if (await page.locator('#demo-modal').isVisible()) throw new Error('Modal close failed');
  await page.screenshot({ path: 'qa-showcase-320.png' });
  console.log('showcase 320px, 15 tasks, interactions OK');
  for (const width of [320, 1920, 3840]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(dashboard, { waitUntil: 'domcontentloaded' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    if (overflow) throw new Error(`Dashboard overflow at ${width}`);
    if (width === 320) {
      await page.locator('[data-dashboard-toggle]').click();
      if (await page.locator('[data-dashboard-toggle]').getAttribute('aria-expanded') !== 'true') throw new Error('Dashboard mobile sidebar failed');
    }
    await page.locator('#dashboard-query').fill('Рокки');
    if (await page.locator('#dashboard-result').textContent() !== 'Показано: 1') throw new Error('Dashboard search failed');
    console.log(`dashboard ${width}px OK`);
  }
  for (const width of [320, 375, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(care, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(850);
    const state = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth, labels: document.querySelectorAll('.demo-label').length, fixed: getComputedStyle(document.querySelector('[data-dashboard-sidebar]')).position, sections: document.querySelectorAll('main section').length }));
    if (state.scroll > state.viewport + 1) {
      const offenders = await page.evaluate(() => [...document.querySelectorAll('*')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).slice(0, 12).map(el => ({ tag: el.tagName, id: el.id, className: typeof el.className === 'string' ? el.className.slice(0, 120) : '', right: Math.round(el.getBoundingClientRect().right) })));
      throw new Error(`Care page overflow at ${width}: ${state.scroll}; ${JSON.stringify(offenders)}`);
    }
    if (state.labels || state.sections < 15 || state.fixed !== 'fixed') throw new Error(`Care page missing integrated content at ${width}: ${JSON.stringify(state)}`);
    if (width === 320) {
      await page.locator('[data-dashboard-toggle]').click();
      if (await page.locator('[data-dashboard-toggle]').getAttribute('aria-expanded') !== 'true') throw new Error('Care sidebar failed');
    }
    if (width === 375) {
      await page.locator('#care-search').fill('каталог');
      await page.locator('#care-search').press('Enter');
      if (!await page.locator('#care-search-status').textContent().then(s => s.includes('Найден раздел'))) throw new Error('Care search failed');
      await page.locator('#analytics-search').fill('Рокки');
      if (!await page.locator('[data-analytics-row]').first().isVisible()) throw new Error('Analytics search failed');
    }
    if (width === 375 || width === 1440) await page.screenshot({ path: `qa-care-${width}.png` });
    console.log(`care ${width}px OK`);
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
