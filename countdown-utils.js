(function attachCountdownUtils(root) {
  function splitDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const remainderAfterDays = totalSeconds % 86400;
    const hours = Math.floor(remainderAfterDays / 3600);
    const remainderAfterHours = remainderAfterDays % 3600;
    const minutes = Math.floor(remainderAfterHours / 60);
    const seconds = remainderAfterHours % 60;
    return { totalSeconds, days, hours, minutes, seconds };
  }

  function declineRus(value, [one, few, many]) {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return one;
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return few;
    }
    return many;
  }

  function formatUnitLabel(value, forms, language) {
    if (language === 'ru' && Array.isArray(forms) && forms.length === 3) {
      return declineRus(value, forms);
    }
    if (Array.isArray(forms) && forms.length >= 2) {
      return value === 1 ? forms[0] : forms[1];
    }
    if (Array.isArray(forms) && forms.length === 1) {
      return forms[0];
    }
    return String(forms);
  }

  function formatCountdown(ms, texts) {
    const { totalSeconds, days, hours, minutes, seconds } = splitDuration(ms);
    if (!texts || !texts.countdown) {
      throw new Error('Countdown texts dictionary is required.');
    }
    if (totalSeconds === 0) {
      return texts.countdown.zero;
    }

    const units = [
      { value: days, label: texts.countdown.unitsShort.days },
      { value: hours, label: texts.countdown.unitsShort.hours },
      { value: minutes, label: texts.countdown.unitsShort.minutes },
      { value: seconds, label: texts.countdown.unitsShort.seconds }
    ];

    const firstIndex = units.findIndex(unit => unit.value > 0);
    if (firstIndex === -1) {
      return texts.countdown.zero;
    }

    const parts = [`${units[firstIndex].value} ${units[firstIndex].label}`];

    for (let index = firstIndex + 1; index < units.length; index += 1) {
      const unit = units[index];
      if (unit.value > 0) {
        parts.push(`${unit.value} ${unit.label}`);
        break;
      }
    }

    return parts.join(' ');
  }

  function formatCountdownAria(ms, texts, language, options = {}) {
    const { totalSeconds, days, hours, minutes, seconds } = splitDuration(ms);
    const ariaPrefix = options.prefix || texts.countdown.ariaPrefix;
    const zeroLabel = options.zero || texts.countdown.secondsZero;

    if (totalSeconds === 0) {
      return zeroLabel;
    }

    const units = [
      { value: days, forms: texts.countdown.unitsLong.days },
      { value: hours, forms: texts.countdown.unitsLong.hours },
      { value: minutes, forms: texts.countdown.unitsLong.minutes },
      { value: seconds, forms: texts.countdown.unitsLong.seconds }
    ];

    const firstIndex = units.findIndex(unit => unit.value > 0);
    if (firstIndex === -1) {
      return zeroLabel;
    }

    const parts = [];
    const firstUnit = units[firstIndex];
    parts.push(`${firstUnit.value} ${formatUnitLabel(firstUnit.value, firstUnit.forms, language)}`);

    for (let index = firstIndex + 1; index < units.length; index += 1) {
      const unit = units[index];
      if (unit.value > 0) {
        parts.push(`${unit.value} ${formatUnitLabel(unit.value, unit.forms, language)}`);
        break;
      }
    }

    const duration = parts.join(' ');
    return ariaPrefix.replace('{duration}', duration);
  }

  const api = {
    splitDuration,
    declineRus,
    formatUnitLabel,
    formatCountdown,
    formatCountdownAria
  };

  if (root) {
    const existing = root.CountdownUtils || {};
    root.CountdownUtils = Object.assign({}, existing, api);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
