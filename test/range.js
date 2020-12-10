'use strict';

const test = require('ava');
const operators = require('..');
const { factory } = require('safe-evaluate-expression');
const evaluate = factory({
  operators,
  multipleParams: true,
  translateLogical: true,
});

const dataProvider = [
  {
    name: 'yesterday',
    amount: 60 * 60 * 24,
    period: '2 d',
    expectedResult: true,
  },
  {
    name: '2-hours-ago',
    amount: 60 * 60 * 2,
    period: '10 h',
    expectedResult: true,
  },
  {
    name: '2-weeks-ago',
    amount: 60 * 60 * 3600 * 15,
    period: '3 w',
    expectedResult: true,
  },
  {
    name: 'one-month-ago',
    amount: 60 * 60 * 24 * 30,
    period: '2 M',
    expectedResult: true,
  },
  {
    name: 'five-minutes-ago',
    amount: 60 * 5,
    period: '10 m',
    expectedResult: true,
  },

  {
    name: 'one-year-ago',
    amount: 60 * 60 * 3600 * 365,
    period: '3 y',
    expectedResult: true,
  },

  {
    name: '1-minute-ago',
    amount: 60 * 1,
    period: '120000',
    expectedResult: true,
  },
];

dataProvider.forEach((rangeData) => {
  const date = new Date() - rangeData.amount;
  const rule = {
    condition: `range(d, period)`,
  };
  const metas = {
    d: date,
    period: rangeData.period,
  };
  const lists = {};

  test(`range(${rangeData.name}, ${rangeData.period}) should return ${rangeData.expectedResult}`, async (t) => {
    const result = evaluate(rule.condition, metas, lists);
    t.deepEqual(rangeData.expectedResult, result);
  });
});
