const { useState, useMemo, useEffect, useCallback, useRef, useContext } = React;
const { formatCountdown, formatCountdownAria } = (typeof CountdownUtils !== 'undefined' && CountdownUtils) || {};

if (typeof formatCountdown !== 'function' || typeof formatCountdownAria !== 'function') {
  throw new Error('Countdown utilities are not available.');
}

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

const SUPPORTED_LANGUAGES = ['ru', 'en'];
const DEFAULT_LANGUAGE = 'ru';

const LANGUAGE_OPTIONS = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' }
];

const TRANSLATIONS = {
  ru: {
    languageName: 'Русский',
    languageToggle: 'Язык интерфейса',
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
    sections: {
      today: 'Сегодня',
      tomorrow: 'Завтра',
      week: 'Неделя',
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
    controls: {
      showFilters: 'Показать фильтры',
      hideFilters: 'Скрыть фильтры',
      filtersButtonAria: (actionLabel, count) => {
        if (count > 0) {
          return `${actionLabel}. Активных фильтров: ${count}.`;
        }
        return actionLabel;
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
      numberLabel: value => `${value}-я пара`
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
  },
  en: {
    languageName: 'English',
    languageToggle: 'Interface language',
    theme: {
      system: 'System theme',
      light: 'Light theme',
      dark: 'Dark theme'
    },
    brand: {
      title: 'Class schedule',
      tagline: 'Stay on top of your studies',
      description: 'Track current and upcoming classes, filter by subgroup, and choose the interface theme you prefer.',
      academicWeek: weekNumber => `Academic week #${weekNumber}`,
      autoDetection: parityLabel => `Auto detection: ${parityLabel} week`
    },
    sections: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      week: 'Week',
      filters: 'Filters'
    },
    parity: {
      label: 'Week parity',
      auto: 'Auto',
      all: 'All',
      odd: 'Odd',
      even: 'Even',
      autoOdd: 'odd',
      autoEven: 'even'
    },
    filters: {
      heading: 'Filters',
      subgroup: 'Subgroup',
      type: 'Class type',
      day: 'Weekday',
      reset: 'Reset filters',
      subgroupOptions: {
        all: 'All subgroups',
        '1': 'Subgroup 1',
        '2': 'Subgroup 2'
      },
      typeOptions: {
        all: 'All types'
      },
      dayOptions: {
        all: 'All days'
      }
    },
    controls: {
      showFilters: 'Show filters',
      hideFilters: 'Hide filters',
      filtersButtonAria: (actionLabel, count) => {
        if (count > 0) {
          return `${actionLabel}. Active filters: ${count}.`;
        }
        return actionLabel;
      }
    },
    today: {
      noPairsBadge: 'No classes today',
      noPairsMessage: 'Use the time to rest or study on your own.',
      dayDoneBadge: 'Day completed',
      dayDoneTitle: 'No classes left today',
      dayDoneMessage: 'Great work! The next classes will be on another day.',
      currentBadge: 'In progress',
      currentMessage: 'A class is running right now. You have got this!',
      countdownLabel: 'Class in progress',
      countdownAria: 'Class in progress',
      breakBadge: 'Break',
      firstBadge: 'Before the first class',
      breakMessageSuffix: ' Classes resume soon.',
      firstMessageSuffix: ' Still time to prepare.',
      listAria: 'Classes for today',
      progressAria: value => `${value}% of the class remaining`
    },
    tomorrow: {
      noPairsBadge: 'No classes tomorrow',
      noPairsMessage: 'It is a day off — no classes scheduled.',
      listAria: dayLabel => `Classes on ${dayLabel}`
    },
    statuses: {
      current: 'Now',
      next: 'Next',
      past: 'Finished'
    },
    pair: {
      roomPrefix: 'room',
      numberLabel: value => `Class ${value}`
    },
    week: {
      listAria: 'Classes for the week',
      dayAria: dayLabel => `Classes on ${dayLabel}`,
      emptyNote: 'No classes match the selected filters.',
      noDaysSelected: 'No days selected.',
      dayEmpty: 'No classes scheduled for this day.'
    },
    footer: {
      themeLabel: 'Theme',
      themeButtonLabel: theme => `Current theme: ${theme} (press to toggle)`,
      themeButtonTitle: theme => `Theme: ${theme}`,
      navHeading: 'Sections',
      extrasHeading: 'More',
      nav: {
        today: 'Today',
        tomorrow: 'Tomorrow',
        week: 'Week',
        filters: 'Filters'
      },
      universityLink: 'University website',
      updateInfo: 'Schedule updates every week',
      copyright: year => `© ${year} Class schedule`,
      lastUpdated: 'Last update in Moscow time'
    },
    countdown: {
      zero: '0 s',
      running: 'Class in progress',
      labelPrefix: 'Starts in: {duration}',
      endLabelPrefix: 'Ends in: {duration}',
      ariaPrefix: 'Class starts in {duration}',
      ariaEndPrefix: 'Class ends in {duration}',
      secondsZero: 'Class starts in 0 seconds',
      endSecondsZero: 'Class ends in 0 seconds',
      startPrefixWithTime: time => `Starts at ${time}.`,
      startPrefixSoon: 'Starting very soon.',
      startSuffixAfterClasses: ' Classes restart shortly.',
      startSuffixBeforeClasses: ' Plenty of time to prepare.',
      unitsShort: {
        days: 'd',
        hours: 'h',
        minutes: 'min',
        seconds: 's'
      },
      unitsLong: {
        days: ['day', 'days'],
        hours: ['hour', 'hours'],
        minutes: ['minute', 'minutes'],
        seconds: ['second', 'seconds']
      }
    },
    parityLabels: {
      odd: 'Odd week',
      even: 'Even week',
      all: 'All weeks'
    },
    typeLabels: {
      '-': 'Type not specified',
      'лекция': 'Lecture',
      'практика': 'Practical class',
      'лабораторная': 'Laboratory class'
    },
    dayNames: {
      full: {
        'Понедельник': 'Monday',
        'Вторник': 'Tuesday',
        'Среда': 'Wednesday',
        'Четверг': 'Thursday',
        'Пятница': 'Friday',
        'Суббота': 'Saturday',
        'Воскресенье': 'Sunday'
      },
      short: {
        'Понедельник': 'Mon',
        'Вторник': 'Tue',
        'Среда': 'Wed',
        'Четверг': 'Thu',
        'Пятница': 'Fri',
        'Суббота': 'Sat',
        'Воскресенье': 'Sun'
      }
    },
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    timezoneLabel: '(MSK)',
    errors: {
      fallbackTitle: 'Unable to load the schedule',
      fallbackMessage: 'Refresh the page or try again later.'
    }
  }
};

const TranslationContext = React.createContext({
  language: DEFAULT_LANGUAGE,
  texts: TRANSLATIONS[DEFAULT_LANGUAGE],
  setLanguage: () => {}
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

function getTranslations(language) {
  if (language && TRANSLATIONS[language]) {
    return TRANSLATIONS[language];
  }
  return TRANSLATIONS[DEFAULT_LANGUAGE];
}

function normalizeLanguage(raw) {
  if (SUPPORTED_LANGUAGES.includes(raw)) {
    return raw;
  }
  const value = String(raw || '').toLowerCase();
  const match = SUPPORTED_LANGUAGES.find(lang => value.startsWith(lang));
  return match || DEFAULT_LANGUAGE;
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
  day: 'schedule::day',
  language: 'schedule::language'
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

const THEME_SEQUENCE = ['system', 'light', 'dark'];

function App() {
  const now = useMoscowNow();

  const [language, setLanguage] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.language);
    if (stored) {
      return normalizeLanguage(stored);
    }
    if (typeof navigator !== 'undefined') {
      const browserLanguage = Array.isArray(navigator.languages) && navigator.languages.length > 0
        ? navigator.languages[0]
        : navigator.language || navigator.userLanguage;
      if (browserLanguage) {
        return normalizeLanguage(browserLanguage);
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const translations = useMemo(() => getTranslations(language), [language]);
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.language, language);
  }, [language]);

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

        if (filtersOpen) {
          setHeaderHidden(false);
          lastY = currentY;
          rafId = null;
          return;
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
  }, [filtersOpen]);

  useEffect(() => {
    if (filtersOpen) {
      setHeaderHidden(false);
    }
  }, [filtersOpen]);

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
      texts: translations,
      language
    });
  }, [scheduleSource, now, parityMode, effectiveParity, autoParity, academicWeekNumber, filters, translations, language]);

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
const activeFilterCount = Object.values(filters).reduce((total, value) => {
  return value === 'all' ? total : total + 1;
}, 0);

const currentYear = now.year;
const themeLabel = translations.theme[themeMode] || themeMode;
const autoParityLabel = autoParity === 'odd' ? translations.parity.autoOdd : translations.parity.autoEven;
const translationContextValue = useMemo(() => ({
  language,
  texts: translations,
  setLanguage
}), [language, translations]);
const filterButtonActionLabel = filtersOpen ? translations.controls.hideFilters : translations.controls.showFilters;
const filterButtonAria = translations.controls.filtersButtonAria(filterButtonActionLabel, activeFilterCount);

return (
  <TranslationContext.Provider value={translationContextValue}>
    <div className={`app-shell${filtersOpen ? ' filters-open' : ''}`}>
      <header className={`app-header${headerHidden ? ' is-hidden' : ''}`}>
        <Container className="header-inner">
          <div className="brand-line">
            <div className="brand-block" aria-live="polite">
              <h1>{translations.brand.title}</h1>
              <div className="brand-meta">
                <span className="brand-meta-primary">{formatDateLabel(now, translations)}</span>
                <div className="brand-meta-secondary">
                  <span>{translations.brand.academicWeek(academicWeekNumber)}</span>
                  <span>{translations.brand.autoDetection(autoParityLabel)}</span>
                </div>
              </div>
            </div>
            <div className="control-block">
              <ParitySelector parityMode={parityMode} onChange={setParityMode} />
              <button
                type="button"
                className={`filters-toggle-button${filtersOpen ? ' is-open' : ''}${activeFilterCount > 0 ? ' has-active' : ''}`}
                onClick={() => {
                  setHeaderHidden(false);
                  setFiltersOpen(value => !value);
                }}
                aria-label={filterButtonAria}
                aria-expanded={filtersOpen}
                aria-controls="filters-panel"
                title={filterButtonActionLabel}
              >
                <FilterIcon />
                <span className="filters-toggle-label">{translations.sections.filters}</span>
                {activeFilterCount > 0 && (
                  <span className="filters-toggle-count" aria-hidden="true">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>
      <div
        className={`filters-region${filtersOpen ? ' is-open' : ''}`}
        aria-hidden={!filtersOpen}
        id="filters-panel"
      >
        <Container className="filters-region-inner">
          <FiltersPanel
            filters={filters}
            groups={filterGroups}
            onUpdateFilter={handleFilterChange}
            isOpen={filtersOpen}
            onReset={handleResetFilters}
            resetDisabled={filtersAreDefault}
          />
        </Container>
      </div>

      <main className="app-main">
        <Container as="section" id="today" className="app-section">
          <div className="section-header">
            <h2>{translations.sections.today}</h2>
          </div>
          <TodaySection
            info={todayInfo}
            showParityLabels={parityMode === 'all'}
            parityMode={parityMode}
          />
        </Container>

        <Container as="section" id="tomorrow" className="app-section">
          <div className="section-header">
            <h2>{translations.sections.tomorrow}</h2>
            <span className="section-caption">{formatDayHeading(tomorrowParts, translations)}</span>
          </div>
          <TomorrowSection
            entries={tomorrowEntries}
            dateParts={tomorrowParts}
            showParityLabels={parityMode === 'all'}
            parityMode={parityMode}
          />
        </Container>

        <Container as="section" className="app-section week-section" id="week">
          <div className="section-header">
            <h2>{translations.sections.week}</h2>
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
              <LanguageSelector />
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
          <div className="footer-bottom">
            <small>{translations.footer.copyright(currentYear)}</small>
          </div>
        </Container>
      </footer>
    </div>
  </TranslationContext.Provider>
);
}

function LanguageSelector() {
  const { language, texts, setLanguage } = useTranslation();
  return (
    <div className="language-switch">
      <span className="language-switch-icon" aria-hidden="true">
        <GlobeIcon />
      </span>
      <div className="language-switch-buttons" role="group" aria-label={texts.languageToggle}>
        {LANGUAGE_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            aria-pressed={language === option.value}
            onClick={() => setLanguage(normalizeLanguage(option.value))}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
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

function FiltersPanel({ filters, groups = [], onUpdateFilter, isOpen = false, onReset, resetDisabled = false }) {
  const { texts } = useTranslation();
  return (
    <div
      className={`filters-panel${isOpen ? ' is-open' : ''}`}
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
                disabled={!isOpen}
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
            disabled={!isOpen || resetDisabled}
            tabIndex={isOpen ? 0 : -1}
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

function FilterOptionButton({ active, onClick, disabled = false, children }) {
  return (
    <button
      type="button"
      className={`filter-button${active ? ' active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function FilterIcon() {
  return (
    <svg className="icon icon-filter" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 5.5h16M7.5 11.5h9M10.5 17.5h3"
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

function GlobeIcon() {
  return (
    <svg className="icon icon-globe" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3v18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 3c2.5 2.7 3.8 6 3.8 9S14.5 18.3 12 21m0-18c-2.5 2.7-3.8 6-3.8 9s1.3 6.3 3.8 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TodaySection({ info, showParityLabels, parityMode }) {
  const { texts } = useTranslation();
  if (info.mode === 'empty') {
    return (
      <div className="summary-card" aria-live="polite">
        <span className="badge">{texts.today.noPairsBadge}</span>
        <p className="info-text">{texts.today.noPairsMessage}</p>
      </div>
    );
  }

  const { summary, entries, highlightParity } = info;
  const isCurrent = summary.state === 'current';
  const cardParityVariant = (showParityLabels || parityMode !== 'all') ? null : highlightParity;
  const progressValue = summary.progress != null ? Math.round(summary.progress) : 0;

  return (
    <article
      className={`today-card today-card--list${isCurrent ? ' current' : ''}${cardParityVariant ? ` parity-${cardParityVariant}` : ''}`}
      aria-live="polite"
    >
      <div className="today-head">
        <span className="badge">{summary.badge}</span>
      </div>
      <div className="today-main">
        <h3 className="today-title">{summary.title}</h3>
        {summary.message && <p className="info-text">{summary.message}</p>}
      </div>
      {summary.countdownLabel && (
        <div className="countdown-line">
          <div
            className="countdown-value"
            role={summary.countdownRole || undefined}
            aria-live={summary.countdownLive || undefined}
            aria-label={summary.countdownAria || undefined}
            aria-atomic={summary.countdownLive ? 'true' : undefined}
          >
            {summary.countdownLabel}
          </div>
          {summary.state === 'current' && (
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
      )}
      <ul className="day-pair-list today-pair-list" aria-label={texts.today.listAria}>
        {entries.map(item => {
          const entry = item.entry;
          const entryKey = item.key;
          const subgroupBadge = getSubgroupBadge(entry.subgroup);
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
                  {showStatusChip && (
                    <span className={`meta-chip meta-chip-status status-${item.status}`}>
                      {statusLabel}
                    </span>
                  )}
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
}

function TomorrowSection({ entries, dateParts, showParityLabels, parityMode }) {
  const { texts } = useTranslation();
  const baseDayName = WEEKDAY_MAP[dateParts.weekday] || dateParts.weekday || '';
  const dayName = texts.dayNames.full[baseDayName] || capitalize(baseDayName);
  const dateLabel = formatDayDate(dateParts, texts);

  if (!entries.length) {
    return (
      <div className="summary-card" aria-live="polite">
        <span className="badge">{texts.tomorrow.noPairsBadge}</span>
        <p className="info-text">{texts.tomorrow.noPairsMessage}</p>
      </div>
    );
  }

  return (
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
          const subgroupBadge = getSubgroupBadge(entry.subgroup);
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
                      const subgroupBadge = getSubgroupBadge(entry.subgroup);
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

function computeTodayInfo({ schedule, now, parity, weekNumber, filters, texts, language }) {
  const todayName = WEEKDAY_MAP[now.weekday] || 'Воскресенье';

  const baseEntries = getEntriesForDay({
    schedule,
    dayName: todayName,
    parity,
    weekNumber,
    filters
  });

  if (baseEntries.length === 0) {
    return { mode: 'empty', currentKey: null };
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
        progress: null
      },
      entries,
      highlightParity,
      currentKey: null
    };
  }

  if (current) {
    let countdownLabel = texts.today.countdownLabel;
    let countdownAria = texts.today.countdownAria;
    let countdownRole = 'status';
    const countdownLive = 'polite';

    if (typeof current.endSeconds === 'number' && nowSeconds < current.endSeconds) {
      const remainingMs = (current.endSeconds - nowSeconds) * 1000;
      const countdownValue = formatCountdown(remainingMs, texts);
      countdownLabel = texts.countdown.endLabelPrefix.replace('{duration}', countdownValue);
      countdownAria = formatCountdownAria(remainingMs, texts, language, {
        prefix: texts.countdown.ariaEndPrefix,
        zero: texts.countdown.endSecondsZero
      });
      countdownRole = 'timer';
    }

    return {
      mode: 'list',
      summary: {
        state: 'current',
        badge: texts.today.currentBadge,
        title: current.entry.subject,
        message: texts.today.currentMessage,
        countdownLabel,
        countdownAria,
        countdownRole,
        countdownLive,
        progress: computeProgress(nowSeconds, current.startSeconds, current.endSeconds)
      },
      entries,
      highlightParity,
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
  const countdownLabel = texts.countdown.labelPrefix.replace('{duration}', countdownValue);
  const countdownAria = formatCountdownAria(remainingMs, texts, language);

  return {
    mode: 'list',
    summary: {
      state: 'next',
      badge: hasPastEntries ? texts.today.breakBadge : texts.today.firstBadge,
      title: next.entry.subject,
      message: `${prefix}${suffix}`,
      countdownLabel,
      countdownAria,
      countdownRole: 'timer',
      countdownLive: 'polite',
      progress: null
    },
    entries,
    highlightParity,
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

function formatDateLabel(now, texts) {
  const baseWeekday = WEEKDAY_MAP[now.weekday] || now.weekday;
  const weekday = texts.dayNames.full[baseWeekday] || capitalize(baseWeekday);
  const monthLabel = texts.monthNames[now.month - 1] || now.month;
  return `${weekday}, ${now.day} ${monthLabel} ${now.year} • ${pad(now.hour)}:${pad(now.minute)} ${texts.timezoneLabel}`;
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
