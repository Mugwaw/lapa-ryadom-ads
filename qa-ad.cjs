const { chromium } = require('C:/Users/Малеша Никита/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, 'dist')
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end()
  const type = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'
  fs.createReadStream(file).on('error', () => res.writeHead(404).end()).once('open', () => res.writeHead(200, { 'Content-Type': type })).pipe(res)
})

;(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' })
    const slot = page.getByText('Рекламное место')
    await slot.waitFor({ timeout: 5000 }).catch(error => {
      throw new Error(`${error.message}\nBrowser errors: ${errors.join('; ')}\nHTML title: ${page.url()}`)
    })
    await slot.scrollIntoViewIfNeeded()
    await page.screenshot({ path: path.join(__dirname, 'reports', 'ad-slot-desktop.png') })
    if (errors.length) throw new Error(errors.join('\n'))
    console.log('Ad slot rendered; no browser errors; screenshot: reports/ad-slot-desktop.png')
  } finally {
    await browser.close()
    server.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
