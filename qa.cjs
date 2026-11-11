const { chromium } = require('C:/Users/Малеша Никита/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage();
  const base = pathToFileURL(path.resolve('dist/index.html')).href;
  const lab = pathToFileURL(path.resolve('dist/showcase.html')).href;
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
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
