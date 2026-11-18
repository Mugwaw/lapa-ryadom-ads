import { createApp } from 'vue/dist/vue.esm-bundler.js';
import * as XLSX from 'xlsx';

const STORE_KEY = 'lapa-ryadom-cabinet-v1';
const SESSION_KEY = 'lapa-demo-session-v1';

createApp({

  // --- Состояние компонента ---
  data() { return {
    page: 'home',
    nav: [
      { id: 'home', icon: '⌂', label: 'Главная' },
      { id: 'upload', icon: '⇧', label: 'Загрузка Excel' },
      { id: 'data', icon: '▤', label: 'Таблица данных' },
      { id: 'logs', icon: '◷', label: 'Журнал действий' }
    ],
    headers: ['Имя питомца', 'Вид', 'Хозяин', 'Телефон', 'Заезд', 'Выезд'],
    rows: [],
    files: [],
    logs: [],
    user: '',
    dragging: false,
    errorMessage: '',
    filterText: '',
    pageNo: 1,
    pageSize: 10,
    editorOpen: false,
    editing: false,
    form: {},
    selectedLog: null,
    authName: '',
    authMessage: ''
  } },

  // --- Вычисляемые свойства ---
  computed: {
    filteredRows() {
      const q = this.filterText.toLowerCase().trim();
      if (!q) return this.rows;
      return this.rows.filter(row =>
        this.headers.some(h => String(row[h] || '').toLowerCase().includes(q))
      );
    },
    visibleRows() {
      const start = (this.pageNo - 1) * this.pageSize;
      return this.filteredRows.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
    }
  },

  // --- Наблюдатели ---
  watch: {
    filterText() {
      this.pageNo = 1;
    },
    pageSize() {
      this.pageNo = 1;
    }
  },

  // --- Хук инициализации ---
  created() {
    this.loadState();
  },

  // --- Методы ---
  methods: {
    // Сохранение и загрузка состояния
    loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
        this.rows = saved.rows || [];
        this.files = saved.files || [];
        this.logs = saved.logs || [];
        const demoSession = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
        this.user = demoSession?.name || saved.user || '';
      } catch (e) {
        console.error('Ошибка загрузки локальных данных', e);
      }
    },
    persist() {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        rows: this.rows,
        files: this.files,
        logs: this.logs,
        user: this.user
      }));
    },

    // Навигация и Авторизация
    go(id) { this.page = id; },
    authenticate() {
      if (!this.authName.trim()) {
        this.authMessage = 'Введите имя для журнала действий';
        return;
      }
      this.user = this.authName.trim();
      this.persist();
      this.page = 'home';
      this.authMessage = '';
    },
    logout() {
      this.user = '';
      sessionStorage.removeItem(SESSION_KEY);
      this.persist();
      window.location.href = './auth.html#login';
    },

    // Работа с Excel файлами
    dropFile(e) {
      this.dragging = false;
      const file = e.dataTransfer.files[0];
      if (file) this.importFile(file);
    },
    chooseFile(e) {
      const file = e.target.files[0];
      if (file) this.importFile(file);
      e.target.value = '';
    },
    importFile(file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls'].includes(ext)) {
        this.errorMessage = `Подходят только файлы Excel: .xlsx или .xls. Выбран файл «${file.name}».`;
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const workbook = XLSX.read(ev.target.result, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const parsedData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

          if (!parsedData.length) {
            throw new Error('В файле не найдено данных.');
          }

          const normalizedRows = parsedData.map(obj => {
            const vals = Object.values(obj);
            const row = { _id: Date.now() + Math.random() };
            this.headers.forEach((h, i) => {
              row[h] = obj[h] !== undefined ? obj[h] : (vals[i] ?? '');
            });
            return row;
          });

          this.rows = this.rows.concat(normalizedRows);
          this.files.unshift({
            name: file.name,
            date: new Date().toLocaleString('ru-RU'),
            count: normalizedRows.length
          });

          this.log(`Импорт файла «${file.name}» (${normalizedRows.length} строк)`, 'create', null, {
            file: file.name,
            rows: normalizedRows.length
          });
          
          this.persist();
          this.page = 'data';
        } catch (err) {
          this.errorMessage = err.message || 'Ошибка чтения файла. Проверьте формат.';
        }
      };
      reader.readAsArrayBuffer(file);
    },
    removeFile(index) {
      if (confirm('Удалить файл из хранилища?')) {
        this.files.splice(index, 1);
        this.persist();
      }
    },

    // Операции над записями (CRUD)
    loadMore() {
      this.pageSize += 10;
    },
    openEditor(row) {
      this.editing = Boolean(row);
      this.form = row ? Object.assign({}, row) : {};
      
      this.headers.forEach(h => {
        if (this.form[h] === undefined) {
          this.form[h] = '';
        }
      });
      this.editorOpen = true;
    },
    saveRow() {
      const values = {};
      this.headers.forEach(h => values[h] = this.form[h]);

      if (!this.headers.some(h => String(values[h] || '').trim())) {
        this.errorMessage = 'Заполните хотя бы одно поле записи.';
        return;
      }

      if (this.editing) {
        const index = this.rows.findIndex(r => r._id === this.form._id);
        const before = Object.assign({}, this.rows[index]);
        
        this.rows.splice(index, 1, Object.assign({ _id: this.form._id }, values));
        this.log(`Обновлена запись «${values[this.headers[0]] || 'без имени'}»`, 'update', before, Object.assign({}, this.rows[index]));
      } else {
        const newRow = Object.assign({ _id: Date.now() + Math.random() }, values);
        this.rows.unshift(newRow);
        this.log(`Добавлена запись «${values[this.headers[0]] || 'без имени'}»`, 'create', null, newRow);
      }

      this.persist();
      this.editorOpen = false;
    },
    deleteRow(row) {
      if (!confirm(`Удалить запись «${row[this.headers[0]] || 'без имени'}»?`)) return;
      
      this.rows = this.rows.filter(r => r._id !== row._id);
      this.log(`Удалена запись «${row[this.headers[0]] || 'без имени'}»`, 'delete', row, null);
      this.persist();
    },

    // Аудит и формат
    log(title, type, before, after) {
      this.logs.unshift({
        id: Date.now() + Math.random(),
        title,
        type,
        before: before ? JSON.parse(JSON.stringify(before)) : null,
        after: after ? JSON.parse(JSON.stringify(after)) : null,
        date: new Date().toLocaleString('ru-RU'),
        user: this.user || 'администратор'
      });
    },
    pretty(val) {
      return JSON.stringify(val, null, 2) || '—';
    }
  }
}).mount('#app');
