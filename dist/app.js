(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function updateThemeIcons() {
    const dark = document.documentElement.classList.contains('dark');
    $$('[data-theme-icon]').forEach(el => { el.textContent = dark ? '☀' : '☾'; });
    $$('[data-theme-toggle]').forEach(el => el.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему'));
  }
  updateThemeIcons();
  $$('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    updateThemeIcons();
  }));

  const menu = $('#mobile-menu');
  if (menu) $$('.peer-checked\\:flex a').forEach(a => a.addEventListener('click', () => { menu.checked = false; }));

  const contact = $('#contact-form');
  contact?.addEventListener('submit', event => {
    event.preventDefault();
    const status = $('#contact-status');
    if (!contact.reportValidity()) { status.textContent = 'Проверьте обязательные поля.'; status.className = 'text-sm text-semantic-danger'; return; }
    const button = $('button[type=submit]', contact);
    button.disabled = true;
    $('[data-submit-label]', contact).textContent = 'Подготавливаем…';
    $('[data-submit-spinner]', contact).classList.remove('hidden');
    status.textContent = '';
    setTimeout(() => {
      button.disabled = false;
      $('[data-submit-label]', contact).textContent = 'Показать заявку';
      $('[data-submit-spinner]', contact).classList.add('hidden');
      status.className = 'text-sm text-semantic-success';
      status.textContent = 'Демо-заявка заполнена. Данные не отправлялись.';
      contact.reset();
    }, 700);
  });

  const follow = $('[data-follow]');
  follow?.addEventListener('click', () => {
    const pressed = follow.getAttribute('aria-pressed') === 'true';
    follow.setAttribute('aria-pressed', String(!pressed));
    follow.textContent = pressed ? 'Follow' : 'Following ✓';
  });
  let cartCount = 0;
  $$('[data-add-cart]').forEach(button => button.addEventListener('click', () => {
    cartCount += 1;
    $('[data-cart-count]').textContent = String(cartCount);
    button.textContent = 'Добавлено ✓';
    setTimeout(() => { button.textContent = 'В корзину'; }, 900);
  }));

  const dashboardToggle = $('[data-dashboard-toggle]');
  dashboardToggle?.addEventListener('click', () => {
    const sidebar = $('[data-dashboard-sidebar]');
    const open = sidebar.classList.toggle('-translate-x-full') === false;
    dashboardToggle.setAttribute('aria-expanded', String(open));
  });
  if ($('#dashboard-query')) {
    const updateRows = () => {
      const query = $('#dashboard-query').value.trim().toLocaleLowerCase('ru');
      const period = $('#dashboard-period').value;
      let count = 0;
      $$('[data-dashboard-row]').forEach(row => {
        const match = row.textContent.toLocaleLowerCase('ru').includes(query) && (period === 'all' || row.dataset.period === period || (period === 'week' && row.dataset.period === 'today'));
        row.hidden = !match;
        if (match) count++;
      });
      $('#dashboard-result').textContent = `Показано: ${count}`;
      $('#dashboard-empty').classList.toggle('hidden', count > 0);
    };
    $('#dashboard-query').addEventListener('input', updateRows);
    $('#dashboard-period').addEventListener('change', updateRows);
  }
  const careSearch = $('#care-search');
  careSearch?.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const query = careSearch.value.trim().toLocaleLowerCase('ru');
    if (!query) return;
    const target = $$('main h2, main h3').find(heading => heading.textContent.toLocaleLowerCase('ru').includes(query));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      $('#care-search-status').textContent = `Найден раздел: ${target.textContent}`;
    } else $('#care-search-status').textContent = 'Раздел не найден';
  });
  if ($('[data-analytics-row]')) {
    const updateAnalytics = () => {
      const query = $('#analytics-search').value.trim().toLocaleLowerCase('ru');
      const period = $('#analytics-period').selectedIndex === 0 ? 'current' : 'previous';
      $$('[data-analytics-row]').forEach(row => { row.hidden = row.dataset.period !== period || !row.textContent.toLocaleLowerCase('ru').includes(query); });
    };
    $('#analytics-search').addEventListener('input', updateAnalytics);
    $('#analytics-period').addEventListener('change', updateAnalytics);
    updateAnalytics();
  }

  const register = $('#register-form');
  const password = $('#reg-password');
  password?.addEventListener('input', () => {
    const value = password.value;
    const score = [value.length >= 8, /[A-ZА-Я]/.test(value) && /[a-zа-я]/.test(value), /\d/.test(value) && /[^\w\sа-яА-Я]/.test(value)].filter(Boolean).length;
    const colors = ['bg-slate-200', 'bg-semantic-danger', 'bg-semantic-warning', 'bg-semantic-success'];
    $$('[data-strength-bar]').forEach((bar, i) => { bar.className = `h-1.5 flex-1 rounded ${i < score ? colors[score] : colors[0]}`; });
    $('[data-strength-text]').textContent = value ? ['Слишком короткий', 'Слабый', 'Средний', 'Сильный'][score] : 'Введите пароль';
  });
  register?.addEventListener('submit', event => {
    event.preventDefault();
    const status = $('[data-register-status]');
    if (!register.reportValidity()) { status.textContent = 'Проверьте поля и согласие.'; status.className = 'text-sm text-semantic-danger'; return; }
    if ($('#reg-password').value !== $('#reg-confirm').value) { $('#reg-confirm').setCustomValidity('Пароли не совпадают'); $('#reg-confirm').reportValidity(); status.textContent = 'Пароли не совпадают.'; status.className = 'text-sm text-semantic-danger'; return; }
    const button = $('button[type=submit]', register);
    button.disabled = true;
    $('[data-register-label]').textContent = 'Создаём…';
    $('[data-register-spinner]').classList.remove('hidden');
    setTimeout(() => {
      button.disabled = false;
      $('[data-register-label]').textContent = 'Создать профиль';
      $('[data-register-spinner]').classList.add('hidden');
      status.textContent = 'Демо-профиль создан. Данные не сохранялись.';
      status.className = 'text-sm text-semantic-success';
      register.reset();
      password.dispatchEvent(new Event('input'));
    }, 700);
  });
  $('#reg-confirm')?.addEventListener('input', event => event.target.setCustomValidity(''));

  const chat = $('#chat-form');
  chat?.addEventListener('submit', event => {
    event.preventDefault();
    const input = $('#chat-input');
    const value = input.value.trim();
    if (!value) return;
    const bubble = document.createElement('p');
    bubble.className = 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 p-3 text-sm text-white';
    bubble.textContent = value;
    $('#chat-messages').append(bubble);
    $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
    input.value = '';
    input.focus();
  });

  const wizard = $('#wizard-form');
  if (wizard) {
    const panels = $$('[data-step-panel]', wizard);
    const indicators = $$('[data-step-indicator]', wizard);
    const back = $('[data-step-back]', wizard);
    const next = $('[data-step-next]', wizard);
    let step = 0;
    function renderStep() {
      panels.forEach((panel, i) => { panel.hidden = i !== step; panel.setAttribute('aria-hidden', String(i !== step)); });
      indicators.forEach((item, i) => { item.dataset.state = i === step ? 'current' : i < step ? 'complete' : 'upcoming'; item.setAttribute('aria-current', i === step ? 'step' : 'false'); });
      $('[data-step-label]', wizard).textContent = `Шаг ${step + 1} из 4`;
      $('[data-step-percent]', wizard).textContent = `${(step + 1) * 25}%`;
      $('[data-step-progress]', wizard).style.width = `${(step + 1) * 25}%`;
      back.disabled = step === 0;
      next.textContent = step === 3 ? 'Завершить' : 'Далее';
      $('[data-wizard-status]', wizard).textContent = '';
      if (step === 3) {
        const data = new FormData(wizard);
        $('[data-wizard-summary]', wizard).textContent = `${data.get('wizard-name') || ''} · ${data.get('wizard-email') || ''} · ${data.get('wizard-city') || ''}, ${data.get('wizard-address') || ''} · Оплата: ${data.get('wizard-payment') === 'visit' ? 'при встрече' : 'обсудить позже'}`;
      }
    }
    back.addEventListener('click', () => { if (step > 0) { step--; renderStep(); } });
    next.addEventListener('click', () => {
      if (step === 3) { $('[data-wizard-status]', wizard).className = 'mt-4 text-sm text-semantic-success'; $('[data-wizard-status]', wizard).textContent = 'Демо-заявка готова. Данные не отправлялись.'; next.disabled = true; return; }
      const invalid = $$('input:invalid', panels[step])[0];
      if (invalid) { $('[data-wizard-status]', wizard).textContent = 'Заполните поля текущего шага.'; invalid.reportValidity(); return; }
      step++; renderStep();
    });
    renderStep();
  }

  const catalog = $('#catalog-grid');
  if (catalog) {
    const items = $$('[data-catalog-item]', catalog);
    let page = 1;
    const perPage = 3;
    function updateCatalog() {
      const category = $('#catalog-category').value;
      const maxPrice = Number($('#catalog-price').value);
      const tags = $$('[data-catalog-tag]:checked').map(input => input.value);
      const sort = $('#catalog-sort').value;
      $('#price-value').textContent = String(maxPrice);
      const matching = items.filter(item => (category === 'all' || item.dataset.category === category) && Number(item.dataset.price) <= maxPrice && (!tags.length || tags.includes(item.dataset.tag)));
      matching.sort((a, b) => sort === 'asc' ? Number(a.dataset.price) - Number(b.dataset.price) : sort === 'desc' ? Number(b.dataset.price) - Number(a.dataset.price) : items.indexOf(a) - items.indexOf(b));
      matching.forEach(item => catalog.append(item));
      if (page > Math.max(1, Math.ceil(matching.length / perPage))) page = 1;
      items.forEach(item => item.classList.add('hidden'));
      matching.slice((page - 1) * perPage, page * perPage).forEach(item => item.classList.remove('hidden'));
      $('#catalog-empty').classList.toggle('hidden', matching.length > 0);
      $('#catalog-count').textContent = String(matching.length);
      $$('[data-page]').forEach((button, i) => { button.disabled = matching.length <= i * perPage; button.className = `${i + 1 === page ? 'btn-primary' : 'btn-secondary'} btn-sm`; button.setAttribute('aria-current', i + 1 === page ? 'page' : 'false'); });
    }
    ['#catalog-category', '#catalog-price', '#catalog-sort'].forEach(selector => $(selector).addEventListener('input', () => { page = 1; updateCatalog(); }));
    $$('[data-catalog-tag]').forEach(input => input.addEventListener('change', () => { page = 1; updateCatalog(); }));
    $$('[data-page]').forEach(button => button.addEventListener('click', () => { page = Number(button.dataset.page); updateCatalog(); }));
    updateCatalog();
    const filters = $('#catalog-filters');
    const backdrop = $('#catalog-backdrop');
    const openButton = $('[data-filter-open]');
    function closeFilters() { filters.classList.add('translate-y-full'); backdrop.classList.add('hidden'); openButton.setAttribute('aria-expanded', 'false'); }
    openButton.addEventListener('click', () => { filters.classList.remove('translate-y-full'); backdrop.classList.remove('hidden'); openButton.setAttribute('aria-expanded', 'true'); $('[data-filter-close]').focus(); });
    $('[data-filter-close]').addEventListener('click', closeFilters);
    backdrop.addEventListener('click', closeFilters);
    $('#catalog-load').addEventListener('click', () => { const skeleton = $('#catalog-skeleton'); skeleton.classList.remove('hidden'); skeleton.classList.add('grid'); setTimeout(() => { skeleton.classList.add('hidden'); skeleton.classList.remove('grid'); }, 1000); });
  }

  const modal = $('#demo-modal');
  if (modal) {
    let previousFocus;
    const close = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); previousFocus?.focus(); };
    $('[data-modal-open]').addEventListener('click', event => { previousFocus = event.currentTarget; modal.classList.remove('hidden'); modal.classList.add('flex'); $('[data-modal-close]', modal).focus(); });
    $$('[data-modal-close]', modal).forEach(button => button.addEventListener('click', close));
    modal.addEventListener('click', event => { if (event.target === modal) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.classList.contains('hidden')) close(); });
  }
})();
