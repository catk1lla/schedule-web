const { useState, useMemo, useEffect, useCallback, useRef, useContext } = React;
const { formatCountdown, formatCountdownAria } = (typeof CountdownUtils !== 'undefined' && CountdownUtils) || {};

if (typeof formatCountdown !== 'function' || typeof formatCountdownAria !== 'function') {
  throw new Error('Countdown utilities are not available.');
}

const SCHEDULE_ODD = [
  { day: 'Понедельник', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'практика', subgroup: null, subject: 'Электив по физической культуре и спорту', place: 'спорткомплекс 6-го учебного корпуса', teacher: 'Андронова Л. Н.', note: '' },

  { day: 'Вторник', pair: 1, time: '08:00-09:35', weeks: 'odd', type: 'лекция', subgroup: null, subject: 'Основы российской государственности', place: '6427', teacher: 'Седаев П. В.', note: '' },
  { day: 'Пятница', pair: 1, time: '08:00-09:35', weeks: 'all', type: 'практика', subgroup: null, subject: 'Математика', place: '6520', teacher: 'Малышев И. Г.', note: '' },
  { day: 'Суббота', pair: 1, time: '08:00-09:35', weeks: 'all', type: 'лабораторная', subgroup: 1, subject: 'Программирование на Java', place: '6451', teacher: 'Зарубин И. Б.', note: '' },

  { day: 'Вторник', pair: 2, time: '09:45-11:20', weeks: 'odd', type: 'лекция', subgroup: null, subject: 'Графические информационные технологии', place: '6246', teacher: 'ст. пр. Малаканова М. А.', note: '' },
  { day: 'Среда', pair: 2, time: '09:45-11:20', weeks: 'odd', type: 'практика', subgroup: 2, subject: 'Иностранный язык (англ.)', place: '6523', teacher: 'Зазыкина Т. Н.', note: '' },
  { day: 'Четверг', pair: 2, time: '09:45-11:20', weeks: 'all', type: 'практика', subgroup: null, subject: 'Дискретная математика', place: '6345', teacher: 'доц. Степаненко М. А.', note: '' },
  { day: 'Пятница', pair: 2, time: '09:45-11:20', weeks: 'all', type: 'лекция', subgroup: null, subject: 'История', place: '6245', teacher: 'проф. Гордина Е. Д.', note: '' },
  { day: 'Суббота', pair: 2, time: '09:45-11:20', weeks: 'all', type: 'практика', subgroup: null, subject: 'Основы российской государственности', place: '6515', teacher: 'Седаев П. В.', note: '' },

  { day: 'Вторник', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лабораторная', subgroup: '1-2', subject: 'Основы Web-технологий', place: '6143/6251', teacher: 'Глумова Е. С.; Бойтякова К. А.', note: '' },
  { day: 'Среда', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лабораторная', subgroup: '1-2', subject: 'Графические информационные технологии', place: '6339/6342', teacher: 'Малаканова М. А.; Серова М. А.', note: '' },
  { day: 'Четверг', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Математика', place: '6128', teacher: 'доц. Малышев И. Г.', note: '' },
  { day: 'Пятница', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Дискретная математика', place: '6258', teacher: 'доц. Степаненко М. А.', note: '' },
  { day: 'Суббота', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Программирование на Java', place: '6455', teacher: 'Зарубин И. Б.', note: '' },

  { day: 'Вторник', pair: 4, time: '13:40-15:15', weeks: 'all', type: 'практика', subgroup: 1, subject: 'Иностранный язык (англ.)', place: '6235', teacher: 'Ерофеева А. В.', note: '' },
  { day: 'Пятница', pair: 4, time: '13:40-15:15', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Основы Web-технологий', place: '6425', teacher: 'Курушин Е. А.', note: '' },

  { day: 'Среда', pair: 5, time: '15:25-17:00', weeks: 'odd', type: '-', subgroup: null, subject: 'Час куратора', place: '6429', teacher: '–', note: 'точечные недели: 3, 7, 11, 15; по нечётным', weeksList: [3, 7, 11, 15] },
  { day: 'Пятница', pair: 5, time: '15:25-17:00', weeks: 'all', type: 'практика', subgroup: 2, subject: 'Программирование на Java', place: '6451', teacher: 'Зарубин И. Б.', note: '' }
];

const SCHEDULE_EVEN = [
  { day: 'Понедельник', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'практика', subgroup: null, subject: 'Электив по физической культуре и спорту', place: 'спорткомплекс 6-го учебного корпуса', teacher: 'Андронова Л. Н.', note: '' },

  { day: 'Четверг', pair: 1, time: '08:00-09:35', weeks: 'even', type: 'практика', subgroup: null, subject: 'Математика', place: '6532', teacher: 'Малышев И. Г.', note: '' },
  { day: 'Пятница', pair: 1, time: '08:00-09:35', weeks: 'all', type: 'практика', subgroup: null, subject: 'Математика', place: '6520', teacher: 'Малышев И. Г.', note: '' },
  { day: 'Суббота', pair: 1, time: '08:00-09:35', weeks: 'all', type: 'лабораторная', subgroup: 1, subject: 'Программирование на Java', place: '6451', teacher: 'Зарубин И. Б.', note: '' },

  { day: 'Вторник', pair: 2, time: '09:45-11:20', weeks: 'even', type: 'лекция', subgroup: null, subject: 'Математика', place: '6126', teacher: 'доц. Малышев И. Г.', note: '' },
  { day: 'Четверг', pair: 2, time: '09:45-11:20', weeks: 'all', type: 'практика', subgroup: null, subject: 'Дискретная математика', place: '6345', teacher: 'доц. Степаненко М. А.', note: '' },
  { day: 'Пятница', pair: 2, time: '09:45-11:20', weeks: 'all', type: 'лекция', subgroup: null, subject: 'История', place: '6245', teacher: 'проф. Гордина Е. Д.', note: '' },
  { day: 'Суббота', pair: 2, time: '09:45-11:20', weeks: 'all', type: 'практика', subgroup: null, subject: 'Основы российской государственности', place: '6515', teacher: 'Седаев П. В.', note: '' },

  { day: 'Вторник', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лабораторная', subgroup: '1-2', subject: 'Основы Web-технологий', place: '6143/6251', teacher: 'Глумова Е. С.; Бойтякова К. А.', note: '' },
  { day: 'Среда', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лабораторная', subgroup: '1-2', subject: 'Графические информационные технологии', place: '6339/6342', teacher: 'Малаканова М. А.; Серова М. А.', note: '' },
  { day: 'Четверг', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Математика', place: '6128', teacher: 'доц. Малышев И. Г.', note: '' },
  { day: 'Пятница', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Дискретная математика', place: '6258', teacher: 'доц. Степаненко М. А.', note: '' },
  { day: 'Суббота', pair: 3, time: '11:35-13:10', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Программирование на Java', place: '6455', teacher: 'Зарубин И. Б.', note: '' },

  { day: 'Вторник', pair: 4, time: '13:40-15:15', weeks: 'all', type: 'практика', subgroup: 1, subject: 'Иностранный язык (англ.)', place: '6235', teacher: 'Ерофеева А. В.', note: '' },
  { day: 'Четверг', pair: 4, time: '13:40-15:15', weeks: 'even', type: 'практика', subgroup: null, subject: 'История России', place: '6411', teacher: 'Гордина Е. Д.', note: '' },
  { day: 'Пятница', pair: 4, time: '13:40-15:15', weeks: 'all', type: 'лекция', subgroup: null, subject: 'Основы Web-технологий', place: '6425', teacher: 'Курушин Е. А.', note: '' },

  { day: 'Четверг', pair: 5, time: '15:25-17:00', weeks: 'even', type: 'практика', subgroup: 2, subject: 'Иностранный язык (англ.)', place: '6324', teacher: 'Зазыкина Т. Н.', note: '' },
  { day: 'Пятница', pair: 5, time: '15:25-17:00', weeks: 'all', type: 'практика', subgroup: 2, subject: 'Программирование на Java', place: '6451', teacher: 'Зарубин И. Б.', note: '' }
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

const DEFAULT_LANGUAGE = 'ru';

const TRANSLATIONS = {
  ru: {
    theme: {
      system: 'Системная тема',
      light: 'Светлая тема',
      dark: 'Тёмная тема'
    },
    brand: {
      title: 'Расписание учебных пар',
      tagline: 'Учебный ритм под контролем',
      description: 'Следите за текущими и предстоящими парами, фильтруйте подгруппы и выбирайте удобную тему оформления.',
      academicWeek: weekNumber => `Академическая неделя №${weekNumber}`,
      autoDetection: parityLabel => `Автоопределение: ${parityLabel} неделя`
    },
    navigation: {
      ariaLabel: 'Навигация по разделам'
    },
    sections: {
      today: 'Сегодня',
      tomorrow: 'Завтра',
      week: 'Расписание',
      filters: 'Фильтры'
    },
    parity: {
      label: 'Чётность недели',
      auto: 'Авто',
      all: 'Все',
      odd: 'Нечётная',
      even: 'Чётная',
      autoOdd: 'нечётная',
      autoEven: 'чётная'
    },
    filters: {
      heading: 'Фильтры',
      helper: 'Выберите параметры, чтобы оставить только нужные занятия.',
      subgroup: 'Подгруппа',
      type: 'Тип занятия',
      day: 'День недели',
      reset: 'Сбросить фильтры',
      subgroupOptions: {
        all: 'Все подгруппы',
        '1': 'Подгруппа 1',
        '2': 'Подгруппа 2'
      },
      typeOptions: {
        all: 'Все типы'
      },
      dayOptions: {
        all: 'Все дни'
      }
    },
    today: {
      noPairsBadge: 'Сегодня пар нет',
      noPairsMessage: 'Можно посвятить день отдыху или самостоятельной подготовке.',
      dayDoneBadge: 'Учебный день завершён',
      dayDoneTitle: 'На сегодня занятий больше нет',
      dayDoneMessage: 'Хорошего отдыха! Следующие занятия начнутся в другой день.',
      currentBadge: 'Текущая пара',
      currentMessage: 'Сейчас идёт занятие. Удачного обучения!',
      countdownLabel: 'Пара идёт',
      countdownAria: 'Занятие в процессе',
      breakBadge: 'Перерыв',
      firstBadge: 'До первой пары',
      breakMessageSuffix: ' Скоро продолжим занятия.',
      firstMessageSuffix: ' Ещё есть время подготовиться.',
      listAria: 'Пары на сегодня',
      progressAria: value => `Осталось ${value}% времени пары`
    },
    tomorrow: {
      noPairsBadge: 'Завтра пар нет',
      noPairsMessage: 'Выходной день — занятия не запланированы.',
      listAria: dayLabel => `Занятия на ${dayLabel}`
    },
    statuses: {
      current: 'Сейчас',
      next: 'Следующая',
      past: 'Завершена'
    },
    pair: {
      roomPrefix: 'ауд.',
      numberLabel: value => `${value}-я пара`,
      subgroupLabels: {
        first: '1-я подгруппа',
        second: '2-я подгруппа',
        combined: '1-я и 2-я подгруппы'
      }
    },
    week: {
      listAria: 'Занятия на неделю',
      dayAria: dayLabel => `Занятия на ${dayLabel}`,
      emptyNote: 'По выбранным фильтрам занятия не найдены.',
      noDaysSelected: 'Дни не выбраны.',
      dayEmpty: 'В этот день занятий нет.'
    },
    footer: {
      themeLabel: 'Тема интерфейса',
      themeButtonLabel: theme => `Текущая тема: ${theme} (нажмите, чтобы переключить)`,
      themeButtonTitle: theme => `Тема: ${theme}`,
      navHeading: 'Разделы',
      extrasHeading: 'Дополнительно',
      nav: {
        today: 'Сегодня',
        tomorrow: 'Завтра',
        week: 'Неделя',
        filters: 'Фильтры'
      },
      universityLink: 'Сайт университета',
      updateInfo: 'Обновление расписания: еженедельно',
      copyright: year => `© ${year} Расписание учебных пар`,
      lastUpdated: 'Последнее обновление по московскому времени'
    },
    countdown: {
      zero: '0 сек',
      running: 'Пара идёт',
      labelPrefix: 'До начала: {duration}',
      endLabelPrefix: 'До конца: {duration}',
      ariaPrefix: 'До начала пары осталось {duration}',
      ariaEndPrefix: 'До конца пары осталось {duration}',
      secondsZero: 'До начала пары осталось 0 секунд',
      endSecondsZero: 'До конца пары осталось 0 секунд',
      startPrefixWithTime: time => `Начало в ${time}.`,
      startPrefixSoon: 'Начало совсем скоро.',
      startSuffixAfterClasses: ' Скоро продолжим занятия.',
      startSuffixBeforeClasses: ' Ещё есть время подготовиться.',
      unitsShort: {
        days: 'д',
        hours: 'ч',
        minutes: 'мин',
        seconds: 'сек'
      },
      unitsLong: {
        days: ['день', 'дня', 'дней'],
        hours: ['час', 'часа', 'часов'],
        minutes: ['минута', 'минуты', 'минут'],
        seconds: ['секунда', 'секунды', 'секунд']
      }
    },
    parityLabels: {
      odd: 'Нечётная неделя',
      even: 'Чётная неделя',
      all: 'Все недели'
    },
    typeLabels: {
      '-': 'Тип не указан',
      'лекция': 'Лекция',
      'практика': 'Практика',
      'лабораторная': 'Лабораторная'
    },
    dayNames: {
      full: {
        'Понедельник': 'Понедельник',
        'Вторник': 'Вторник',
        'Среда': 'Среда',
        'Четверг': 'Четверг',
        'Пятница': 'Пятница',
        'Суббота': 'Суббота',
        'Воскресенье': 'Воскресенье'
      },
      short: {
        'Понедельник': 'Пн',
        'Вторник': 'Вт',
        'Среда': 'Ср',
        'Четверг': 'Чт',
        'Пятница': 'Пт',
        'Суббота': 'Сб',
        'Воскресенье': 'Вс'
      }
    },
    monthNames: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    timezoneLabel: '(МСК)',
    errors: {
      fallbackTitle: 'Не удалось загрузить расписание',
      fallbackMessage: 'Попробуйте обновить страницу или зайдите позже.'
    }
  }
};

const TranslationContext = React.createContext({
  language: DEFAULT_LANGUAGE,
  texts: TRANSLATIONS[DEFAULT_LANGUAGE]
});

function useTranslation() {
  return useContext(TranslationContext);
}

function Container({ as: Component = 'div', className = '', children, ...props }) {
  const combinedClassName = className ? `app-container ${className}` : 'app-container';
  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}

const WEEK_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const WEEKDAY_MAP = {
  'понедельник': 'Понедельник',
  'вторник': 'Вторник',
  'среда': 'Среда',
  'четверг': 'Четверг',
  'пятница': 'Пятница',
  'суббота': 'Суббота',
  'воскресенье': 'Воскресенье'
};

const MS_IN_DAY = 86400000;
const MOSCOW_UTC_OFFSET = 3;
let moscowDateTimeFormatter;

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

const SUBGROUP_VALUES = ['all', '1', '2'];
const DAY_OPTION_VALUES = ['all', ...WEEK_DAYS];
const COMBINED_SUBGROUP_VALUES = ['1-2', 'Подгруппы 1, 2'];

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

function buildFilterGroups(texts) {
  const subgroupOptions = SUBGROUP_VALUES.map(value => ({
    value,
    label: value === 'all'
      ? texts.filters.subgroupOptions.all
      : texts.filters.subgroupOptions[value] || value
  }));

  const typeOptions = [
    { value: 'all', label: texts.filters.typeOptions.all },
    ...TYPE_VALUES.map(value => ({
      value,
      label: formatTypeLabel(value, texts)
    }))
  ];

  const dayOptions = [
    { value: 'all', label: texts.filters.dayOptions.all },
    ...WEEK_DAYS.map(day => ({
      value: day,
      label: texts.dayNames.full[day] || day
    }))
  ];

  return [
    {
      field: 'subgroup',
      label: texts.filters.subgroup,
      ariaLabel: texts.filters.subgroup,
      options: subgroupOptions
    },
    {
      field: 'type',
      label: texts.filters.type,
      ariaLabel: texts.filters.type,
      options: typeOptions
    },
    {
      field: 'day',
      label: texts.filters.day,
      ariaLabel: texts.filters.day,
      options: dayOptions
    }
  ];
}

function getFilterOptionVariant(field, value) {
  if (field === 'subgroup') {
    if (value === '1') return 'subgroup-first';
    if (value === '2') return 'subgroup-second';
    if (value === '1-2') return 'subgroup-combined';
    return 'subgroup-all';
  }

  if (field === 'type') {
    const variant = getTypeVariant(value);
    return variant ? `type-${variant}` : null;
  }

  if (field === 'day') {
    if (value === 'all') return 'day-all';
    return value === 'Суббота' ? 'day-weekend' : 'day-weekday';
  }

  return null;
}

const THEME_SEQUENCE = ['system', 'light', 'dark'];
const NAV_SCROLL_HOLD_MS = 900;

function App() {
  const now = useMoscowNow();

  const translations = TRANSLATIONS[DEFAULT_LANGUAGE];
  const filterGroups = useMemo(() => buildFilterGroups(translations), [translations]);

  const [parityMode, setParityMode] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.parity);
    return stored === 'odd' || stored === 'even' || stored === 'auto' || stored === 'all' ? stored : 'auto';
  });

  const [themeMode, setThemeMode] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.theme);
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';
  });
  const [systemTheme, setSystemTheme] = useState(() => getPreferredTheme());
  const [headerHidden, setHeaderHidden] = useState(false);
  const [todayCollapsed, setTodayCollapsed] = useState(true);
  const [tomorrowCollapsed, setTomorrowCollapsed] = useState(true);
  const headerHoldUntilRef = useRef(0);

  const [filters, setFilters] = useState(() => {
    const storedSubgroup = readStorage(STORAGE_KEYS.subgroup);
    const storedDay = readStorage(STORAGE_KEYS.day);
    const storedType = readStorage(STORAGE_KEYS.type);
    const validSubgroups = new Set(SUBGROUP_VALUES);
    const validDays = new Set(DAY_OPTION_VALUES);
    const validTypes = new Set(['all', ...TYPE_VALUES]);
    return {
      ...createDefaultFilters(),
      subgroup: validSubgroups.has(storedSubgroup) ? storedSubgroup : 'all',
      day: validDays.has(storedDay) ? storedDay : 'all',
      type: validTypes.has(storedType) ? storedType : 'all'
    };
  });

  const holdHeaderVisible = useCallback(() => {
    setHeaderHidden(false);
    if (typeof window !== 'undefined') {
      headerHoldUntilRef.current = Date.now() + NAV_SCROLL_HOLD_MS;
    }
  }, [setHeaderHidden]);

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
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('lang', DEFAULT_LANGUAGE);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = translations.brand.title;
    }
  }, [translations]);

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
        const holdUntil = headerHoldUntilRef.current || 0;
        const nowTimestamp = Date.now();

        if (holdUntil > nowTimestamp) {
          setHeaderHidden(false);
          lastY = currentY;
          rafId = null;
          return;
        }

        if (holdUntil && holdUntil <= nowTimestamp) {
          headerHoldUntilRef.current = 0;
        }

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
    writeStorage(STORAGE_KEYS.day, filters.day);
    writeStorage(STORAGE_KEYS.type, filters.type);
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
      filters,
      texts: translations
    });
  }, [scheduleSource, now, parityMode, effectiveParity, autoParity, academicWeekNumber, filters, translations]);

  const tomorrowParts = useMemo(() => {
    const baseDate = now.isoDate instanceof Date ? now.isoDate : new Date();
    const tomorrowDate = new Date(baseDate.getTime() + MS_IN_DAY);
    return extractMoscowParts(tomorrowDate);
  }, [now]);

  const { parity: tomorrowAcademicParity, weekNumber: tomorrowWeekNumber } = useMemo(() => {
    return computeAcademicParity(tomorrowParts);
  }, [tomorrowParts]);

  const tomorrowParity = parityMode === 'all'
    ? 'all'
    : parityMode === 'auto'
      ? tomorrowAcademicParity
      : parityMode;

  const tomorrowScheduleSource = parityMode === 'all'
    ? SCHEDULE_COMBINED
    : tomorrowParity === 'odd'
      ? SCHEDULE_ODD
      : SCHEDULE_EVEN;

  const tomorrowEntries = useMemo(() => {
    const tomorrowDayName = WEEKDAY_MAP[tomorrowParts.weekday] || 'Воскресенье';
    return getEntriesForDay({
      schedule: tomorrowScheduleSource,
      dayName: tomorrowDayName,
      parity: tomorrowParity,
      weekNumber: tomorrowWeekNumber,
      filters
    });
  }, [tomorrowScheduleSource, tomorrowParts, tomorrowParity, tomorrowWeekNumber, filters]);

  const dayFilterList = filters.day === 'all' ? WEEK_DAYS : WEEK_DAYS.filter(day => day === filters.day);
  const filtersAreDefault = isDefaultFilters(filters);

  const currentYear = now.year;
  const themeLabel = translations.theme[themeMode] || themeMode;
  const autoParityLabel = autoParity === 'odd' ? translations.parity.autoOdd : translations.parity.autoEven;
  const parityChipText = getParityLabel(autoParity, translations) || autoParityLabel;
  const translationContextValue = useMemo(() => ({
    language: DEFAULT_LANGUAGE,
    texts: translations
  }), [translations]);
  const navItems = useMemo(() => ([
    { id: 'today', label: translations.sections.today },
    { id: 'tomorrow', label: translations.sections.tomorrow },
    { id: 'week', label: translations.sections.week }
  ]), [translations]);
  const navigationLabel = translations.navigation?.ariaLabel || translations.brand.title;
  const handleNavAnchorClick = useCallback(() => {
    holdHeaderVisible();
  }, [holdHeaderVisible]);
  const todayHeading = useMemo(() => formatDayHeading(now, translations), [now, translations]);
  const tomorrowHeading = useMemo(() => formatDayHeading(tomorrowParts, translations), [tomorrowParts, translations]);
  const todayContentId = 'today-section-content';
  const tomorrowContentId = 'tomorrow-section-content';
  const todayHeadingId = 'today-section-title';
  const tomorrowHeadingId = 'tomorrow-section-title';
  const todayCaptionId = 'today-section-caption';
  const tomorrowCaptionId = 'tomorrow-section-caption';

  return (
    <TranslationContext.Provider value={translationContextValue}>
      <div className="app-shell">
        <header className={`app-header${headerHidden ? ' is-hidden' : ''}`}>
          <Container className="header-inner">
            <div className="brand-line">
              <div className="brand-block" aria-live="polite">
                <h1>{translations.brand.title}</h1>
                <div className="brand-meta">
                  <span className="brand-meta-text">{translations.brand.academicWeek(academicWeekNumber)}</span>
                  <span
                    className={`brand-parity-chip brand-parity-chip--${autoParity}`}
                    aria-label={translations.brand.autoDetection(parityChipText)}
                  >
                    {parityChipText}
                  </span>
                </div>
              </div>
              <nav className="site-nav" aria-label={navigationLabel}>
                {navItems.map(item => (
                  <a key={item.id} href={`#${item.id}`} onClick={handleNavAnchorClick}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </Container>
        </header>

        <main className="app-main">
          {todayInfo.mode !== 'empty' && (
            <Container className="app-section status-section">
              <StatusBlock
                info={todayInfo}
                parityMode={parityMode}
                showParityLabels={parityMode === 'all'}
              />
            </Container>
          )}

          <Container
            as="section"
            id="today"
            className={`app-section${todayCollapsed ? ' is-collapsed' : ''}`}
          >
            <div className="section-header">
              <h2 className="section-heading" id={todayHeadingId}>
                <button
                  type="button"
                  className={`section-heading-button${todayCollapsed ? '' : ' is-open'}`}
                  onClick={() => setTodayCollapsed(value => !value)}
                  aria-expanded={!todayCollapsed}
                  aria-controls={todayContentId}
                  aria-describedby={todayCaptionId}
                >
                  <span className="section-heading-main">
                    <span className="section-heading-title">{translations.sections.today}</span>
                    <span className="section-caption" id={todayCaptionId}>{todayHeading}</span>
                  </span>
                  <span className="section-toggle-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12" focusable="false">
                      <path
                        d="M3 4.5 6 7.5 9 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </h2>
            </div>
            <TodaySection
              info={todayInfo}
              showParityLabels={parityMode === 'all'}
              parityMode={parityMode}
              isCollapsed={todayCollapsed}
              contentId={todayContentId}
            />
          </Container>

          <Container
            as="section"
            id="tomorrow"
            className={`app-section${tomorrowCollapsed ? ' is-collapsed' : ''}`}
          >
            <div className="section-header">
              <h2 className="section-heading" id={tomorrowHeadingId}>
                <button
                  type="button"
                  className={`section-heading-button${tomorrowCollapsed ? '' : ' is-open'}`}
                  onClick={() => setTomorrowCollapsed(value => !value)}
                  aria-expanded={!tomorrowCollapsed}
                  aria-controls={tomorrowContentId}
                  aria-describedby={tomorrowCaptionId}
                >
                  <span className="section-heading-main">
                    <span className="section-heading-title">{translations.sections.tomorrow}</span>
                    <span className="section-caption" id={tomorrowCaptionId}>{tomorrowHeading}</span>
                  </span>
                  <span className="section-toggle-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12" focusable="false">
                      <path
                        d="M3 4.5 6 7.5 9 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </h2>
            </div>
            <TomorrowSection
              entries={tomorrowEntries}
              dateParts={tomorrowParts}
              showParityLabels={parityMode === 'all'}
              parityMode={parityMode}
              isCollapsed={tomorrowCollapsed}
              contentId={tomorrowContentId}
            />
          </Container>

          <Container as="section" className="app-section week-section" id="week">
            <div className="section-header">
              <h2>{translations.sections.week}</h2>
            </div>
            <div className="schedule-controls-card week-controls-card">
              <div className="schedule-controls-head">
                <div className="filters-inline-header">
                  <p className="filters-inline-label">{translations.sections.filters}</p>
                  <p className="filters-inline-note">{translations.filters.helper}</p>
                </div>
                <div className="parity-inline-block">
                  <span className="filters-inline-label">{translations.parity.label}</span>
                  <ParitySelector parityMode={parityMode} onChange={setParityMode} />
                </div>
              </div>
              <FiltersPanel
                filters={filters}
                groups={filterGroups}
                onUpdateFilter={handleFilterChange}
                onReset={handleResetFilters}
                resetDisabled={filtersAreDefault}
              />
            </div>
            <WeekView
              days={dayFilterList}
              entries={visiblePairs}
              currentKey={todayInfo.currentKey}
              showParityLabels={parityMode === 'all'}
              parityMode={parityMode}
            />
          </Container>

        </main>

        <footer className="app-footer">
          <Container className="footer-inner">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-site-name">{translations.brand.title}</div>
                <div className="footer-meta-line">
                  <span className="footer-meta-item">{translations.footer.updateInfo}</span>
                  <span className="footer-meta-item">{translations.footer.lastUpdated}</span>
                </div>
              </div>
              <div className="footer-controls">
                <div className="footer-theme-control" role="group" aria-label={translations.footer.themeLabel}>
                  <span className="footer-theme-label">{translations.footer.themeLabel}</span>
                  <button
                    type="button"
                    className="theme-button footer-theme-button"
                    onClick={() => {
                      const currentIndex = THEME_SEQUENCE.indexOf(themeMode);
                      const nextIndex = (currentIndex + 1) % THEME_SEQUENCE.length;
                      setThemeMode(THEME_SEQUENCE[nextIndex]);
                    }}
                    aria-label={translations.footer.themeButtonLabel(themeLabel)}
                    title={translations.footer.themeButtonTitle(themeLabel)}
                  >
                    <ThemeIcon mode={themeMode} />
                  </button>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <small>{translations.footer.copyright(currentYear)}</small>
            </div>
          </Container>
        </footer>
      </div>
    </TranslationContext.Provider>
  );
}

function ParitySelector({ parityMode, onChange }) {
  const { texts } = useTranslation();
  const options = [
    { value: 'auto', label: texts.parity.auto },
    { value: 'all', label: texts.parity.all },
    { value: 'odd', label: texts.parity.odd },
    { value: 'even', label: texts.parity.even }
  ];

  return (
    <div className="parity-switch" role="group" aria-label={texts.parity.label}>
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

function FiltersPanel({ filters, groups = [], onUpdateFilter, onReset, resetDisabled = false }) {
  const { texts } = useTranslation();
  return (
    <div
      className="filters-panel"
      aria-label={texts.filters.heading}
    >
      {groups.map(group => (
        <div className="filter-field" key={group.field}>
          <span className="filter-label">{group.label}</span>
          <div className="filter-buttons" role="group" aria-label={group.ariaLabel}>
            {group.options.map(option => (
              <FilterOptionButton
                key={option.value}
                active={filters[group.field] === option.value}
                onClick={() => onUpdateFilter(group.field, option.value)}
                variant={getFilterOptionVariant(group.field, option.value)}
                field={group.field}
                value={option.value}
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
            aria-label={texts.filters.reset}
            title={texts.filters.reset}
          >
            {texts.filters.reset}
          </button>
        </div>
      )}
    </div>
  );
}

function FilterOptionButton({ active, onClick, disabled = false, children, variant, field, value }) {
  return (
    <button
      type="button"
      className={`filter-button${active ? ' active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant || undefined}
      data-filter-field={field || undefined}
      data-filter-value={value || undefined}
    >
      {children}
    </button>
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

function CountdownTicker({ summary, showSummary = true }) {
  const { texts } = useTranslation();
  if (!summary || !summary.countdownLabel) {
    return null;
  }

  const countdownDisplay = summary.countdownDisplay;
  const showProgress = summary.state === 'current' && typeof summary.progress === 'number';
  const progressValue = summary.progress != null ? Math.round(summary.progress) : 0;
  const bannerClasses = ['countdown-banner'];
  if (showProgress) {
    bannerClasses.push('is-current');
  }
  if (!showSummary) {
    bannerClasses.push('countdown-banner--inline');
  }

  return (
    <section className={bannerClasses.join(' ')} aria-live="polite">
      {showSummary && (
        <div className="countdown-banner-head">
          {summary.badge && <span className="badge countdown-badge">{summary.badge}</span>}
          {summary.title && <p className="countdown-banner-title">{summary.title}</p>}
        </div>
      )}
      <div className="countdown-line">
        <div
          className="countdown-value"
          role={summary.countdownRole || undefined}
          aria-live={summary.countdownLive || undefined}
          aria-label={summary.countdownAria || undefined}
          aria-atomic={summary.countdownLive ? 'true' : undefined}
        >
          {countdownDisplay ? (
            <>
              {countdownDisplay.prefix && (
                <span className="countdown-label-text">{countdownDisplay.prefix}</span>
              )}
              <span className="countdown-time">{countdownDisplay.value}</span>
              {countdownDisplay.suffix && (
                <span className="countdown-label-text">{countdownDisplay.suffix}</span>
              )}
            </>
          ) : (
            <span className="countdown-time">{summary.countdownLabel}</span>
          )}
        </div>
        {showProgress && (
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progressValue}
            aria-valuetext={texts.today.progressAria(progressValue)}
          >
            <div className="progress-fill" style={{ width: `${summary.progress}%` }}></div>
          </div>
        )}
      </div>
    </section>
  );
}

function PairEntryItem({ item, texts, showParityLabels, parityMode }) {
  const entry = item.entry;
  const entryKey = item.key;
  const subgroupBadge = getSubgroupBadge(entry.subgroup, texts);
  const parityTone = getParityVariant(entry.weeks);
  const parityLabel = showParityLabels && parityTone ? getParityLabel(entry.weeks, texts) : null;
  const parityCardVariant = (showParityLabels || parityMode !== 'all') ? null : parityTone;
  const teacherLabel = formatTeacherNames(entry.teacher);
  const showTeacher = teacherLabel !== '';
  const note = (entry.note || '').trim();
  const typeVariant = getTypeVariant(entry.type);
  const hasTags = showTeacher || note;
  const statusClass = item.status === 'current'
    ? ' is-current'
    : item.status === 'next'
      ? ' is-next'
      : item.status === 'past'
        ? ' is-past'
        : '';
  const showStatusChip = item.status === 'current' || item.status === 'next' || item.status === 'past';
  const statusLabel = item.status === 'current'
    ? texts.statuses.current
    : item.status === 'next'
      ? texts.statuses.next
      : texts.statuses.past;

  return (
    <li
      key={entryKey}
      className={`pair-entry${statusClass}${parityCardVariant ? ` parity-${parityCardVariant}` : ''}`}
      aria-current={item.status === 'current' ? 'true' : undefined}
    >
      <div className="pair-entry-header">
        <div className="pair-entry-time">
          <span className="pair-entry-number">
            {typeof entry.pair === 'number' ? texts.pair.numberLabel(entry.pair) : entry.pair}
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
        <div className="pair-entry-room">{`${texts.pair.roomPrefix} ${entry.place}`}</div>
      </div>
      <div className="pair-entry-footer">
        <span className={`meta-chip meta-chip-type meta-chip-type--${typeVariant}`}>
          {formatTypeLabel(entry.type, texts)}
        </span>
        <div className="pair-entry-tags">
          {showStatusChip && (
            <span className="meta-chip meta-chip-status">{statusLabel}</span>
          )}
          {showTeacher && (
            <span className="meta-chip meta-chip-muted">{teacherLabel}</span>
          )}
          {note && <span className="meta-chip meta-chip-note">{note}</span>}
        </div>
      </div>
    </li>
  );
}

function StatusBlock({ info, parityMode, showParityLabels }) {
  const { texts } = useTranslation();
  const { summary, highlightParity, entries, highlightKey } = info;
  if (!summary) return null;

  const isCurrent = summary.state === 'current';
  const cardParityVariant = (showParityLabels || parityMode !== 'all') ? null : highlightParity;
  const showCountdown = Boolean(summary.countdownLabel);
  const pinnedItem = highlightKey ? entries.find(item => item.key === highlightKey) : null;

  const classes = ['today-card', 'status-card'];
  if (isCurrent) {
    classes.push('current');
  }
  if (cardParityVariant) {
    classes.push(`parity-${cardParityVariant}`);
  }
  if (showCountdown) {
    classes.push('has-countdown');
  }

  return (
    <article className={classes.join(' ')} aria-live="polite">
      <div className="today-summary">
        <div className="today-overview">
          <div className="today-head">
            <span className="badge">{summary.badge}</span>
          </div>
          <div className="today-main">
            <h3 className="today-title">{summary.title}</h3>
            {summary.message && <p className="info-text">{summary.message}</p>}
          </div>
        </div>
        {showCountdown && (
          <div className="today-countdown">
            <CountdownTicker summary={summary} showSummary={false} />
          </div>
        )}
      </div>
      {pinnedItem && (
        <div className="section-pinned-list">
          <ul className="day-pair-list today-pair-list today-pinned-list" aria-label={texts.today.listAria}>
            <PairEntryItem
              item={pinnedItem}
              texts={texts}
              showParityLabels={showParityLabels}
              parityMode={parityMode}
            />
          </ul>
        </div>
      )}
    </article>
  );
}

function TodaySection({ info, showParityLabels, parityMode, isCollapsed = false, contentId }) {
  const { texts } = useTranslation();

  let content;

  if (info.mode === 'empty') {
    content = (
      <div className="summary-card" aria-live="polite">
        <span className="badge">{texts.today.noPairsBadge}</span>
        <p className="info-text">{texts.today.noPairsMessage}</p>
      </div>
    );
  } else {
    const { entries, highlightParity } = info;
    const cardParityVariant = (showParityLabels || parityMode !== 'all') ? null : highlightParity;
    const todayCardClasses = ['today-card', 'today-card--list'];
    if (cardParityVariant) {
      todayCardClasses.push(`parity-${cardParityVariant}`);
    }

    content = (
      <article
        className={todayCardClasses.join(' ')}
        aria-live="polite"
      >
        {entries.length > 0 && (
          <ul className="day-pair-list today-pair-list" aria-label={texts.today.listAria}>
            {entries.map(item => (
              <PairEntryItem
                key={item.key}
                item={item}
                texts={texts}
                showParityLabels={showParityLabels}
                parityMode={parityMode}
              />
            ))}
          </ul>
        )}
      </article>
    );
  }

  return (
    <CollapsibleRegion
      id={contentId}
      isCollapsed={isCollapsed}
    >
      {content}
    </CollapsibleRegion>
  );
}

function TomorrowSection({ entries, dateParts, showParityLabels, parityMode, isCollapsed = false, contentId }) {
  const { texts } = useTranslation();
  const baseDayName = WEEKDAY_MAP[dateParts.weekday] || dateParts.weekday || '';
  const dayName = texts.dayNames.full[baseDayName] || capitalize(baseDayName);
  const dateLabel = formatDayDate(dateParts, texts);
  const content = !entries.length
    ? (
      <div className="summary-card" aria-live="polite">
        <span className="badge">{texts.tomorrow.noPairsBadge}</span>
        <p className="info-text">{texts.tomorrow.noPairsMessage}</p>
      </div>
    )
    : (
      <article className="tomorrow-card" aria-live="polite" aria-label={texts.tomorrow.listAria(dayName)}>
        <div className="tomorrow-info">
          <div className="tomorrow-dayline">
            <span className="tomorrow-day-name">{dayName}</span>
            <span className="tomorrow-date">{dateLabel}</span>
          </div>
        </div>
        <ul className="day-pair-list tomorrow-pair-list">
          {entries.map(entry => {
            const entryKey = createEntryKey(entry);
            const subgroupBadge = getSubgroupBadge(entry.subgroup, texts);
            const parityTone = getParityVariant(entry.weeks);
            const parityLabel = showParityLabels && parityTone ? getParityLabel(entry.weeks, texts) : null;
            const parityCardVariant = (showParityLabels || parityMode !== 'all') ? null : parityTone;
            const teacherLabel = formatTeacherNames(entry.teacher);
            const showTeacher = teacherLabel !== '';
            const typeVariant = getTypeVariant(entry.type);
            const note = (entry.note || '').trim();
            const hasTags = showTeacher || note;
            return (
              <li
                key={entryKey}
                className={`pair-entry${parityCardVariant ? ` parity-${parityCardVariant}` : ''}`}
              >
                <div className="pair-entry-header">
                  <div className="pair-entry-time">
                    <span className="pair-entry-number">
                      {typeof entry.pair === 'number' ? texts.pair.numberLabel(entry.pair) : entry.pair}
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
                  <div className="pair-entry-room">{`${texts.pair.roomPrefix} ${entry.place}`}</div>
                </div>
                <div className="pair-entry-footer">
                  <span className={`meta-chip meta-chip-type meta-chip-type--${typeVariant}`}>
                    {formatTypeLabel(entry.type, texts)}
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
      </article>
    );

  return (
    <CollapsibleRegion
      id={contentId}
      isCollapsed={isCollapsed}
    >
      {content}
    </CollapsibleRegion>
  );
}

function CollapsibleRegion({ id, isCollapsed, className = '', children }) {
  const regionRef = useCollapsibleMotion(isCollapsed);
  const classes = ['section-collapse-region', isCollapsed ? 'is-collapsed' : 'is-expanded'];
  if (className) {
    classes.push(className);
  }
  return (
    <div
      id={id}
      ref={regionRef}
      className={classes.join(' ')}
      aria-hidden={isCollapsed}
    >
      {children}
    </div>
  );
}
function WeekView({ days, entries, currentKey, showParityLabels, parityMode }) {
  const { texts } = useTranslation();
  const scheduleByDay = useMemo(() => {
    return days.map(day => {
      const dayEntries = entries
        .filter(entry => entry.day === day && entry.pair !== 'вне пар')
        .slice()
        .sort(comparePairs)
        .map(entry => ({ entry, key: createEntryKey(entry) }));
      const displayName = texts.dayNames.full[day] || day;
      const shortLabel = texts.dayNames.short[day] || day.slice(0, 2);
      return { day, displayName, shortLabel, entries: dayEntries };
    });
  }, [days, entries, texts]);
  const carouselRef = useRef(null);
  const isMobileLayout = useMediaQuery('(max-width: 720px)');

  useEffect(() => {
    if (isMobileLayout) {
      return undefined;
    }

    const container = carouselRef.current;
    if (!container) return undefined;

    let pointerActive = false;
    let pointerCaptured = false;
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

      if (!isDragging) {
        const absTotalX = Math.abs(totalX);
        const absTotalY = Math.abs(totalY);

        if (absTotalX > DRAG_THRESHOLD && absTotalX > absTotalY) {
          isDragging = true;
          isVerticalScroll = false;
          container.classList.add('is-dragging');
          if (typeof onDragStart === 'function') {
            onDragStart();
          }
        } else if (absTotalY > DRAG_THRESHOLD && absTotalY >= absTotalX) {
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

    // Skip custom pointer drag for touch screens; native scrolling handles it.
    const onPointerDown = event => {
      const pointerType = event.pointerType || 'mouse';
      if (pointerType === 'mouse' && event.button !== 0) {
        return;
      }
      if (pointerType === 'touch') {
        return;
      }

      pointerActive = true;
      startGesture(event.clientX, event.clientY);
    };

    const onPointerMove = event => {
      if (!pointerActive) return;
      const shouldPrevent = moveGesture(event.clientX, event.clientY, () => {
        if (event.pointerType !== 'touch') {
          capturePointer(event);
        }
      });
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
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('keydown', onKeyDown);

    return () => {
      stopMomentum();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileLayout]);

  if (!days.length) {
    return <div className="empty-state">{texts.week.noDaysSelected}</div>;
  }

  const hasEntries = scheduleByDay.some(group => group.entries.length > 0);

  return (
    <div className="week-surface">
      <div
        className={`week-carousel${isMobileLayout ? ' is-mobile' : ''}`}
        ref={carouselRef}
        tabIndex={isMobileLayout ? undefined : 0}
        role="group"
        aria-label={texts.week.listAria}
      >
        <ol className="week-day-list">
          {scheduleByDay.map(({ day, displayName, shortLabel, entries: dayEntries }) => {
            const dayHasEntries = dayEntries.length > 0;
            return (
              <li
                key={day}
                className={`week-day-card${dayHasEntries ? '' : ' is-empty'}`}
                aria-label={texts.week.dayAria(displayName)}
              >
                <div className="week-day-header">
                  <span className="week-day-name">{displayName}</span>
                  <span className="week-day-short">{shortLabel}</span>
                </div>
                {dayHasEntries ? (
                  <ul className="day-pair-list">
                    {dayEntries.map(({ entry, key }) => {
                      const isCurrent = currentKey && currentKey === key;
                      const subgroupBadge = getSubgroupBadge(entry.subgroup, texts);
                      const parityTone = getParityVariant(entry.weeks);
                      const parityLabel = showParityLabels && parityTone ? getParityLabel(entry.weeks, texts) : null;
                      const parityCardVariant = (showParityLabels || parityMode !== 'all') ? null : parityTone;
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
                                {typeof entry.pair === 'number' ? texts.pair.numberLabel(entry.pair) : entry.pair}
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
                            <div className="pair-entry-room">{`${texts.pair.roomPrefix} ${entry.place}`}</div>
                          </div>
                          <div className="pair-entry-footer">
                            <span className={`meta-chip meta-chip-type meta-chip-type--${typeVariant}`}>
                              {formatTypeLabel(entry.type, texts)}
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
                  <p className="day-empty">{texts.week.dayEmpty}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {!hasEntries && (
        <p className="empty-table-note">{texts.week.emptyNote}</p>
      )}
    </div>
  );
}

function useCollapsibleMotion(isCollapsed) {
  const regionRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const node = regionRef.current;
    if (!node) {
      return undefined;
    }

    const setStaticState = () => {
      node.style.height = isCollapsed ? '0px' : 'auto';
      node.style.opacity = isCollapsed ? '0' : '1';
    };

    if (isFirstRender.current) {
      setStaticState();
      isFirstRender.current = false;
      return undefined;
    }

    if (prefersReducedMotion) {
      setStaticState();
      return undefined;
    }

    const requestFrame = typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame
      : callback => setTimeout(callback, 16);
    const cancelFrame = typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function'
      ? window.cancelAnimationFrame
      : clearTimeout;

    const isExpanding = !isCollapsed;
    const startHeight = node.scrollHeight;
    let rafId = null;

    if (isExpanding) {
      node.style.height = '0px';
      node.style.opacity = '0';
      rafId = requestFrame(() => {
        const target = node.scrollHeight || startHeight;
        node.style.height = `${target}px`;
        node.style.opacity = '1';
      });
    } else {
      node.style.height = `${startHeight}px`;
      node.style.opacity = '1';
      rafId = requestFrame(() => {
        node.style.height = '0px';
        node.style.opacity = '0';
      });
    }

    const handleTransitionEnd = event => {
      if (event.target !== node || event.propertyName !== 'height') {
        return;
      }
      if (isExpanding) {
        node.style.height = 'auto';
      }
    };

    node.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      node.removeEventListener('transitionend', handleTransitionEnd);
      if (rafId != null) {
        cancelFrame(rafId);
      }
    };
  }, [isCollapsed, prefersReducedMotion]);

  return regionRef;
}

function useMediaQuery(query, defaultValue = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia(query);
      const handleChange = event => setMatches(event.matches);
      setMatches(mediaQuery.matches);
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
    setMatches(defaultValue);
    return undefined;
  }, [query, defaultValue]);

  return matches;
}

function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
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

function getMoscowDateTimeFormatter() {
  if (!moscowDateTimeFormatter) {
    moscowDateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
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
  }
  return moscowDateTimeFormatter;
}

function extractMoscowParts(refDate) {
  const formatter = getMoscowDateTimeFormatter();
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

function getEntriesForDay({ schedule, dayName, parity, weekNumber, filters }) {
  const subgroupFilter = filters && typeof filters === 'object' ? filters.subgroup || 'all' : 'all';
  const typeFilter = filters && typeof filters === 'object' ? filters.type || 'all' : 'all';

  const baseEntries = schedule
    .filter(entry => entry.day === dayName && entry.pair !== 'вне пар')
    .filter(entry => occursThisWeek(entry, parity, weekNumber))
    .filter(entry => matchesSubgroup(entry, subgroupFilter))
    .sort(comparePairs);

  if (baseEntries.length === 0) {
    return [];
  }

  if (typeFilter === 'all') {
    return baseEntries;
  }

  const typeFiltered = baseEntries.filter(entry => matchesType(entry, typeFilter));
  return typeFiltered.length > 0 ? typeFiltered : baseEntries;
}

function computeTodayInfo({ schedule, now, parity, weekNumber, filters, texts }) {
  const todayName = WEEKDAY_MAP[now.weekday] || 'Воскресенье';

  const baseEntries = getEntriesForDay({
    schedule,
    dayName: todayName,
    parity,
    weekNumber,
    filters
  });

  if (baseEntries.length === 0) {
    return { mode: 'empty', currentKey: null, highlightKey: null };
  }

  const nowSeconds = now.secondsOfDay;
  const entries = [];
  let current = null;
  let next = null;

  for (const entry of baseEntries) {
    const range = parseTimeRange(entry.time);
    const startSeconds = range ? range.startSeconds : null;
    const endSeconds = range ? range.endSeconds : null;
    let status = 'upcoming';

    if (range) {
      if (nowSeconds >= endSeconds) {
        status = 'past';
      } else if (nowSeconds >= startSeconds) {
        status = 'current';
        current = { entry, startSeconds, endSeconds };
      } else if (!next) {
        status = 'next';
        next = { entry, startSeconds, endSeconds };
      }
    } else if (!next && !current) {
      status = 'next';
      next = { entry, startSeconds, endSeconds };
    }

    if (status === 'upcoming' && !next && !current && range && nowSeconds < startSeconds) {
      status = 'next';
      next = { entry, startSeconds, endSeconds };
    }

    entries.push({
      entry,
      status,
      key: createEntryKey(entry)
    });
  }

  const hasPastEntries = entries.some(item => item.status === 'past');
  const highlightEntry = current ? current.entry : next ? next.entry : null;
  const highlightParity = highlightEntry ? getParityVariant(highlightEntry.weeks) : null;
  const highlightKey = highlightEntry ? createEntryKey(highlightEntry) : null;

  if (!current && !next) {
    return {
      mode: 'list',
      summary: {
        state: 'done',
        badge: texts.today.dayDoneBadge,
        title: texts.today.dayDoneTitle,
        message: texts.today.dayDoneMessage,
        countdownLabel: null,
        countdownAria: null,
        countdownRole: null,
        countdownLive: null,
        progress: null,
        countdownDisplay: null
      },
      entries,
      highlightParity,
      highlightKey,
      currentKey: null
    };
  }

  if (current) {
    let countdownLabel = texts.today.countdownLabel;
    let countdownAria = texts.today.countdownAria;
    let countdownRole = 'status';
    const countdownLive = 'polite';
    let countdownDisplay = null;

    if (typeof current.endSeconds === 'number' && nowSeconds < current.endSeconds) {
      const remainingMs = (current.endSeconds - nowSeconds) * 1000;
      const countdownTemplate = texts.countdown.endLabelPrefix;
      const countdownValue = formatCountdown(remainingMs, texts);
      countdownLabel = countdownTemplate.replace('{duration}', countdownValue);
      countdownAria = formatCountdownAria(remainingMs, texts, DEFAULT_LANGUAGE, {
        prefix: texts.countdown.ariaEndPrefix,
        zero: texts.countdown.endSecondsZero
      });
      countdownRole = 'timer';
      countdownDisplay = createCountdownDisplay(countdownTemplate, countdownValue);
    }

    return {
      mode: 'list',
      summary: {
        state: 'current',
        badge: texts.today.currentBadge,
        title: current.entry.subject,
        message: texts.today.currentMessage,
        countdownLabel,
        countdownDisplay,
        countdownAria,
        countdownRole,
        countdownLive,
        progress: computeProgress(nowSeconds, current.startSeconds, current.endSeconds)
      },
      entries,
      highlightParity,
      highlightKey,
      currentKey: createEntryKey(current.entry)
    };
  }

  const remainingMs = (next.startSeconds - nowSeconds) * 1000;
  const nextStartLabel = typeof next.entry.time === 'string'
    ? next.entry.time.split('-')[0]
    : '';
  const prefix = nextStartLabel
    ? texts.countdown.startPrefixWithTime(nextStartLabel)
    : texts.countdown.startPrefixSoon;
  const suffix = hasPastEntries
    ? texts.countdown.startSuffixAfterClasses
    : texts.countdown.startSuffixBeforeClasses;
  const countdownValue = formatCountdown(remainingMs, texts);
  const countdownTemplate = texts.countdown.labelPrefix;
  const countdownLabel = countdownTemplate.replace('{duration}', countdownValue);
  const countdownAria = formatCountdownAria(remainingMs, texts, DEFAULT_LANGUAGE);
  const countdownDisplay = createCountdownDisplay(countdownTemplate, countdownValue);

  return {
    mode: 'list',
    summary: {
      state: 'next',
      badge: hasPastEntries ? texts.today.breakBadge : texts.today.firstBadge,
      title: next.entry.subject,
      message: `${prefix}${suffix}`,
      countdownLabel,
      countdownDisplay,
      countdownAria,
      countdownRole: 'timer',
      countdownLive: 'polite',
      progress: null
    },
    entries,
    highlightParity,
    highlightKey,
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

function formatTypeLabel(value, texts) {
  if (!value || value === '-') {
    return texts.typeLabels['-'];
  }
  const normalized = String(value).toLowerCase();
  if (texts.typeLabels[normalized]) {
    return texts.typeLabels[normalized];
  }
  if (texts.typeLabels[value]) {
    return texts.typeLabels[value];
  }
  return capitalize(value);
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

function getParityLabel(weeks, texts) {
  if (weeks === 'odd') return texts.parityLabels.odd;
  if (weeks === 'even') return texts.parityLabels.even;
  if (weeks === 'all') return texts.parityLabels.all;
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in schedule app', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

function ErrorFallback() {
  const { texts } = useTranslation();
  return (
    <div className="error-fallback" role="alert">
      <h2>{texts.errors.fallbackTitle}</h2>
      <p>{texts.errors.fallbackMessage}</p>
    </div>
  );
}

function getPreferredTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSubgroupBadge(value, texts) {
  if (value == null || value === '' || value === 'all') {
    return null;
  }
  const subgroupLabels = texts && texts.pair && texts.pair.subgroupLabels ? texts.pair.subgroupLabels : null;
  const labelFor = (key, fallback) => (subgroupLabels && subgroupLabels[key]) || fallback;
  if (value === 1 || value === '1') {
    return { label: labelFor('first', '1'), variant: 'first' };
  }
  if (value === 2 || value === '2') {
    return { label: labelFor('second', '2'), variant: 'second' };
  }
  if (value === '1-2' || COMBINED_SUBGROUP_VALUES.includes(value)) {
    return { label: labelFor('combined', '1, 2'), variant: 'combined' };
  }
  return null;
}

function formatDayHeading(parts, texts) {
  if (!parts) return '';
  const baseWeekday = WEEKDAY_MAP[parts.weekday] || parts.weekday || '';
  const weekday = texts.dayNames.full[baseWeekday] || capitalize(baseWeekday);
  const monthIndex = (parts.month || 1) - 1;
  const monthLabel = texts.monthNames[monthIndex];
  const datePart = monthLabel
    ? `${parts.day} ${monthLabel} ${parts.year}`
    : `${parts.day}.${parts.month}.${parts.year}`;
  return `${weekday}, ${datePart}`.trim();
}

function formatDayDate(parts, texts) {
  if (!parts) return '';
  const monthIndex = (parts.month || 1) - 1;
  const monthLabel = texts.monthNames[monthIndex];
  if (!monthLabel) {
    return `${parts.day}.${parts.month}`;
  }
  return `${parts.day} ${monthLabel}`;
}

function createCountdownDisplay(template, value) {
  if (!template || typeof template !== 'string') {
    return null;
  }
  if (!value) {
    return null;
  }
  if (!template.includes('{duration}')) {
    return null;
  }
  const parts = template.split('{duration}');
  const prefix = parts[0] || '';
  const suffix = parts.slice(1).join('{duration}') || '';
  return {
    prefix,
    suffix,
    value
  };
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
