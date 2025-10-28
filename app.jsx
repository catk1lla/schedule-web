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

function createDefaultFilters() {
  return {
    subgroup: 'all',
    type: 'all',
    day: 'all'
  };
}

function isDefaultFilters(filters) {
  const defaults = createDefaultFilters();
  return Object.keys(defaults).every(key => filters[key] === defaults[key]);
}

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
  const [headerHidden, setHeaderHidden] = useState(false);

  const [filters, setFilters] = useState(() => {
    const storedSubgroup = readStorage(STORAGE_KEYS.subgroup);
    const storedType = readStorage(STORAGE_KEYS.type);
    const storedDay = readStorage(STORAGE_KEYS.day);
    const validSubgroups = new Set(SUBGROUP_OPTIONS.map(option => option.value));
    const validTypes = new Set(['all', ...TYPE_VALUES]);
    const validDays = new Set(DAY_OPTIONS.map(option => option.value));
    return {
      ...createDefaultFilters(),
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

  const handleResetFilters = useCallback(() => {
    setFilters(() => createDefaultFilters());
  }, []);

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
    if (typeof window === 'undefined') {
      return undefined;
    }

    let lastY = window.scrollY;
    let rafId = null;
    const DIRECTION_THRESHOLD = 12;
    const HIDE_OFFSET = 72;

    const handleScroll = () => {
      if (rafId != null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        if (currentY <= 0) {
          setHeaderHidden(false);
        } else if (delta > DIRECTION_THRESHOLD && currentY > HIDE_OFFSET) {
          setHeaderHidden(true);
        } else if (delta < -DIRECTION_THRESHOLD) {
          setHeaderHidden(false);
        }

        lastY = currentY;
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.parity, parityMode);
  }, [parityMode]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.subgroup, filters.subgroup);
    writeStorage(STORAGE_KEYS.type, filters.type);
    writeStorage(STORAGE_KEYS.day, filters.day);
  }, [filters]);

  const { parity: academicParity, weekNumber: academicWeekNumber } = computeAcademicParity(now);
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
      .filter(entry => occursThisWeek(entry, parityFilter, academicWeekNumber))
      .filter(entry => filters.day === 'all' || entry.day === filters.day)
      .filter(entry => matchesSubgroup(entry, filters.subgroup))
      .filter(entry => matchesType(entry, filters.type));
  }, [scheduleSource, parityMode, effectiveParity, academicWeekNumber, filters]);

  const todayInfo = useMemo(() => {
    const todayParity = parityMode === 'all' ? autoParity : effectiveParity;
    return computeTodayInfo({
      schedule: scheduleSource,
      now,
      parity: todayParity,
      weekNumber: academicWeekNumber,
      filters
    });
  }, [scheduleSource, now, parityMode, effectiveParity, autoParity, academicWeekNumber, filters]);

  const dayFilterList = filters.day === 'all' ? WEEK_DAYS : WEEK_DAYS.filter(day => day === filters.day);
  const filtersAreDefault = isDefaultFilters(filters);

  const currentYear = now.year;
  const themeLabel = THEME_LABELS[themeMode];

  return (
    <div className="app-shell">
      <header className={`app-header${headerCollapsed ? ' collapsed' : ''}${headerHidden ? ' is-hidden' : ''}`}>
        <div className="brand-line">
          <div className="brand-block" aria-live="polite">
            <h1>Расписание учебных пар</h1>
            <div className="brand-meta">
              <span className="brand-meta-primary">{formatDateLabel(now)}</span>
              <div className="brand-meta-secondary">
                <span>Академическая неделя №{academicWeekNumber}</span>
                <span>Автоопределение: {autoParity === 'odd' ? 'нечётная' : 'чётная'} неделя</span>
              </div>
            </div>
          </div>
          <div className="control-block">
            <ParitySelector parityMode={parityMode} onChange={setParityMode} />
            <button
              type="button"
              className={`collapse-button${headerCollapsed ? ' collapsed' : ''}`}
              onClick={() => {
                setHeaderHidden(false);
                setHeaderCollapsed(value => !value);
              }}
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
          onReset={handleResetFilters}
          resetDisabled={filtersAreDefault}
        />
      </header>

      <main className="app-main">
        <section id="today">
          <div className="section-header">
            <h2>Сегодня</h2>
          </div>
          <TodaySection info={todayInfo} showParityLabels={parityMode === 'all'} />
        </section>

        <section className="week-section" id="week">
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
        <div className="footer-inner">
          <div className="footer-upper">
            <div className="footer-brand">
              <div className="footer-title">Учебный ритм под контролем</div>
              <p className="footer-description">
                Следите за текущими и предстоящими парами, фильтруйте подгруппы и выбирайте удобную тему оформления.
              </p>
              <div className="footer-actions">
                <span className="footer-action-label">Тема интерфейса</span>
                <button
                  type="button"
                  className="theme-button footer-theme-button"
                  onClick={() => {
                    const currentIndex = THEME_SEQUENCE.indexOf(themeMode);
                    const nextIndex = (currentIndex + 1) % THEME_SEQUENCE.length;
                    setThemeMode(THEME_SEQUENCE[nextIndex]);
                  }}
                  aria-label={`Текущая тема: ${themeLabel} (нажмите, чтобы переключить)`}
                  title={`Тема: ${themeLabel}`}
                >
                  <ThemeIcon mode={themeMode} />
                </button>
              </div>
            </div>
            <div className="footer-columns">
              <div className="footer-column">
                <h3>Разделы</h3>
                <ul>
                  <li><a href="#today">Сегодня</a></li>
                  <li><a href="#week">Неделя</a></li>
                  <li><a href="#filters-panel">Фильтры</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Дополнительно</h3>
                <ul>
                  <li><a href="https://www.nntu.ru/" target="_blank" rel="noreferrer">Сайт университета</a></li>
                  <li><span>Обновление расписания: еженедельно</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <small>© {currentYear} Расписание учебных пар</small>
            <small>Последнее обновление по московскому времени</small>
          </div>
        </div>
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

function FiltersPanel({ filters, onUpdateFilter, collapsed = false, id, onReset, resetDisabled = false }) {
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
      {typeof onReset === 'function' && (
        <div className="filters-actions">
          <button
            type="button"
            className="filter-reset-button"
            onClick={onReset}
            disabled={resetDisabled}
            aria-label="Сбросить выбранные фильтры"
            title="Сбросить фильтры"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
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
  const teacherLabel = formatTeacherNames(entry.teacher);
  const showTeacher = teacherLabel !== '';
  const parityTone = getParityVariant(entry.weeks);
  const parityLabel = showParityLabels && parityTone ? getParityLabel(entry.weeks) : null;
  const cardParityVariant = showParityLabels ? null : parityTone;
  const typeVariant = getTypeVariant(entry.type);

  return (
    <article
      className={`today-card${isCurrent ? ' current' : ''}${cardParityVariant ? ` parity-${cardParityVariant}` : ''}`}
      aria-live="polite"
    >
      <div className="today-head">
        <span className="badge">{info.title}</span>
        {subgroupBadge && (
          <span className={`subgroup-badge subgroup-${subgroupBadge.variant} today-subgroup-badge`}>
            {subgroupBadge.label}
          </span>
        )}
      </div>
      <div className="today-main">
        <h3 className="today-title">{entry.subject}</h3>
        <div className="today-meta">
          <div className="meta-time">
            <span className="meta-time-value">{entry.time}</span>
            <span className="meta-room-value">ауд. {entry.place}</span>
          </div>
          <div className="meta-tags">
            {parityLabel && parityTone && (
              <span className={`meta-chip parity-chip parity-${parityTone}`}>{parityLabel}</span>
            )}
            <span className={`meta-chip meta-chip-type meta-chip-type--${typeVariant}`}>
              {formatTypeLabel(entry.type)}
            </span>
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
  const carouselRef = useRef(null);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return undefined;

    let pointerActive = false;
    let pointerCaptured = false;
    let touchActive = false;
    let gestureActive = false;
    let isDragging = false;
    let isVerticalScroll = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let velocity = 0;
    let rafId = null;
    const DRAG_THRESHOLD = 6;
    const mediaQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const prefersReducedMotion = () => Boolean(mediaQuery && mediaQuery.matches);
    const getScrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

    const stopMomentum = () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      velocity = 0;
    };

    const stepMomentum = () => {
      container.scrollLeft += velocity;
      velocity *= 0.92;
      if (Math.abs(velocity) > 0.5) {
        rafId = window.requestAnimationFrame(stepMomentum);
      } else {
        stopMomentum();
      }
    };

    const capturePointer = event => {
      if (pointerCaptured || typeof container.setPointerCapture !== 'function') {
        return;
      }
      try {
        container.setPointerCapture(event.pointerId);
        pointerCaptured = true;
      } catch {
        // ignore capture failures (e.g., Safari)
      }
    };

    const releasePointer = event => {
      if (!pointerCaptured || typeof container.releasePointerCapture !== 'function') {
        pointerCaptured = false;
        return;
      }
      try {
        container.releasePointerCapture(event.pointerId);
      } catch {
        // ignore release failures
      }
      pointerCaptured = false;
    };

    const startGesture = (x, y) => {
      gestureActive = true;
      isDragging = false;
      isVerticalScroll = false;
      startX = x;
      startY = y;
      lastX = x;
      velocity = 0;
      stopMomentum();
      pointerCaptured = false;
    };

    const moveGesture = (x, y, onDragStart) => {
      if (!gestureActive) return false;

      const totalX = x - startX;
      const totalY = y - startY;

      if (!isDragging && !isVerticalScroll) {
        if (Math.abs(totalX) > DRAG_THRESHOLD && Math.abs(totalX) > Math.abs(totalY)) {
          isDragging = true;
          container.classList.add('is-dragging');
          if (typeof onDragStart === 'function') {
            onDragStart();
          }
        } else if (Math.abs(totalY) > DRAG_THRESHOLD) {
          isVerticalScroll = true;
          return false;
        }
      }

      if (!isDragging) {
        return false;
      }

      const deltaX = x - lastX;
      container.scrollLeft -= deltaX;
      velocity = -deltaX;
      lastX = x;
      return true;
    };

    const finalizeGesture = () => {
      if (!gestureActive) {
        return;
      }

      if (isDragging) {
        container.classList.remove('is-dragging');
        if (!prefersReducedMotion() && Math.abs(velocity) > 0.5) {
          rafId = window.requestAnimationFrame(stepMomentum);
        } else {
          stopMomentum();
        }
      } else {
        stopMomentum();
      }

      gestureActive = false;
      isDragging = false;
      isVerticalScroll = false;
    };

    const onPointerDown = event => {
      if (event.pointerType === 'touch') {
        return;
      }
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      pointerActive = true;
      startGesture(event.clientX, event.clientY);
    };

    const onPointerMove = event => {
      if (!pointerActive) return;
      const shouldPrevent = moveGesture(event.clientX, event.clientY, () => capturePointer(event));
      if (shouldPrevent) {
        event.preventDefault();
      }
    };

    const onPointerUp = event => {
      if (!pointerActive) return;
      pointerActive = false;
      releasePointer(event);
      finalizeGesture();
    };

    const onPointerLeave = event => {
      if (!pointerActive) return;
      pointerActive = false;
      releasePointer(event);
      finalizeGesture();
    };

    const onPointerCancel = event => {
      if (!pointerActive) return;
      pointerActive = false;
      releasePointer(event);
      finalizeGesture();
    };

    const onTouchStart = event => {
      if (event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      touchActive = true;
      startGesture(touch.clientX, touch.clientY);
    };

    const onTouchMove = event => {
      if (!touchActive || event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      const shouldPrevent = moveGesture(touch.clientX, touch.clientY);
      if (shouldPrevent && event.cancelable) {
        event.preventDefault();
      }
    };

    const onTouchEnd = () => {
      if (!touchActive) return;
      touchActive = false;
      finalizeGesture();
    };

    const onTouchCancel = () => {
      if (!touchActive) return;
      touchActive = false;
      finalizeGesture();
    };

    const onWheel = event => {
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        container.scrollBy({
          left: event.deltaY,
          behavior: getScrollBehavior()
        });
      }
    };

    const onKeyDown = event => {
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        container.scrollBy({ left: container.clientWidth * 0.9, behavior: getScrollBehavior() });
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        container.scrollBy({ left: -container.clientWidth * 0.9, behavior: getScrollBehavior() });
      } else if (event.key === 'Home') {
        event.preventDefault();
        container.scrollTo({ left: 0, behavior: getScrollBehavior() });
      } else if (event.key === 'End') {
        event.preventDefault();
        container.scrollTo({ left: container.scrollWidth, behavior: getScrollBehavior() });
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove, { passive: false });
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchCancel);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('keydown', onKeyDown);

    return () => {
      stopMomentum();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchCancel);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  if (!days.length) {
    return <div className="empty-state">Дни не выбраны.</div>;
  }

  const hasEntries = scheduleByDay.some(group => group.entries.length > 0);

  return (
    <>
      <div
        className="week-carousel"
        ref={carouselRef}
        tabIndex="0"
        role="group"
        aria-label="Занятия на неделю"
      >
        <ol className="week-day-list">
          {scheduleByDay.map(({ day, entries: dayEntries }) => {
            const dayHasEntries = dayEntries.length > 0;
            return (
              <li
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
                    const parityTone = getParityVariant(entry.weeks);
                    const parityLabel = showParityLabels && parityTone ? getParityLabel(entry.weeks) : null;
                    const parityCardVariant = showParityLabels ? null : parityTone;
                    const teacherLabel = formatTeacherNames(entry.teacher);
                    const showTeacher = teacherLabel !== '';
                    const typeVariant = getTypeVariant(entry.type);
                    const note = (entry.note || '').trim();
                    const hasTags = showTeacher || note;
                    return (
                      <li
                        key={key}
                        className={`pair-entry${isCurrent ? ' is-current' : ''}${parityCardVariant ? ` parity-${parityCardVariant}` : ''}`}
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
                              {parityLabel && parityTone && (
                                <span className={`meta-chip parity-chip parity-${parityTone}`}>{parityLabel}</span>
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
                            {hasTags && (
                              <div className="pair-entry-tags">
                                {showTeacher && (
                                  <span className="meta-chip meta-chip-muted">{teacherLabel}</span>
                                )}
                                {note && <span className="meta-chip meta-chip-note">{note}</span>}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="day-empty">В этот день занятий нет.</p>
                )}
              </li>
            );
          })}
        </ol>
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

function occursThisWeek(entry, parity, weekNumber) {
  const parityMatch = parity === 'all' || entry.weeks === 'all' || entry.weeks === parity;
  const weeksListMatch = !entry.weeksList || entry.weeksList.includes(weekNumber);
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

function computeTodayInfo({ schedule, now, parity, weekNumber, filters }) {
  const todayName = WEEKDAY_MAP[now.weekday] || 'Воскресенье';

  const todayEntries = schedule
    .filter(entry => entry.day === todayName && entry.pair !== 'вне пар')
    .filter(entry => occursThisWeek(entry, parity, weekNumber))
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

function formatTeacherNames(raw) {
  if (!raw) return '';
  const parts = String(raw)
    .split(/[;,]/)
    .map(part => formatSingleTeacher(part))
    .filter(Boolean);
  return parts.join(', ');
}

function formatSingleTeacher(part) {
  if (!part) return '';
  const trimmed = part.replace(/\s+/g, ' ').trim();
  if (!trimmed || trimmed === '-' || trimmed === '–') {
    return '';
  }

  const tokens = trimmed.split(' ').filter(Boolean);
  if (tokens.length === 0) {
    return '';
  }

  const surnameIndex = tokens.findIndex(token => /^[А-ЯЁ][а-яё-]+$/.test(token));
  if (surnameIndex === -1) {
    return trimmed;
  }

  const surname = tokens[surnameIndex];
  const initialsTokens = tokens.slice(surnameIndex + 1);
  const initials = [];

  for (const token of initialsTokens) {
    const letters = token.replace(/[^А-ЯЁ]/g, '');
    for (const letter of letters) {
      if (initials.length < 2) {
        initials.push(letter);
      }
    }
    if (initials.length >= 2) {
      break;
    }
  }

  if (initials.length === 0) {
    return surname;
  }

  const formattedInitials = initials.map(letter => `${letter}.`).join(' ');
  return `${surname} ${formattedInitials}`;
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
