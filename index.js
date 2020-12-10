'use strict';

// OPERATORS
const isString = require('lodash.isstring');
const isNumber = require('is-number');
const moment = require('moment-timezone');

const minute = 60000;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

let tz;

const _str = (s) => (isString(s) ? s.trim().toLowerCase() : s);

const _isDate = (k, format) => {
  if (!k) return [false, null];

  const d = moment(k, format);
  const valid = d.isValid();

  return [valid, valid ? d.toDate() : k];
};
const _dateOrNum = (k) => {
  if (isNumber(k)) return Number(k);

  const [valid, date] = _isDate(k, moment.ISO_8601);
  if (valid) return date;

  return k;
};

const _array = (k) => {
  return Array.isArray(k)
    ? k.map((k) => k.toLowerCase())
    : _str(k)
        .split(',')
        .map((x) => x.trim());
};

const _includesArray = (a, b) => {
  const a1 = _array(a);
  const b1 = _array(b);

  return a1.some((k) => b1.includes(k));
};

const operators = {
  equals(str, what) {
    return _str(str) === _str(what);
  },
  is(num, what) {
    return _dateOrNum(num) === _dateOrNum(what);
  },
  beginsWith(str, what) {
    return _str(str).startsWith(_str(what));
  },
  contains(str, what) {
    return _str(str).includes(_str(what));
  },
  greaterThan(num, what) {
    return _dateOrNum(num) > _dateOrNum(what);
  },
  greaterEqualThan(num, what) {
    return _dateOrNum(num) >= _dateOrNum(what);
  },
  lessThan(num, what) {
    return _dateOrNum(num) < _dateOrNum(what);
  },
  lessEqualThan(num, what) {
    return _dateOrNum(num) <= _dateOrNum(what);
  },
  isEmpty(what) {
    //return isEmpty(what);
    return (
      what === undefined ||
      what === null ||
      (typeof what === 'string' && what.trim().length === 0) ||
      (typeof what === 'number' && isNaN(what)) ||
      (typeof what === 'object' && Object.keys(what).length === 0)
    );
  },
  between(start, values) {
    const [v1, v2] = values.split('÷');

    return _dateOrNum(v1) <= start && _dateOrNum(v2) >= start;
  },
  dateRange(d, range) {
    const [valid, date] = _isDate(d);

    if (!valid) return false;

    const [date1, date2] = range.split('÷');

    return _dateOrNum(date1) <= date && _dateOrNum(date2) >= date;
  },
  range(d, period) {
    const [valid, date] = _isDate(d);

    if (!valid) return false;

    const [value, unit] = period.split(' ');
    let multiplier = 1;

    switch (unit) {
      case 'm':
        multiplier = minute;
        break;
      case 'h':
        multiplier = hour;
        break;
      case 'd':
        multiplier = day;
        break;
      case 'w':
        multiplier = week;
        break;
      case 'M':
        multiplier = month;
        break;
      case 'y':
        multiplier = year;
        break;
      default:
        multiplier = 1;
    }

    const now = new Date().getTime();
    const date1 = new Date(now - value * multiplier);
    const date2 = new Date(now + value * multiplier);

    return date1 <= date && date2 >= date;
  },
  inList(what, list) {
    return _includesArray(what, list);
  },
};

module.exports = operators;
module.exports.getOperators = ({ timezone }) => {
  tz = timezone;
  return operators;
};
