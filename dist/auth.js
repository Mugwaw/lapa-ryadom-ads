(() => {
  const accountKey = 'lapa-demo-account-v1';
  const sessionKey = 'lapa-demo-session-v1';
  const $ = selector => document.querySelector(selector);
  const tabs = { login: $('#tab-login'), register: $('#tab-register') };
  const panels = { login: $('#panel-login'), register: $('#panel-register') };
  const status = $('#auth-status');

  function selectTab(which) {
    for (const key of Object.keys(tabs)) {
      const selected = key === which;
      tabs[key].setAttribute('aria-selected', String(selected));
      tabs[key].classList.toggle('bg-white', selected);
      tabs[key].classList.toggle('shadow-sm', selected);
      tabs[key].classList.toggle('dark:bg-slate-800', selected);
      panels[key].classList.toggle('hidden', !selected);
    }
    status.textContent = '';
    history.replaceState(null, '', which === 'register' ? '#register' : '#login');
  }

  tabs.login.addEventListener('click', () => selectTab('login'));
  tabs.register.addEventListener('click', () => selectTab('register'));
  if (location.hash === '#register') selectTab('register');

  try {
    const account = JSON.parse(localStorage.getItem(accountKey) || 'null');
    if (account?.email) $('#login-email').value = account.email;
  } catch (_) {}

  function finish(name, email, action) {
    try {
      const account = { name, email };
      localStorage.setItem(accountKey, JSON.stringify(account));
      sessionStorage.setItem(sessionKey, JSON.stringify(account));
      status.className = 'mt-4 text-sm text-semantic-success';
      status.textContent = `${action}. Открываем кабинет…`;
      window.setTimeout(() => { window.location.href = './cabinet.html'; }, 450);
    } catch (_) {
      status.className = 'mt-4 text-sm text-semantic-danger';
      status.textContent = 'Браузер не разрешил сохранить демо-сессию. Проверьте настройки хранения данных.';
    }
  }

  $('#login-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const email = $('#login-email').value.trim().toLowerCase();
    let name = email.split('@')[0];
    try {
      const saved = JSON.parse(localStorage.getItem(accountKey) || 'null');
      if (saved?.email === email && saved?.name) name = saved.name;
    } catch (_) {}
    finish(name, email, 'Демо-вход выполнен');
  });

  $('#register-auth-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if ($('#register-password').value !== $('#register-confirm').value) {
      $('#register-confirm').setCustomValidity('Пароли не совпадают');
      $('#register-confirm').reportValidity();
      status.className = 'mt-4 text-sm text-semantic-danger';
      status.textContent = 'Пароли не совпадают.';
      return;
    }
    finish($('#register-name').value.trim(), $('#register-email').value.trim().toLowerCase(), 'Демо-регистрация завершена');
  });
  $('#register-confirm').addEventListener('input', event => event.target.setCustomValidity(''));
})();
