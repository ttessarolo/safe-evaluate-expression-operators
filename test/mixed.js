const test = require('ava');
const operators = require('..');
const { factory } = require('safe-evaluate-expression');
const evaluate = factory({
  operators,
  multipleParams: true,
  translateLogical: true,
});

const q1 = `(dateRange(when_now, "2020-11-30T09:30:00.000Z÷2021-01-20T09:29:59.000Z") && dateRange(when_now, "2020-12-17T12:00:00.000Z÷2020-12-28T11:59:59.000Z"))`;
const q2 = `contains(title, "hola")`;
test(`data range in and`, async (t) => {
  const result = evaluate(q1, { when_now: '2020-12-11T08:33:11.450Z' });
  t.false(result);
});

test(`data range undefiend`, async (t) => {
  const result = evaluate(q2, {});
  t.false(result);
});
