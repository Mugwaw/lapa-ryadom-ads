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
  if (task === '1-3') section = section.replace('Шесть демонстрационных товаров. Кнопка обновляет счётчик корзины.', 'Выберите знакомые вещи для отдыха и игр. Кнопка обновляет счётчик корзины.');
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
  if (task === '4-4') {
    const wording = [
      ['Компоненты «Лапа рядом»', 'Настройки пространства'],
      ['Цвета бренда и семантика', 'Цветовые статусы'],
      ['>brand</span>', '>Фирменный</span>'],
      ['>success</span>', '>Готово</span>'],
      ['>warning</span>', '>Внимание</span>'],
      ['>danger</span>', '>Ошибка</span>'],
      ['>info</span>', '>Информация</span>'],
      ['Типографика', 'Тексты интерфейса'],
      ['Заголовок H1', 'Лапа рядом'],
      ['Заголовок H2', 'Ваше пространство'],
      ['Основной текст: понятный, спокойный, с комфортной длиной строки.', 'Тёплые слова и ясные инструкции помогают заботиться без лишних вопросов.'],
      ['Кнопки · варианты и размеры', 'Действия'],
      ['Primary sm', 'Сохранить'],
      ['Primary md', 'Продолжить'],
      ['Primary lg', 'Записаться'],
      ['>Secondary</button>', '>Подробнее</button>'],
      ['>Ghost</button>', '>Отмена</button>'],
      ['>Danger</button>', '>Удалить</button>'],
      ['>Disabled</button>', '>Недоступно</button>'],
      ['Поля и переключатели', 'Настройки уведомлений'],
      ['>Поле<input', '>Имя питомца<input'],
      ['placeholder="Введите значение"', 'placeholder="Например, Рокки"'],
      ['> Чекбокс</label>', '> Получать обновления</label>'],
      ['> Toggle</label>', '> Напоминания</label>'],
      ['Badge, Alert, Card', 'Уведомления и карточки'],
      ['>Новый</span>', '>Новый питомец</span>'],
      ['Информационное сообщение.', 'Данные питомца можно обновить в любое время.'],
      ['>Карточка</h5>', '>Питомец</h5>'],
      ['Универсальный компонент поверхности.', 'Важные сведения о вашем друге.'],
      ['>Modal</h4>', '>Подтверждение</h4>'],
      ['Открыть окно', 'Показать сообщение']
    ];
    for (const [before, after] of wording) section = section.replace(before, after);
  }
  return section;
};
const buttonMatrix = balanced(gallery, '<section class="pb-16" aria-labelledby="button-matrix-title"', 'section')
  .replace('4.4 · Размеры каждого варианта кнопки', 'Размеры элементов управления')
  .replace('>Primary</span>', '>Основные</span>')
  .replace('>Secondary</span>', '>Дополнит.</span>')
  .replace('>Ghost</span>', '>Текстовые</span>')
  .replace('>Danger</span>', '>Удаление</span>');
const modal = balanced(gallery, '<div id="demo-modal"', 'div')
  .replace('Пример модального окна', 'Сообщение от клуба')
  .replace('Окно закрывается кнопкой, клавишей Escape или нажатием на фон.', 'Спасибо, что заботитесь о своём питомце. Вы всегда можете вернуться к его данным.');
const footer = balanced(landing, '<footer class=', 'footer')
  .replace('Все 15 заданий', 'Пространство заботы')
  .replaceAll('./showcase.html', './care.html')
  .replace('Открыть демонстрацию →', 'Открыть пространство →')
  .replace('Учебный лендинг передержки животных, созданный для заданий по Tailwind CSS.', 'Удобное пространство для знакомства, ухода и общения о питомцах.')
  .replace('Адаптивная вёрстка · Tailwind CSS 3.4 · доступные состояния интерфейса.', 'Забота о питомцах начинается с внимания к деталям.');

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#fffaf1"><meta name="description" content="Пространство заботы Лапа рядом: услуги, каталог, личный кабинет и оформление передержки животных"><title>Пространство заботы — Лапа рядом</title><script>try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}</script><link rel="stylesheet" href="./styles.css"><script defer src="./app.js"></script></head>
<body><a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3">Перейти к содержимому</a>
<div data-dashboard>
<aside data-dashboard-sidebar class="fixed inset-y-0 left-0 z-50 h-screen w-64 -translate-x-full overflow-y-auto bg-brand-900 p-6 text-white shadow-soft transition-transform duration-300 md:translate-x-0" aria-label="Боковая навигация"><a class="font-display text-2xl font-bold" href="./index.html">✿ Лапа рядом</a><p class="mt-2 text-xs text-brand-200">Пространство заботы</p><nav class="mt-10 space-y-1 text-sm" aria-label="Разделы пространства"><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#top">Главная</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#services">Забота</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#catalog">Каталог</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#workspace">Кабинет</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="#booking">Оформить</a><a class="block rounded-xl px-4 py-3 hover:bg-white/15" href="./index.html">О сайте ↗</a></nav><div class="mt-10 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed text-brand-100">Это учебный макет. Сообщения, заявки и платежи никуда не отправляются.</div></aside>
<div class="min-w-0 md:ml-64"><header class="sticky top-0 z-50 border-b border-brand-100 bg-cream/90 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90"><nav class="container-page relative flex min-h-16 items-center justify-between gap-3" aria-label="Основная навигация"><button data-dashboard-toggle type="button" class="btn-ghost btn-sm md:hidden" aria-expanded="false" aria-label="Открыть боковое меню">☰</button><a class="shrink-0 font-display text-lg font-bold text-brand-800 dark:text-brand-100" href="#top">✿ Лапа рядом</a><div class="hidden items-center gap-4 text-xs font-semibold lg:flex"><a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div><div class="ml-auto flex items-center gap-1"><button data-theme-toggle type="button" class="btn-ghost btn-sm" aria-label="Переключить цветовую тему"><span data-theme-icon>☾</span></button><a class="btn-primary btn-sm" href="#register">Sign In</a></div><input id="mobile-menu" type="checkbox" class="peer sr-only lg:hidden" aria-label="Открыть мобильное меню"><label for="mobile-menu" class="cursor-pointer rounded-lg border border-brand-200 px-3 py-2 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 lg:hidden dark:border-slate-600">⋯</label><div class="absolute left-2 right-2 top-full hidden flex-col gap-2 rounded-xl border bg-white p-4 shadow-soft peer-checked:flex lg:hidden dark:border-slate-700 dark:bg-slate-800"><a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div></nav><div class="container-page flex items-center gap-3 pb-3"><label class="min-w-0 flex-1"><span class="sr-only">Поиск по разделам</span><input id="care-search" class="field !py-2" type="search" placeholder="Поиск по пространству"></label><span class="grid size-9 shrink-0 place-items-center rounded-full bg-brand-200 text-sm font-bold text-brand-900" aria-label="Профиль куратора">А</span><span id="care-search-status" class="sr-only" role="status" aria-live="polite"></span></div></header>
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
${fromGallery('2-4', 'register', { tint: true })}
${fromGallery('4-2', 'application')}
${fromLanding('faq')}
${fromLanding('contact')}
${fromGallery('4-4', 'settings', { tint: true })}
${buttonMatrix}
</main>${footer}</div></div>${modal}</body></html>`;
const responsiveHtml = html
  .replace('class="btn-primary btn-sm" href="#register">Sign In</a>', 'class="btn-primary btn-sm hidden sm:inline-flex" href="#register">Sign In</a>')
  .replace('<a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></div></nav>', '<a href="#top">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a><a href="#register">Sign In</a></div></nav>');
fs.writeFileSync(path.join(root, 'dist/care.html'), responsiveHtml);
console.log('Created dist/care.html');
