const test = require('ava');
const operators = require('..');
const { factory } = require('safe-evaluate-expression');
const evaluate = factory({
  operators,
  multipleParams: true,
  translateLogical: true,
});

function runner({ ruleName, rule, metas, lists = {}, expectedResult }) {
  test(`${ruleName} should return ${expectedResult} [${Math.random().toFixed(2)}]`, async (t) => {
    const result = evaluate(rule.condition, metas, lists);
    t.deepEqual(expectedResult, result);
  });
}

const dataProvider = {
  is: [
    {
      ruleName: 'isOutlier',
      rule: { condition: '(is(isOutlier, false))' },
      metas: { isOutlier: false },
      expectedResult: true,
    },
    {
      rule: { condition: 'is(foo, bar)' },
      metas: { foo: 10, bar: 10 },
      expectedResult: true,
    },
    {
      rule: { condition: 'is(foo, bar)' },
      metas: { foo: 10, bar: 100 },
      expectedResult: false,
    },
    {
      rule: { condition: 'is(bol1, bol2)' },
      metas: { bol1: true, bol2: true },
      expectedResult: true,
    },
  ],
  equals: [
    {
      rule: { condition: 'equals(foo, bar)' },
      metas: { foo: 'my-value', bar: 'my-value' },
      expectedResult: true,
    },
    {
      rule: { condition: 'equals(foo, bar)' },
      metas: { foo: 'my-value', bar: 'another-value' },
      expectedResult: false,
    },
  ],
  beginsWith: [
    {
      rule: { condition: 'beginsWith(haystack, needle)' },
      metas: { haystack: 'I am a string', needle: 'I am' },
      expectedResult: true,
    },
    {
      rule: { condition: 'beginsWith(haystack, needle)' },
      metas: { haystack: 'I am a string', needle: 'Not me' },
      expectedResult: false,
    },
  ],
  contains: [
    {
      rule: { condition: 'contains(haystack, needle)' },
      metas: { haystack: 'The quick Brown fox', needle: 'Brown' },
      expectedResult: true,
    },
  ],
  greaterThan: [
    {
      rule: { condition: 'greaterThan(one, other)' },
      metas: { one: 12, other: 1 },
      expectedResult: true,
    },
    {
      rule: { condition: 'greaterThan(one, other)' },
      metas: { one: 12, other: 100 },
      expectedResult: false,
    },
  ],
  greaterEqualThan: [
    {
      rule: { condition: 'greaterEqualThan(one, other)' },
      metas: { one: 12, other: 12 },
      expectedResult: true,
    },
    {
      rule: { condition: 'greaterEqualThan(one, other)' },
      metas: { one: 12, other: 13 },
      expectedResult: false,
    },
  ],
  lessThan: [
    {
      rule: { condition: 'lessThan(one, other)' },
      metas: { one: 1, other: 12 },
      expectedResult: true,
    },
    {
      rule: { condition: 'lessThan(one, other)' },
      metas: { one: 12, other: 1 },
      expectedResult: false,
    },
  ],
  lessEqualThan: [
    {
      rule: { condition: 'lessEqualThan(one, other)' },
      metas: { one: 12, other: 12 },
      expectedResult: true,
    },
    {
      rule: { condition: 'lessEqualThan(one, other)' },
      metas: { one: 12, other: 1 },
      expectedResult: false,
    },
  ],
  isEmpty: [
    {
      rule: { condition: 'isEmpty(variable)' },
      metas: { variable: '' },
      expectedResult: true,
    },
    {
      rule: { condition: 'isEmpty(variable)' },
      metas: { variable: 'not empty' },
      expectedResult: false,
    },
  ],
  between: [
    {
      rule: { condition: 'between(myNumber, myRange)' },
      metas: { myNumber: '3', myRange: '1÷5' },
      expectedResult: true,
    },
    {
      rule: { condition: 'between(myNumber, myRange)' },
      metas: { myNumber: '6', myRange: '1÷5' },
      expectedResult: false,
    },
  ],
  dateRange: [
    {
      rule: { condition: 'dateRange(myDate, myRange)' },
      metas: { myDate: '2019-12-12', myRange: '2019-12-01÷2019-12-31' },
      expectedResult: true,
    },
    {
      rule: { condition: 'dateRange(myDate, myRange)' },
      metas: {
        myDate: '2019-11-12T00:00:00.000Z',
        myRange: '2019-12-01T00:00:00.000Z÷2019-12-31T00:00:00.000Z',
      },
      expectedResult: false,
    },
  ],
  inList: [
    {
      rule: { condition: 'inList(needle, haystack )' },
      metas: { needle: 'Foobar' },
      lists: { haystack: ['foo', 'bar', 'Foobar'] },
      expectedResult: true,
    },
    {
      rule: { condition: 'inList(needle, haystack )' },
      metas: { needle: 'foobar' },
      lists: { haystack: ['foo', 'bar'] },
      expectedResult: false,
    },
  ],
};

Object.keys(dataProvider).forEach((rule) => {
  dataProvider[rule].forEach((data) => {
    runner({
      ruleName: rule,
      ...data,
    });
  });
});
