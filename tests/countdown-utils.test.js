const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  formatCountdown,
  formatCountdownAria
} = require('../countdown-utils.js');

const snapshotPath = path.join(__dirname, '__snapshots__', 'countdown-utils.snap.json');
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

const textsRu = {
  countdown: {
    zero: '0 сек',
    labelPrefix: 'До начала: {duration}',
    endLabelPrefix: 'До конца: {duration}',
    ariaPrefix: 'До начала пары осталось {duration}',
    ariaEndPrefix: 'До конца пары осталось {duration}',
    secondsZero: 'До начала пары осталось 0 секунд',
    endSecondsZero: 'До конца пары осталось 0 секунд',
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
  }
};

const textsEn = {
  countdown: {
    zero: '0 s',
    labelPrefix: 'Starts in: {duration}',
    endLabelPrefix: 'Ends in: {duration}',
    ariaPrefix: 'Class starts in {duration}',
    ariaEndPrefix: 'Class ends in {duration}',
    secondsZero: 'Class starts in 0 seconds',
    endSecondsZero: 'Class ends in 0 seconds',
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
  }
};

function snapshotTest() {
  const durationMs = 65_000;

  const ruLabel = textsRu.countdown.endLabelPrefix.replace(
    '{duration}',
    formatCountdown(durationMs, textsRu)
  );
  const ruAria = formatCountdownAria(durationMs, textsRu, 'ru', {
    prefix: textsRu.countdown.ariaEndPrefix,
    zero: textsRu.countdown.endSecondsZero
  });

  assert.strictEqual(
    ruLabel,
    snapshot.ru_endCountdown.label,
    'RU end countdown label mismatch'
  );
  assert.strictEqual(
    ruAria,
    snapshot.ru_endCountdown.aria,
    'RU end countdown aria mismatch'
  );

  const enLabel = textsEn.countdown.endLabelPrefix.replace(
    '{duration}',
    formatCountdown(durationMs, textsEn)
  );
  const enAria = formatCountdownAria(durationMs, textsEn, 'en', {
    prefix: textsEn.countdown.ariaEndPrefix,
    zero: textsEn.countdown.endSecondsZero
  });

  assert.strictEqual(
    enLabel,
    snapshot.en_endCountdown.label,
    'EN end countdown label mismatch'
  );
  assert.strictEqual(
    enAria,
    snapshot.en_endCountdown.aria,
    'EN end countdown aria mismatch'
  );
}

function unitTests() {
  const ruMinuteSample = formatCountdown(65_000, textsRu);
  assert.strictEqual(ruMinuteSample, '1 мин 5 сек', 'RU minute countdown formatting failed');

  const enHourSample = formatCountdown(3_723_000, textsEn);
  assert.strictEqual(enHourSample, '1 h 2 min', 'EN hour countdown formatting failed');

  const enStartZero = formatCountdownAria(0, textsEn, 'en');
  assert.strictEqual(enStartZero, 'Class starts in 0 seconds', 'EN start zero aria failed');

  const enStartAria = formatCountdownAria(3_605_000, textsEn, 'en');
  assert.strictEqual(enStartAria, 'Class starts in 1 hour 5 seconds', 'EN start aria formatting failed');
}

function run() {
  snapshotTest();
  unitTests();
  console.log('All countdown utils tests passed');
}

run();
