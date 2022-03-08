'use strict';

const niceTry = require('nice-try');
const isString = require('lodash.isstring');
const isNumber = require('is-number');
const moment = require('moment-timezone');

const operators = {
  _tz: null,
  _str: (s) => (isString(s) ? s : s || ''), // (isString(s) ? s.trim().toLowerCase() : s || '')
  _isDate(k, format) {
    if (!k) return [false, null];
    const timezone = this._tz || moment.tz.guess();

    const d = moment(k, format).tz(timezone);
    const valid = d.isValid();

    return [valid, valid ? d.toDate() : k];
  },
  _dateOrNum(k) {
    if (isNumber(k)) return Number(k);

    const [valid, date] = this._isDate(k, moment.ISO_8601);
    if (valid) return date;

    return k;
  },
  _array(k) {
    if (!k) return [];
    if (Array.isArray(k)) return k;

    const converted = niceTry(() => JSON.parse(k));
    if (converted && Array.isArray(converted)) return converted;

    return this._str(k)
      .split(',')
      .map((x) => x.trim());
  },
  _includesArray(a, b) {
    if (!a || !b) return false;
    const a1 = this._array(a);
    const b1 = this._array(b);

    return a1.some((k) => b1.includes(k));
  },
  equals(str, what) {
    return this._str(str) === this._str(what);
  },
  is(num, what) {
    return this._dateOrNum(num) === this._dateOrNum(what);
  },
  beginsWith(str, what) {
    return this._str(str).startsWith(this._str(what));
  },
  contains(str, what) {
    return this._str(str).includes(this._str(what));
  },
  greaterThan(num, what) {
    return this._dateOrNum(num) > this._dateOrNum(what);
  },
  greaterEqualThan(num, what) {
    return this._dateOrNum(num) >= this._dateOrNum(what);
  },
  lessThan(num, what) {
    return this._dateOrNum(num) < this._dateOrNum(what);
  },
  lessEqualThan(num, what) {
    return this._dateOrNum(num) <= this._dateOrNum(what);
  },
  isEmpty(what) {
    return (
      what === undefined ||
      what === null ||
      (typeof what === 'string' && what.trim().length === 0) ||
      (typeof what === 'number' && isNaN(what)) ||
      (typeof what === 'object' && Object.keys(what).length === 0)
    );
  },
  between(start, values) {
    if (!values || !start) return false;
    const [v1, v2] = values.split('÷');

    return this._dateOrNum(v1) <= start && this._dateOrNum(v2) >= start;
  },
  dateRange(d, range) {
    const [valid, date] = this._isDate(d);

    if (!valid) return false;

    const [date1, date2] = range.split('÷');
    return moment(date).isBetween(date1, date2);
  },
  range(d, period) {
    const [valid, date] = this._isDate(d);

    if (!valid) return false;

    const [value, unit] = period.split(' ');
    const timezone = this._tz || moment.tz.guess();

    const date1 = moment().tz(timezone).subtract(value, unit);
    const date2 = moment().tz(timezone).add(value, unit);
    return moment(date).isBetween(date1, date2);
  },
  inList(what, list) {
    return this._includesArray(what, list);
  },
};

module.exports = operators;
module.exports.getOperators = ({ timezone } = {}) => {
  return { ...operators, _tz: timezone };
};
