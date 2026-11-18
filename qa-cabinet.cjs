const { chromium } = require('C:/Users/Малеша Никита/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const XLSX = require('xlsx')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, 'dist')
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (pathname === '/favicon.ico') return res.writeHead(204).end()
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end()
  const type = /\.(js|mjs)$/.test(file) ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream'
  fs.createReadStream(file).on('error', () => res.writeHead(404).end()).once('open', () => res.writeHead(200, { 'Content-Type': type })).pipe(res)
})

;(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto(origin, { waitUntil: 'networkidle' })
    await page.locator('header nav a[href="./cabinet.html"]').first().click()
    await page.waitForURL('**/cabinet.html')
    await page.getByRole('heading', { name: 'Всё о питомцах — рядом' }).waitFor({ timeout: 5000 }).catch(async error => { throw new Error(`${error.message}\n${errors.join('; ')}\nBody: ${(await page.locator('body').innerText()).slice(0, 200)}\nURL: ${page.url()}`) })
    await page.screenshot({ path: path.join(__dirname, 'reports', 'cabinet-desktop.png') })

    await page.getByRole('button', { name: /Таблица данных/ }).click()
    await page.getByRole('button', { name: '＋ Добавить запись' }).click()
    await page.locator('.edit-modal input').nth(0).fill('Барни')
    await page.locator('.edit-modal input').nth(1).fill('Собака')
    await page.locator('.edit-modal input').nth(2).fill('Анна')
    await page.getByRole('button', { name: 'Сохранить' }).click()
    await page.getByRole('cell', { name: 'Барни' }).waitFor()
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Таблица данных/ }).click()
    await page.getByRole('cell', { name: 'Барни' }).waitFor()

    await page.getByRole('button', { name: /Загрузка Excel/ }).click()
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{ 'Имя питомца': 'Мурка', Вид: 'Кошка' }]), 'Питомцы')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    await page.locator('input[type=file]').setInputFiles({ name: 'pets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer })
    await page.getByRole('cell', { name: 'Мурка' }).waitFor()
    await page.getByRole('button', { name: /Журнал действий/ }).click()
    await page.getByText('Импорт файла «pets.xlsx» (1 строк)').waitFor()

    await page.setViewportSize({ width: 375, height: 812 })
    await page.getByRole('button', { name: /Главная/ }).click()
    await page.screenshot({ path: path.join(__dirname, 'reports', 'cabinet-mobile.png') })
    const width = await page.evaluate(() => document.documentElement.scrollWidth)
    if (width > 376) throw new Error(`Mobile horizontal overflow: ${width}`)
    if (errors.length) throw new Error(errors.join('\n'))
    console.log('Cabinet navigation, CRUD, persistence, Excel import, journal and mobile layout passed')
  } finally {
    await browser.close()
    server.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
