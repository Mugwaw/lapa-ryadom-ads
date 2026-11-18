# Лапа рядом

Учебный адаптивный лендинг передержки животных и демонстрация всех 15 заданий «День 9–10» по Tailwind CSS.

## Страницы

- `dist/index.html` — полный лендинг: навигация, hero, преимущества, отзывы со snap-прокруткой, тарифы, FAQ и форма.
- `dist/showcase.html` — задания 1.1–4.4. Пункты 1.2, 2.1, 2.2 и 3.3 показывают соответствующие готовые части главной страницы.
- `dist/dashboard.html` — полноэкранная панель для заданий 2.3 и 4.1 с фиксированной боковой навигацией.
- `dist/care.html` — цельная третья страница: все компоненты вписаны в пространство передержки без номеров и подписей заданий.
- `dist/cabinet.html` — связанный с лендингом кабинет питомцев на Vue 3: импорт Excel, таблица с поиском и редактированием, журнал изменений.
- `dist/auth.html` — демонстрационные формы входа и регистрации, связанные с кабинетом. Имя и почта хранятся в браузере; пароль не сохраняется и не проверяется.
- `dist/rooms.html` — адаптивная страница номеров и повседневного ухода по отдельному HTML-макету из папки `pr` на рабочем столе.

Фотографии каталога взяты из Wikimedia Commons: [мяч](https://commons.wikimedia.org/wiki/File:Maltipoo_dog_running_to_return_a_tennis_ball_(12012).jpg), [миска](https://commons.wikimedia.org/wiki/File:Blue_Slow_Feeder_Dog_Bowl_with_Raised_Studs_and_Ridges.jpg), [плед](https://commons.wikimedia.org/wiki/File:Blanket_Fiber.jpg), [поводок](https://commons.wikimedia.org/wiki/File:PPD-Leash-PinkGreenStripes.jpg), [корм](https://commons.wikimedia.org/wiki/File:Dog_food_in_a_bowl.jpg), [игрушка](https://commons.wikimedia.org/wiki/File:Tabby_Cat_with_Toy_Mouse.jpg), [лежанка](https://commons.wikimedia.org/wiki/File:Black_cat_lying_on_a_blue_bed_quilt.jpg), [переноска](https://commons.wikimedia.org/wiki/File:Ruffit_Dog_Carrier.jpg). Фотографии иллюстративные; товары и цены в каталоге демонстрационные.

## Запуск

```sh
pnpm install
pnpm build
```

После сборки запустите статический HTTP-сервер в `dist`: рекламный блок на главной странице использует модуль Vue и требует HTTP. Стили собираются из `src/input.css`; палитра, `darkMode: 'class'` и кастомная утилита `scrollbar-thin` находятся в `tailwind.config.js`.

Рекламный плейсхолдер находится в `src/AdSlot.vue`, монтируется через `src/ad-slot-main.js` и собирается Vite в `dist/ad-slot.js`. Для Cloudflare Pages: build command `npm run build`, output directory `dist`, base `/`. Отчёт о выборе хостинга и скриншот — в `reports/`.

Кабинет адаптирован из предоставленного макета `lapkidom-vue/pr`: общий бренд, цвета и переходы связаны с главным сайтом; исходная логика перенесена в `src/cabinet-main.js`, а Excel читается локально с помощью `xlsx`. Это учебный интерфейс без сервера: записи и журнал сохраняются в `localStorage` данного браузера. Страница входа имитирует сессию через `sessionStorage`; это заглушка, которая не защищает данные и не выполняет реальную проверку пароля.

Опубликованная учебная версия: https://mugwaw.github.io/lapa-ryadom-ads/ (GitHub Pages). Автоматическая сборка и публикация настроены в `.github/workflows/pages.yml`.

Все демонстрационные цены показаны в белорусских рублях (BYN). Пересчёт выполнен 18 ноября 2026 года по официальному курсу Национального банка Беларуси: 100 RUB = 3,6459 BYN; суммы округлены до двух знаков после запятой. Источник: https://api.nbrb.by/exrates/rates/RUB?parammode=2&ondate=2026-11-18.

## Проверка

`node qa.cjs` проверяет в Chrome ширины 320, 375, 768, 1440, 1920 и 3840 px, горизонтальное переполнение, количество заданий и несколько интерактивных состояний. Для запуска нужен Chrome по пути, указанному в `qa.cjs`.

Формы, чат, корзина, каталог и аналитика работают как демонстрационный интерфейс. Данные не отправляются и не сохраняются. Цены, отзывы и имя куратора вымышлены.
