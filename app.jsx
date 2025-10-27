const { useState, useMemo, useEffect, useCallback, useRef } = React;

const SCHEDULE_ODD = [
  {day:'Понедельник', pair:3, time:'11:35-13:10', weeks:'all', type:'практика', subgroup:null, subject:'Электив по физической культуре и спорту', place:'спорткомплекс 6-го учебного корпуса', teacher:'Андронова Л. Н.', note:''},

  {day:'Вторник', pair:1, time:'08:00-09:35', weeks:'odd', type:'лекция', subgroup:null, subject:'Основы российской государственности', place:'6427', teacher:'Седаев П. В.', note:''},
  {day:'Пятница', pair:1, time:'08:00-09:35', weeks:'all', type:'практика', subgroup:null, subject:'Математика', place:'6520', teacher:'Малышев И. Г.', note:''},
  {day:'Суббота', pair:1, time:'08:00-09:35', weeks:'all', type:'лабораторная', subgroup:1, subject:'Программирование на Java', place:'6451', teacher:'Зарубин И. Б.', note:''},

  {day:'Вторник', pair:2, time:'09:45-11:20', weeks:'odd', type:'лекция', subgroup:null, subject:'Графические информационные технологии', place:'6246', teacher:'ст. пр. Малаканова М. А.', note:''},
  {day:'Среда', pair:2, time:'09:45-11:20', weeks:'odd', type:'практика', subgroup:2, subject:'Иностранный язык (англ.)', place:'6523', teacher:'Зазыкина Т. Н.', note:''},
  {day:'Четверг', pair:2, time:'09:45-11:20', weeks:'all', type:'практика', subgroup:null, subject:'Дискретная математика', place:'6345', teacher:'доц. Степаненко М. А.', note:''},
  {day:'Пятница', pair:2, time:'09:45-11:20', weeks:'all', type:'лекция', subgroup:null, subject:'История', place:'6245', teacher:'проф. Гордина Е. Д.', note:''},
  {day:'Суббота', pair:2, time:'09:45-11:20', weeks:'all', type:'практика', subgroup:null, subject:'Основы российской государственности', place:'6515', teacher:'Седаев П. В.', note:''},

  {day:'Вторник', pair:3, time:'11:35-13:10', weeks:'all', type:'лабораторная', subgroup:'1-2', subject:'Основы Web-технологий', place:'6143/6251', teacher:'Глумова Е. С.; Бойтякова К. А.', note:''},
  {day:'Среда', pair:3, time:'11:35-13:10', weeks:'all', type:'лабораторная', subgroup:'1-2', subject:'Графические информационные технологии', place:'6339/6342', teacher:'Малаканова М. А.; Серова М. А.', note:''},
  {day:'Четверг', pair:3, time:'11:35-13:10', weeks:'all', type:'лекция', subgroup:null, subject:'Математика', place:'6128', teacher:'доц. Малышев И. Г.', note:''},
  {day:'Пятница', pair:3, time:'11:35-13:10', weeks:'all', type:'лекция', subgroup:null, subject:'Дискретная математика', place:'6258', teacher:'доц. Степаненко М. А.', note:''},
  {day:'Суббота', pair:3, time:'11:35-13:10', weeks:'all', type:'лекция', subgroup:null, subject:'Программирование на Java', place:'6455', teacher:'Зарубин И. Б.', note:''},

  {day:'Вторник', pair:4, time:'13:40-15:15', weeks:'all', type:'практика', subgroup:1, subject:'Иностранный язык (англ.)', place:'6235', teacher:'Ерофеева А. В.', note:''},
  {day:'Пятница', pair:4, time:'13:40-15:15', weeks:'all', type:'лекция', subgroup:null, subject:'Основы Web-технологий', place:'6425', teacher:'Курушин Е. А.', note:''},

  {day:'Среда', pair:5, time:'15:25-17:00', weeks:'odd', type:'-', subgroup:null, subject:'Час куратора', place:'6429', teacher:'–', note:'точечные недели: 3, 7, 11, 15; по нечётным', weeksList:[3,7,11,15]},
  {day:'Пятница', pair:5, time:'15:25-17:00', weeks:'all', type:'практика', subgroup:2, subject:'Программирование на Java', place:'6451', teacher:'Зарубин И. Б.', note:''}
];

const SCHEDULE_EVEN = [
  {day:'Понедельник', pair:3, time:'11:35-13:10', weeks:'all', type:'практика', subgroup:null, subject:'Электив по физической культуре и спорту', place:'спорткомплекс 6-го учебного корпуса', teacher:'Андронова Л. Н.', note:''},

  {day:'Четверг', pair:1, time:'08:00-09:35', weeks:'even', type:'практика', subgroup:null, subject:'Математика', place:'6532', teacher:'Малышев И. Г.', note:''},
  {day:'Пятница', pair:1, time:'08:00-09:35', weeks:'all', type:'практика', subgroup:null, subject:'Математика', place:'6520', teacher:'Малышев И. Г.', note:''},
  {day:'Суббота', pair:1, time:'08:00-09:35', weeks:'all', type:'лабораторная', subgroup:1, subject:'Программирование на Java', place:'6451', teacher:'Зарубин И. Б.', note:''},

  {day:'Вторник', pair:2, time:'09:45-11:20', weeks:'even', type:'лекция', subgroup:null, subject:'Математика', place:'6126', teacher:'доц. Малышев И. Г.', note:''},
  {day:'Четверг', pair:2, time:'09:45-11:20', weeks:'all', type:'практика', subgroup:null, subject:'Дискретная математика', place:'6345', teacher:'доц. Степаненко М. А.', note:''},
  {day:'Пятница', pair:2, time:'09:45-11:20', weeks:'all', type:'лекция', subgroup:null, subject:'История', place:'6245', teacher:'проф. Гордина Е. Д.', note:''},
  {day:'Суббота', pair:2, time:'09:45-11:20', weeks:'all', type:'практика', subgroup:null, subject:'Основы российской государственности', place:'6515', teacher:'Седаев П. В.', note:''},

  {day:'Вторник', pair:3, time:'11:35-13:10', weeks:'all', type:'лабораторная', subgroup:'1-2', subject:'Основы Web-технологий', place:'6143/6251', teacher:'Глумова Е. С.; Бойтякова К. А.', note:''},
  {day:'Среда', pair:3, time:'11:35-13:10', weeks:'all', type:'лабораторная', subgroup:'1-2', subject:'Графические информационные технологии', place:'6339/6342', teacher:'Малаканова М. А.; Серова М. А.', note:''},
  {day:'Четверг', pair:3, time:'11:35-13:10', weeks:'all', type:'лекция', subgroup:null, subject:'Математика', place:'6128', teacher:'доц. Малышев И. Г.', note:''},
  {day:'Пятница', pair:3, time:'11:35-13:10', weeks:'all', type:'лекция', subgroup:null, subject:'Дискретная математика', place:'6258', teacher:'доц. Степаненко М. А.', note:''},
  {day:'Суббота', pair:3, time:'11:35-13:10', weeks:'all', type:'лекция', subgroup:null, subject:'Программирование на Java', place:'6455', teacher:'Зарубин И. Б.', note:''},

  {day:'Вторник', pair:4, time:'13:40-15:15', weeks:'all', type:'практика', subgroup:1, subject:'Иностранный язык (англ.)', place:'6235', teacher:'Ерофеева А. В.', note:''},
  {day:'Четверг', pair:4, time:'13:40-15:15', weeks:'even', type:'практика', subgroup:null, subject:'История России', place:'6411', teacher:'Гордина Е. Д.', note:''},
  {day:'Пятница', pair:4, time:'13:40-15:15', weeks:'all', type:'лекция', subgroup:null, subject:'Основы Web-технологий', place:'6425', teacher:'Курушин Е. А.', note:''},

  {day:'Четверг', pair:5, time:'15:25-17:00', weeks:'even', type:'практика', subgroup:2, subject:'Иностранный язык (англ.)', place:'6324', teacher:'Зазыкина Т. Н.', note:''},
  {day:'Пятница', pair:5, time:'15:25-17:00', weeks:'all', type:'практика', subgroup:2, subject:'Программирование на Java', place:'6451', teacher:'Зарубин И. Б.', note:''}
];

const SCHEDULE_COMBINED = (() => {
  const seen = new Set();
  const merged = [];
  for (const entry of [...SCHEDULE_ODD, ...SCHEDULE_EVEN]) {
    const keyParts = [
      entry.day,
      entry.pair,
      entry.time,
      entry.weeks,
      entry.type,
      entry.subgroup == null ? 'null' : entry.subgroup,
      entry.subject,
      entry.place,
      entry.teacher,
      entry.note,
      entry.weeksList ? entry.weeksList.join(',') : ''
    ];
    const key = keyParts.join('|');
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(entry);
    }
  }
  return merged;
})();

const WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const DAY_SHORT = {
  'Понедельник': 'Пн',
  'Вторник': 'Вт',
  'Среда': 'Ср',
  'Четверг': 'Чт',
  'Пятница': 'Пт',
  'Суббота': 'Сб',
  'Воскресенье': 'Вс'
};

const WEEKDAY_MAP = {
  'понедельник': 'Понедельник',
  'вторник': 'Вторник',
  'среда': 'Среда',
  'четверг': 'Четверг',
  'пятница': 'Пятница',
  'суббота': 'Суббота',
  'воскресенье': 'Воскресенье'
};

const MONTH_LABELS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MS_IN_DAY = 86400000;
const MOSCOW_UTC_OFFSET = 3;

const STORAGE_KEYS = {
  parity: 'schedule::parity',
  theme: 'schedule::theme',
  subgroup: 'schedule::subgroup',
  type: 'schedule::type',
  day: 'schedule::day'
};

const ALL_TYPES = Array.from(new Set([...SCHEDULE_ODD, ...SCHEDULE_EVEN].map(item => item.type)))
  .filter(type => type && type !== '-');
const TYPE_VALUES = ALL_TYPES.map(type => String(type));

const SUBGROUP_OPTIONS = [
  { value: 'all', label: 'Все подгруппы' },
  { value: '1', label: 'Подгруппа 1' },
  { value: '2', label: 'Подгруппа 2' }
];

const COMBINED_SUBGROUP_VALUES = ['1-2', 'Подгруппы 1, 2'];

const TYPE_OPTIONS = [
  { value: 'all', label: 'Все типы' },
  ...TYPE_VALUES.map(value => ({
    value,
    label: formatTypeLabel(value)
  }))
];

const DAY_OPTIONS = [
  { value: 'all', label: 'Все дни' },
  ...WEEK_DAYS.map(day => ({ value: day, label: day }))
];

const FILTER_GROUPS = [
  {
    field: 'subgroup',
    label: 'Подгруппа',
    ariaLabel: 'Подгруппа',
    options: SUBGROUP_OPTIONS
  },
  {
    field: 'type',
    label: 'Тип занятия',
    ariaLabel: 'Тип занятия',
    options: TYPE_OPTIONS
  },
  {
    field: 'day',
    label: 'День недели',
    ariaLabel: 'День недели',
    options: DAY_OPTIONS
  }
];

const THEME_SEQUENCE = ['system', 'light', 'dark'];
const THEME_LABELS = {
  system: 'Системная тема',
  light: 'Светлая тема',
  dark: 'Тёмная тема'
};

function App() {
  const now = useMoscowNow();

  const [parityMode, setParityMode] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.parity);
    return stored === 'odd' || stored === 'even' || stored === 'auto' || stored === 'all' ? stored : 'auto';
  });

  const [themeMode, setThemeMode] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.theme);
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';
  });
  const [systemTheme, setSystemTheme] = useState(() => getPreferredTheme());
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const headerRef = useRef(null);
  const headerMetricsRef = useRef({ height: 0, peekHeight: 0 });
  const headerVisibleHeightRef = useRef(0);

  const applyHeaderVisibleHeight = useCallback((value) => {
    const element = headerRef.current;
    const { height } = headerMetricsRef.current;
    const maxHeight = height || value || 0;
    const clamped = Math.max(0, Math.min(value, maxHeight));
    headerVisibleHeightRef.current = clamped;

    if (!element) {
      return;
    }

    element.style.setProperty('--header-visible-height', `${clamped}px`);

    const tolerance = 2;
    let nextVisibility = 'hidden';
    if (maxHeight <= tolerance || clamped >= maxHeight - tolerance) {
      nextVisibility = 'visible';
    } else if (clamped > 8) {
      nextVisibility = 'peek';
    }

    element.dataset.visibility = nextVisibility;
    if (nextVisibility === 'hidden') {
      element.style.pointerEvents = 'none';
    } else {
      element.style.pointerEvents = '';
    }
  }, []);

  const readPeekHeight = useCallback(() => {
    if (typeof window === 'undefined') {
      return 60;
    }
    const raw = window.getComputedStyle(document.documentElement).getPropertyValue('--header-peek-height');
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 60;
  }, []);

  const autoCollapseFilters = useCallback(() => {
    setHeaderCollapsed(current => {
      if (current) {
        return current;
      }
      return true;
    });
  }, []);

  const handleToggleHeaderCollapsed = useCallback(() => {
    setHeaderCollapsed(current => {
      const next = !current;
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !headerRef.current) {
      return undefined;
    }

    const headerElement = headerRef.current;

    const updateMetrics = () => {
      const measuredHeight = headerElement.offsetHeight;
      headerMetricsRef.current.height = measuredHeight;
      headerElement.style.setProperty('--header-height', `${measuredHeight}px`);

      const peekHeight = Math.min(readPeekHeight(), measuredHeight);
      headerMetricsRef.current.peekHeight = peekHeight;

      const nearTop = window.scrollY <= 24;
      const maxVisible = nearTop || !headerCollapsed ? measuredHeight : peekHeight;
      const currentVisible = headerVisibleHeightRef.current != null ? headerVisibleHeightRef.current : maxVisible;
      const desired = nearTop ? measuredHeight : Math.min(currentVisible, maxVisible);
      applyHeaderVisibleHeight(desired);
    };

    updateMetrics();

    const handleResize = () => {
      updateMetrics();
    };

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(headerElement);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [headerCollapsed, applyHeaderVisibleHeight, readPeekHeight]);

  const [filters, setFilters] = useState(() => {
    const storedSubgroup = readStorage(STORAGE_KEYS.subgroup);
    const storedType = readStorage(STORAGE_KEYS.type);
    const storedDay = readStorage(STORAGE_KEYS.day);
    const validSubgroups = new Set(SUBGROUP_OPTIONS.map(option => option.value));
    const validTypes = new Set(['all', ...TYPE_VALUES]);
    const validDays = new Set(DAY_OPTIONS.map(option => option.value));
    return {
      subgroup: validSubgroups.has(storedSubgroup) ? storedSubgroup : 'all',
      type: validTypes.has(storedType) ? storedType : 'all',
      day: validDays.has(storedDay) ? storedDay : 'all'
    };
  });

  const handleFilterChange = useCallback((field, value) => {
    setFilters(current => {
      const currentValue = current[field];
      const nextValue = value === 'all' ? 'all' : (currentValue === value ? 'all' : value);
      if (currentValue === nextValue) {
        return current;
      }
      return { ...current, [field]: nextValue };
    });
  }, [setFilters]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.theme, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const media = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
    if (!media) return undefined;

    const handleChange = event => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
    } else {
      media.addListener(handleChange);
    }

    setSystemTheme(media.matches ? 'dark' : 'light');

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    const effectiveTheme = themeMode === 'system' ? systemTheme : themeMode;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [themeMode, systemTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !headerRef.current) {
      return undefined;
    }

    let lastY = window.scrollY;
    let rafId = null;

    const processScroll = () => {
      rafId = null;
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      const scrolledDown = delta > 4;
      const scrolledUp = delta < -4;
      const nearTop = currentY <= 24;
      const { height, peekHeight } = headerMetricsRef.current;

      let visibleHeight = headerVisibleHeightRef.current;
      const revealCap = (!headerCollapsed || nearTop) ? height : peekHeight;

      if (nearTop) {
        visibleHeight = height;
      } else if (scrolledDown) {
        visibleHeight = Math.max(0, visibleHeight - delta);
      } else if (scrolledUp) {
        visibleHeight = Math.min(revealCap, visibleHeight - delta);
      }

      applyHeaderVisibleHeight(visibleHeight);

      if (scrolledDown && currentY > 16) {
        autoCollapseFilters();
      }

      lastY = currentY;
    };

    const handleScroll = () => {
      if (rafId != null) {
        return;
      }

      rafId = window.requestAnimationFrame(processScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [headerCollapsed, autoCollapseFilters, applyHeaderVisibleHeight]);

  useEffect(() => {
    if (typeof window === 'undefined' || !headerRef.current) {
      return;
    }

    const { height, peekHeight } = headerMetricsRef.current;

    if (window.scrollY <= 24) {
      applyHeaderVisibleHeight(height);
      return;
    }

    if (headerCollapsed) {
      const cap = Math.min(peekHeight, height);
      const next = Math.min(headerVisibleHeightRef.current, cap);
      applyHeaderVisibleHeight(next);
    } else {
      applyHeaderVisibleHeight(height);
    }
  }, [headerCollapsed, applyHeaderVisibleHeight]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.parity, parityMode);
  }, [parityMode]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.subgroup, filters.subgroup);
    writeStorage(STORAGE_KEYS.type, filters.type);
    writeStorage(STORAGE_KEYS.day, filters.day);
  }, [filters]);

  const { parity: academicParity } = computeAcademicParity(now);
  const autoParity = academicParity;
  const effectiveParity = parityMode === 'auto' ? autoParity : parityMode;
  const scheduleSource = parityMode === 'all'
    ? SCHEDULE_COMBINED
    : effectiveParity === 'odd'
      ? SCHEDULE_ODD
      : SCHEDULE_EVEN;

  const visiblePairs = useMemo(() => {
    const parityFilter = parityMode === 'all' ? 'all' : effectiveParity;
    return scheduleSource
      .filter(entry => entry.pair !== 'вне пар')
      .filter(entry => occursThisWeek(entry, parityFilter, now.isoWeek))
      .filter(entry => filters.day === 'all' || entry.day === filters.day)
      .filter(entry => matchesSubgroup(entry, filters.subgroup))
      .filter(entry => matchesType(entry, filters.type));
  }, [scheduleSource, parityMode, effectiveParity, now.isoWeek, filters]);

  const todayInfo = useMemo(() => {
    const todayParity = parityMode === 'all' ? autoParity : effectiveParity;
    return computeTodayInfo({
      schedule: scheduleSource,
      now,
      parity: todayParity,
      isoWeek: now.isoWeek,
      filters
    });
  }, [scheduleSource, now, parityMode, effectiveParity, autoParity, filters]);

  const dayFilterList = filters.day === 'all' ? WEEK_DAYS : WEEK_DAYS.filter(day => day === filters.day);

  return (
    <div className="app-shell">
      <header
        ref={headerRef}
        className={`app-header${headerCollapsed ? ' collapsed' : ''}`}
      >
        <div className="brand-line">
          <div className="brand-block" aria-live="polite">
            <h1>Расписание учебных пар</h1>
            <div className="brand-meta">
              <span>{formatDateLabel(now)}</span>
              <span className="accent-dot" aria-hidden="true"></span>
              <span>{autoParity === 'odd' ? 'Нечётная неделя' : 'Чётная неделя'}</span>
            </div>
          </div>
          <div className="control-block">
            <ParitySelector parityMode={parityMode} onChange={setParityMode} />
            <button
              type="button"
              className={`collapse-button${headerCollapsed ? ' collapsed' : ''}`}
              onClick={handleToggleHeaderCollapsed}
              aria-label={headerCollapsed ? 'Развернуть шапку' : 'Свернуть шапку'}
              aria-expanded={!headerCollapsed}
              aria-controls="filters-panel"
              title={headerCollapsed ? 'Развернуть шапку' : 'Свернуть шапку'}
            >
              <ChevronIcon direction={headerCollapsed ? 'down' : 'up'} />
            </button>
          </div>
        </div>
        <FiltersPanel
          filters={filters}
          onUpdateFilter={handleFilterChange}
          collapsed={headerCollapsed}
          id="filters-panel"
        />
      </header>

      <main className="app-main">
        <section>
          <div className="section-header">
            <h2>Сегодня</h2>
          </div>
          <TodaySection info={todayInfo} showParityLabels={parityMode === 'all'} />
        </section>

        <section className="week-section">
          <div className="section-header">
            <h2>Неделя</h2>
          </div>
          <WeekView
            days={dayFilterList}
            entries={visiblePairs}
            currentKey={todayInfo.currentKey}
            showParityLabels={parityMode === 'all'}
          />
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-head">
          <div className="footer-info">
            <div className="footer-title">Как пользоваться расписанием</div>
            <p className="footer-text">Здесь собраны подсказки, как быстрее находить нужные пары и управлять отображением.</p>
          </div>
          <div className="footer-theme-control">
            <span className="footer-theme-label">Тема интерфейса</span>
            <button
              type="button"
              className="theme-button footer-theme-button"
              onClick={() => {
                const currentIndex = THEME_SEQUENCE.indexOf(themeMode);
                const nextIndex = (currentIndex + 1) % THEME_SEQUENCE.length;
                setThemeMode(THEME_SEQUENCE[nextIndex]);
              }}
              aria-label={`Текущая тема: ${THEME_LABELS[themeMode]} (нажмите, чтобы переключить)`}
              title={`Тема: ${THEME_LABELS[themeMode]}`}
            >
              <ThemeIcon mode={themeMode} />
            </button>
          </div>
        </div>
        <ul className="footer-guide">
          <li>Следите за сегодняшними парами: статус и таймер отображаются в верхнем блоке.</li>
          <li>Переключайте чётность недели или смотрите обе сразу через переключатель «Неделя».</li>
          <li>Фильтры подгруппы, типа занятия и дня помогут оставить только нужные пары.</li>
          <li>Нажмите ещё раз на выбранный фильтр, чтобы вернуться к варианту «Все».</li>
          <li>Иконка темы переключает светлую, тёмную или системную палитру интерфейса.</li>
        </ul>
      </footer>
    </div>
  );
}

function ParitySelector({ parityMode, onChange }) {
  const options = [
    { value: 'auto', label: 'Авто' },
    { value: 'all', label: 'Все' },
    { value: 'odd', label: 'Нечётная' },
    { value: 'even', label: 'Чётная' }
  ];

  return (
    <div className="parity-switch" role="group" aria-label="Чётность недели">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={parityMode === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FiltersPanel({ filters, onUpdateFilter, collapsed = false, id }) {
  return (
    <div
      className={`filters-panel${collapsed ? ' is-collapsed' : ''}`}
      aria-label="Фильтры"
      aria-hidden={collapsed}
      id={id}
    >
      {FILTER_GROUPS.map(group => (
        <div className="filter-field" key={group.field}>
          <span className="filter-label">{group.label}</span>
          <div className="filter-buttons" role="group" aria-label={group.ariaLabel}>
            {group.options.map(option => (
              <FilterOptionButton
                key={option.value}
                active={filters[group.field] === option.value}
                onClick={() => onUpdateFilter(group.field, option.value)}
              >
                {option.label}
              </FilterOptionButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterOptionButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`filter-button${active ? ' active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg
      className={`icon icon-chevron icon-chevron--${direction}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 10.5l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeIcon({ mode }) {
  if (mode === 'dark') {
    return (
      <svg className="icon icon-theme" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M15 3.8a8.7 8.7 0 1 0 5.2 12.64A7 7 0 0 1 15 3.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (mode === 'light') {
    return (
      <svg className="icon icon-theme" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle
          cx="12"
          cy="12"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 4V2m0 20v-2M5.6 5.6L4.2 4.2m15.6 15.6-1.4-1.4M4 12H2m20 0h-2M5.6 18.4 4.2 19.8m15.6-15.6-1.4 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className="icon icon-theme" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="6.2"
        width="16"
        height="11.6"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.5 9.2h2.5m2 0h2.5M8.5 12h8M8.5 14.8h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TodaySection({ info, showParityLabels }) {
  if (info.mode === 'empty') {
    return (
      <div className="summary-card" aria-live="polite">
        <span className="badge">Сегодня пар нет</span>
        <p className="info-text">Можно посвятить день отдыху или самостоятельной подготовке.</p>
      </div>
    );
  }

  if (info.mode === 'done') {
    return (
      <div className="summary-card" aria-live="polite">
        <span className="badge">Учебный день завершён</span>
        <p className="info-text">Хорошего отдыха! Следующие занятия начнутся в другой день.</p>
      </div>
    );
  }

  const isCurrent = info.mode === 'current';
  const entry = info.entry;
  const subgroupBadge = getSubgroupBadge(entry.subgroup);
  const teacherLabel = (entry.teacher || '').trim();
  const showTeacher = teacherLabel !== '' && teacherLabel !== '-' && teacherLabel !== '–';
  const parityVariant = showParityLabels ? getParityVariant(entry.weeks) : null;
  const parityLabel = parityVariant ? getParityLabel(entry.weeks) : null;
  const typeVariant = getTypeVariant(entry.type);

  return (
    <article
      className={`today-card${isCurrent ? ' current' : ''}${parityVariant ? ` parity-${parityVariant}` : ''}`}
      aria-live="polite"
    >
      <div className="today-main">
        <span className="badge">{info.title}</span>
        <h3 className="today-title">{entry.subject}</h3>
        <div className="today-meta">
          <div className="meta-time">
            <div className="meta-time-row">
              <span className="meta-time-value">{entry.time}</span>
              {subgroupBadge && (
                <span className={`subgroup-badge subgroup-${subgroupBadge.variant}`}>
                  {subgroupBadge.label}
                </span>
              )}
            </div>
            <span className="meta-room-value">ауд. {entry.place}</span>
          </div>
          <div className="meta-tags">
            {parityLabel && (
              <span className={`meta-chip parity-chip parity-${parityVariant}`}>{parityLabel}</span>
            )}
            <span className={`meta-chip meta-chip-type meta-chip-type--${typeVariant}`}>{formatTypeLabel(entry.type)}</span>
            {showTeacher && (
              <span className="meta-chip meta-chip-muted">{teacherLabel}</span>
            )}
          </div>
        </div>
        {info.message && <p className="info-text">{info.message}</p>}
      </div>
      <div className="countdown-line">
        <div
          className="countdown-value"
          role="timer"
          aria-label={isCurrent ? 'До конца пары' : 'До начала пары'}
        >
          {info.countdownLabel}
        </div>
        {isCurrent && (
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(info.progress)}
            aria-valuetext={`Осталось ${Math.round(info.progress)}% времени пары`}
          >
            <div className="progress-fill" style={{ width: `${info.progress}%` }}></div>
          </div>
        )}
      </div>
    </article>
  );
}

function WeekView({ days, entries, currentKey, showParityLabels }) {
  const scheduleByDay = useMemo(() => {
    return days.map(day => {
      const dayEntries = entries
        .filter(entry => entry.day === day && entry.pair !== 'вне пар')
        .slice()
        .sort(comparePairs)
        .map(entry => ({ entry, key: createEntryKey(entry) }));
      return { day, entries: dayEntries };
    });
  }, [days, entries]);

  if (!days.length) {
    return <div className="empty-state">Дни не выбраны.</div>;
  }

  const hasEntries = scheduleByDay.some(group => group.entries.length > 0);

  return (
    <>
      <div className="week-day-list">
        {scheduleByDay.map(({ day, entries: dayEntries }) => {
          const dayHasEntries = dayEntries.length > 0;
          return (
            <section
              key={day}
              className={`week-day-card${dayHasEntries ? '' : ' is-empty'}`}
              aria-label={`Занятия на ${day}`}
            >
              <div className="week-day-header">
                <span className="week-day-name">{day}</span>
                <span className="week-day-short">{DAY_SHORT[day]}</span>
              </div>
              {dayHasEntries ? (
                <ul className="day-pair-list">
                  {dayEntries.map(({ entry, key }) => {
                    const isCurrent = currentKey && currentKey === key;
                    const subgroupBadge = getSubgroupBadge(entry.subgroup);
                    const parityVariant = showParityLabels ? getParityVariant(entry.weeks) : null;
                    const parityLabel = parityVariant ? getParityLabel(entry.weeks) : null;
                    const teacherLabel = (entry.teacher || '').trim();
                    const showTeacher = teacherLabel !== '' && teacherLabel !== '-' && teacherLabel !== '–';
                    const typeVariant = getTypeVariant(entry.type);
                    const note = (entry.note || '').trim();
                    return (
                      <li
                        key={key}
                        className={`pair-entry${isCurrent ? ' is-current' : ''}${parityVariant ? ` parity-${parityVariant}` : ''}`}
                      >
                        <div className="pair-entry-header">
                          <div className="pair-entry-time">
                            <span className="pair-entry-number">
                              {typeof entry.pair === 'number' ? `${entry.pair}-я пара` : entry.pair}
                            </span>
                            <span className="pair-entry-clock">{entry.time}</span>
                          </div>
                          <div className="pair-entry-flags">
                            {subgroupBadge && (
                              <span className={`subgroup-badge subgroup-${subgroupBadge.variant}`}>
                                {subgroupBadge.label}
                              </span>
                            )}
                            {parityLabel && (
                              <span className={`meta-chip parity-chip parity-${parityVariant}`}>{parityLabel}</span>
                            )}
                          </div>
                        </div>
                        <div className="pair-entry-body">
                          <div className="pair-entry-subject">{entry.subject}</div>
                          <div className="pair-entry-room">ауд. {entry.place}</div>
                        </div>
                        <div className="pair-entry-footer">
                          <span className={`meta-chip meta-chip-type meta-chip-type--${typeVariant}`}>
                            {formatTypeLabel(entry.type)}
                          </span>
                          <div className="pair-entry-tags">
                            {showTeacher && (
                              <span className="meta-chip meta-chip-muted">{teacherLabel}</span>
                            )}
                            {note && <span className="meta-chip meta-chip-note">{note}</span>}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="day-empty">В этот день занятий нет.</p>
              )}
            </section>
          );
        })}
      </div>
      {!hasEntries && (
        <p className="empty-table-note">По выбранным фильтрам занятия не найдены.</p>
      )}
    </>
  );
}

function useMoscowNow() {
  const [now, setNow] = useState(() => extractMoscowParts(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setNow(extractMoscowParts(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function extractMoscowParts(refDate) {
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
  const parts = formatter.formatToParts(refDate);
  const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const hour = Number(map.hour);
  const minute = Number(map.minute);
  const second = Number(map.second);
  const weekday = map.weekday.toLowerCase();
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour - 3, minute, second));
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday,
    isoDate: utcDate,
    isoWeek: getISOWeek(utcDate),
    secondsOfDay: hour * 3600 + minute * 60 + second
  };
}

function getISOWeek(date) {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNr = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNr);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
}

function occursThisWeek(entry, parity, isoWeek) {
  const parityMatch = parity === 'all' || entry.weeks === 'all' || entry.weeks === parity;
  const weeksListMatch = !entry.weeksList || entry.weeksList.includes(isoWeek);
  return parityMatch && weeksListMatch;
}

function matchesSubgroup(entry, filterValue) {
  if (filterValue === 'all') return true;
  if (entry.subgroup == null) return true;
  if (filterValue === '1') {
    return entry.subgroup === 1 || entry.subgroup === '1' || COMBINED_SUBGROUP_VALUES.includes(entry.subgroup);
  }
  if (filterValue === '2') {
    return entry.subgroup === 2 || entry.subgroup === '2' || COMBINED_SUBGROUP_VALUES.includes(entry.subgroup);
  }
  return String(entry.subgroup) === filterValue;
}

function matchesType(entry, filterValue) {
  if (filterValue === 'all') return true;
  return entry.type === filterValue;
}

function computeTodayInfo({ schedule, now, parity, isoWeek, filters }) {
  const todayName = WEEKDAY_MAP[now.weekday] || 'Воскресенье';

  const todayEntries = schedule
    .filter(entry => entry.day === todayName && entry.pair !== 'вне пар')
    .filter(entry => occursThisWeek(entry, parity, isoWeek))
    .filter(entry => matchesSubgroup(entry, filters.subgroup))
    .filter(entry => matchesType(entry, filters.type))
    .sort(comparePairs);

  if (todayEntries.length === 0) {
    return { mode: 'empty', currentKey: null };
  }

  const nowSeconds = now.secondsOfDay;
  let current = null;
  let next = null;
  let previous = null;

  for (const entry of todayEntries) {
    const range = parseTimeRange(entry.time);
    if (!range) continue;
    const { startSeconds, endSeconds } = range;
    if (nowSeconds >= startSeconds && nowSeconds < endSeconds) {
      current = { entry, startSeconds, endSeconds };
      break;
    }
    if (nowSeconds < startSeconds) {
      next = { entry, startSeconds, endSeconds };
      break;
    }
    previous = { entry, startSeconds, endSeconds };
  }

  if (current) {
    const remainingMs = (current.endSeconds - nowSeconds) * 1000;
    return {
      mode: 'current',
      title: 'Текущая пара',
      entry: current.entry,
      countdownLabel: `До конца пары ${formatCountdown(remainingMs)}`,
      progress: computeProgress(nowSeconds, current.startSeconds, current.endSeconds),
      currentKey: createEntryKey(current.entry)
    };
  }

  if (next) {
    const remainingMs = (next.startSeconds - nowSeconds) * 1000;
    const title = previous ? 'Перерыв' : 'До первой пары';
    const message = previous ? 'Скоро продолжим занятия.' : 'Ещё есть время подготовиться.';
    return {
      mode: 'upcoming',
      title,
      entry: next.entry,
      countdownLabel: `Через ${formatRelative(remainingMs)}`,
      message,
      currentKey: null
    };
  }

  return {
    mode: 'done',
    currentKey: null
  };
}

function comparePairs(a, b) {
  const pairA = typeof a.pair === 'number' ? a.pair : Number.MAX_SAFE_INTEGER;
  const pairB = typeof b.pair === 'number' ? b.pair : Number.MAX_SAFE_INTEGER;
  if (pairA !== pairB) {
    return pairA - pairB;
  }
  const timeA = parseTimeToSeconds((a.time || '00:00').split('-')[0]);
  const timeB = parseTimeToSeconds((b.time || '00:00').split('-')[0]);
  return timeA - timeB;
}

function parseTimeRange(range) {
  if (!range) return null;
  const parts = range.split('-');
  if (parts.length !== 2) return null;
  const startSeconds = parseTimeToSeconds(parts[0]);
  const endSeconds = parseTimeToSeconds(parts[1]);
  return { startSeconds, endSeconds };
}

function parseTimeToSeconds(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60;
}

function computeProgress(nowSeconds, startSeconds, endSeconds) {
  const total = endSeconds - startSeconds;
  if (total <= 0) return 0;
  if (nowSeconds <= startSeconds) return 100;
  if (nowSeconds >= endSeconds) return 0;
  const remaining = endSeconds - nowSeconds;
  return Math.min(100, Math.max(0, (remaining / total) * 100));
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function formatRelative(ms) {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} ч`);
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes} мин`);
  }
  return parts.join(' ');
}

function formatTypeLabel(value) {
  if (!value || value === '-') return 'Тип не указан';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getParityVariant(weeks) {
  if (weeks === 'odd') return 'odd';
  if (weeks === 'even') return 'even';
  return null;
}

function getParityLabel(weeks) {
  if (weeks === 'odd') return 'Нечётная неделя';
  if (weeks === 'even') return 'Чётная неделя';
  return null;
}

function getTypeVariant(type) {
  const value = (type || '').toLowerCase();
  if (value.includes('практик')) return 'practice';
  if (value.includes('лаборат')) return 'lab';
  if (value.includes('лекц')) return 'lecture';
  if (value.includes('семинар')) return 'seminar';
  return 'other';
}

function getPreferredTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSubgroupBadge(value) {
  if (value == null || value === '' || value === 'all') {
    return null;
  }
  if (value === 1 || value === '1') {
    return { label: '1', variant: 'first' };
  }
  if (value === 2 || value === '2') {
    return { label: '2', variant: 'second' };
  }
  if (value === '1-2' || COMBINED_SUBGROUP_VALUES.includes(value)) {
    return { label: '1, 2', variant: 'combined' };
  }
  return null;
}

function formatDateLabel(now) {
  const weekday = capitalize(WEEKDAY_MAP[now.weekday] || now.weekday);
  const datePart = `${now.day} ${MONTH_LABELS[now.month - 1]} ${now.year}`;
  return `${weekday}, ${datePart} • ${pad(now.hour)}:${pad(now.minute)} (МСК)`;
}

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function createEntryKey(entry) {
  return [entry.day, entry.pair, entry.time, entry.subject].join('::');
}

function createMoscowDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day, -MOSCOW_UTC_OFFSET, 0, 0, 0));
}

function computeAcademicParity(now) {
  const currentDate = createMoscowDate(now.year, now.month, now.day);
  const academicYearStartYear = now.month >= 9 ? now.year : now.year - 1;
  const academicStartDate = createMoscowDate(academicYearStartYear, 9, 1);
  const diffDays = Math.floor((currentDate - academicStartDate) / MS_IN_DAY);
  const normalizedDays = diffDays < 0 ? 0 : diffDays;
  const weeksFromStart = Math.floor(normalizedDays / 7);
  const parity = weeksFromStart % 2 === 0 ? 'odd' : 'even';
  return { parity, weekNumber: weeksFromStart + 1 };
}

function readStorage(key) {
  const storage = getSafeStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // ignore write errors (e.g., private mode)
  }
}

function getSafeStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
