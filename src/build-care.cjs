const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const landing = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const gallery = fs.readFileSync(path.join(root, 'dist/showcase.html'), 'utf8');

function balanced(source, marker, tag) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${marker}`);
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  re.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = re.exec(source))) {
    depth += match[0].startsWith(`</`) ? -1 : 1;
    if (depth === 0) return source.slice(start, re.lastIndex);
  }
  throw new Error(`Unclosed ${marker}`);
}
const fromLanding = id => balanced(landing, `<section id="${id}"`, 'section');
const fromGallery = (task, id, options = {}) => {
  let section = balanced(gallery, `<section id="task-${task}"`, 'section');
  section = section.replace(`id="task-${task}"`, `id="${id}"`)
    .replaceAll(`#task-${task}`, `#${id}`)
    .replaceAll('./index.html#contact', '#contact')
    .replace(/<span class="demo-label">[^<]*<\/span>/, '')
    .replace('class="lab-section"', `class="section-pad${options.tint ? ' bg-brand-50 dark:bg-slate-800/50' : ''}"`)
    .replace(/<p class="text-xs text-slate-500">Компоненты описаны в[\s\S]*?<\/p>/, '<p class="text-xs text-slate-500">Единые цвета, типографика и компоненты помогают сохранять узнаваемый стиль клуба.</p>');
  if (task === '1-3') section = section.replace('Восемь товаров для отдыха и игр. Кнопка обновляет счётчик корзины.', 'Выберите знакомые вещи для отдыха и игр. Кнопка обновляет счётчик корзины.');
  if (task === '1-1') section = section.replace('>Follow</button>', '>Подписаться</button>').replace('>Message</a>', '>Написать</a>');
  if (task === '3-2') section = section.replace('>To Do ', '>К выполнению ').replace('>In Progress ', '>В работе ').replace('>Done ', '>Готово ');
  if (task === '4-3') section = section
    .replace('class="fixed inset-x-0 bottom-0 z-[60] translate-y-full', 'class="fixed inset-x-0 bottom-0 z-[60] self-start translate-y-full')
    .replace('class="@container min-w-0"', 'class="min-w-0"')
    .replace('class="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3"', 'class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"')
    .replaceAll('aspect-square', 'h-36')
    .replaceAll('text-6xl', 'text-5xl')
    .replace(/bg-(?:amber|purple|orange|sky|lime|rose)-100/g, 'bg-brand-100 dark:bg-slate-700')
    .replace('Показать skeleton-загрузку', 'Показать загрузку');
  if (task === '2-4') section = section.replace('Создать демо-профиль', 'Создайте профиль');
  if (task === '4-1') {
    section = section
      .replace(/<aside class="col-span-12[^>]*>[\s\S]*?<\/aside>/, '')
      .replace('class="col-span-12 min-w-0 sm:col-span-9"', 'class="col-span-12 min-w-0"')
      .replace('<select class="field !w-auto !py-2" aria-label="Период">', '<select id="analytics-period" class="field !w-auto !py-2" aria-label="Период">')
      .replace('<tbody>', '<tbody data-analytics-body>');
    section = section.replace(/(<tbody data-analytics-body>)([\s\S]*?)(<\/tbody>)/, (_, open, body, close) => {
      let rowNumber = 0;
      return open + body.replace(/<tr(?= class=|>)/g, () => `<tr data-analytics-row data-period="${rowNumber++ < 2 ? 'current' : 'previous'}"`) + close;
    });
  }
  return section.replaceAll('>Email</label>', '>Эл. почта</label>')
    .replaceAll('>Email<input', '>Эл. почта<input')
    .replaceAll('Введите корректный email.', 'Введите корректный адрес почты.');
};
const footer = balanced(landing, '<footer class=', 'footer')
  .replace('Уход, каталог и запись</a>', 'Главная страница</a>')
  .replace('Посмотреть уход и каталог →', 'Вернуться на главную →')
  .replaceAll('href="./care.html"', 'href="./index.html"')
  .replace('Учебный лендинг передержки животных, созданный для заданий по Tailwind CSS.', 'Удобное пространство для знакомства, ухода и общения о питомцах.')
  .replace('Адаптивная вёрстка · Tailwind CSS 3.4 · доступные состояния интерфейса.', 'Забота о питомцах начинается с внимания к деталям.');

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#fffaf1"><meta name="description" content="Уход, каталог и запись Лапа рядом: услуги, вещи для питомцев и оформление передержки"><title>Уход, каталог и запись — Лапа рядом</title><script>try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}</script><link rel="stylesheet" href="./styles.css"><script defer src="./app.js"></script></head>
<body><a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3">Перейти к содержимому</a>
<div data-dashboard>
<aside data-dashboard-sidebar class="fixed inset-y-0 left-0 z-50 h-screen w-64 -translate-x-full overflow-y-auto bg-brand-900 p-6 text-white shadow-soft transition-transform duration-300 md:translate-x-0" aria-label="Боковая навигация"><a class="font-display text-2xl font-bold" href="./index.html">✿ Лапа рядом</a><p class="mt-2 text-xs text-brand-200">Уход, каталог и запись</p><nav class="mt-10 space-y-1 text-sm" aria-label="Разделы ухода и записи"><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#top">Главная</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#services">Забота</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#catalog">Каталог</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#workspace">Кабинет</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#booking">Оформить</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="./index.html">О сайте ↗</a></nav><div class="mt-10 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed text-brand-100">Это учебный макет. Сообщения, заявки и платежи никуда не отправляются.</div></aside>
<div class="min-w-0 md:ml-64"><header class="sticky top-0 z-50 border-b border-brand-100 bg-cream/90 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90"><nav class="container-page relative flex min-h-16 items-center justify-between gap-3" aria-label="Основная навигация"><button data-dashboard-toggle type="button" class="btn-ghost btn-sm md:hidden" aria-expanded="false" aria-label="Открыть боковое меню">☰</button><a class="shrink-0 font-display text-lg font-bold text-brand-800 dark:text-brand-100" href="#top">✿ Лапа рядом</a><div class="hidden items-center gap-4 text-xs font-semibold lg:flex"><a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div><div class="ml-auto flex items-center gap-1"><button data-theme-toggle type="button" class="btn-ghost btn-sm" aria-label="Переключить цветовую тему"><span data-theme-icon>☾</span></button><a class="btn-primary btn-sm" href="#register">Sign In</a></div><input id="mobile-menu" type="checkbox" class="peer sr-only lg:hidden" aria-label="Открыть мобильное меню"><label for="mobile-menu" class="cursor-pointer rounded-lg border border-brand-200 px-3 py-2 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 lg:hidden dark:border-slate-600">⋯</label><div class="absolute left-2 right-2 top-full hidden flex-col gap-2 rounded-xl border bg-white p-4 shadow-soft peer-checked:flex lg:hidden dark:border-slate-700 dark:bg-slate-800"><a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div></nav><div class="container-page flex items-center gap-3 pb-3"><label class="min-w-0 flex-1"><span class="sr-only">Поиск по разделам</span><input id="care-search" class="field !py-2" type="search" placeholder="Поиск по разделам"></label><span class="grid size-9 shrink-0 place-items-center rounded-full bg-brand-200 text-sm font-bold text-brand-900" aria-label="Профиль куратора">А</span><span id="care-search-status" class="sr-only" role="status" aria-live="polite"></span></div></header>
<main id="main">
${fromLanding('top')}
${fromLanding('about')}
${fromLanding('services')}
${fromGallery('1-1', 'team', { tint: true })}
${fromGallery('1-3', 'shop')}
${fromLanding('stories')}
${fromLanding('prices')}
<div id="workspace" class="container-page pt-16"><p class="section-kicker">Личный кабинет</p><h2 class="section-title">Всё важное — в одном месте</h2><p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Следите за делами, общайтесь и готовьте пространство для питомцев.</p></div>
${fromGallery('4-1', 'analytics', { tint: true })}
${fromGallery('3-2', 'board')}
${fromGallery('3-1', 'chat', { tint: true })}
${fromGallery('4-3', 'catalog')}
<div id="booking" class="container-page pt-16"><p class="section-kicker">Начать знакомство</p><h2 class="section-title">Подготовим всё вместе</h2><p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Создайте профиль, заполните сведения и расскажите о своём питомце.</p></div>
<section id="register" class="section-pad bg-brand-50 dark:bg-slate-800/50"><div class="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p class="section-kicker">Кабинет питомцев</p><h3 class="font-display text-3xl sm:text-4xl">Начните с демо-профиля</h3><p class="mt-3 max-w-xl text-slate-600 dark:text-slate-300">Попробуйте вход или регистрацию и перейдите к записям о питомцах. Аккаунт существует только в этом браузере.</p></div><a class="btn-primary" href="./auth.html#register">Регистрация и вход →</a></div></section>
${fromGallery('4-2', 'application')}
${fromLanding('faq')}
${fromLanding('contact')}
</main>${footer}</div></div></body></html>`;
const responsiveHtml = html
  .replace('class="btn-primary btn-sm" href="#register">Sign In</a>', 'class="btn-primary btn-sm hidden sm:inline-flex" href="#register">Sign In</a>')
  .replace('<a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div></nav>', '<a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a><a href="#register">Sign In</a></div></nav>')
  .replaceAll('href="#workspace">Кабинет', 'href="./cabinet.html">Кабинет')
  .replaceAll('href="#register">Sign In', 'href="./auth.html#login">Войти')
  .replaceAll('>Home</a>', '>Главная</a>')
  .replaceAll('>About</a>', '>О нас</a>')
  .replaceAll('<a href="#services">Services</a>', '<a href="#services">Уход</a><a href="#catalog">Каталог</a>')
  .replaceAll('>Contact</a>', '>Контакты</a>')
  .replace('href="#services">Забота</a>', 'href="#services">Забота</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="./rooms.html">Номера</a>')
  .replace('Следите за делами, общайтесь и готовьте пространство для питомцев.</p></div>', 'Следите за делами, общайтесь и готовьте пространство для питомцев.</p><a class="btn-primary mt-6" href="./cabinet.html">Открыть кабинет питомцев →</a></div>');
fs.writeFileSync(path.join(root, 'dist/care.html'), responsiveHtml);
console.log('Created dist/care.html');
