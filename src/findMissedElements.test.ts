import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findMissedElements } from './findMissedElements.js';
import { buildRange } from './utils.js';

let tenMillionTestData;
{
  const expected = new Set([2, 50_000_000]);
  const range = { start: 1, stop: 100_000_000 };
  const arr = buildRange(range.start, range.stop).filter(
    (x) => !expected.has(x)
  );
  tenMillionTestData = { arr, range, expected };
}

describe('Find missed elements', () => {
  it('on one side', () => {
    const range = { start: 1, stop: 8 };
    const arr = [1, 3, 5, 6, 7, 8];
    const expected = new Set([2, 4]);
    const result = findMissedElements(arr, range);

    assert.deepStrictEqual(expected, result);
  });

  it('on two sides', () => {
    const range = { start: 1, stop: 8 };
    const arr = [1, 3, 4, 5, 6, 8];
    const expected = new Set([2, 7]);
    const result = findMissedElements(arr, range);

    assert.deepStrictEqual(expected, result);
  });

  it('in sequence', () => {
    const range = { start: 1, stop: 8 };
    const arr = [1, 2, 3, 6, 7, 8];
    const expected = new Set([4, 5]);
    const result = findMissedElements(arr, range);

    assert.deepStrictEqual(expected, result);
  });

  it('at the start and on the end', () => {
    const range = { start: 1, stop: 8 };
    const arr = [2, 3, 4, 5, 6, 7];
    const expected = new Set([1, 8]);
    const result = findMissedElements(arr, range);

    assert.deepStrictEqual(expected, result);
  });

  it('3 missed elements', () => {
    const range = { start: 1, stop: 8 };
    const arr = [2, 3, 5, 6, 7];
    const expected = new Set([1, 4, 8]);
    const result = findMissedElements(arr, range);

    assert.deepStrictEqual(expected, result);
  });

  it('ten billion elements', () => {
    const { arr, range, expected } = tenMillionTestData;
    const result = findMissedElements(arr, range);
    assert.deepStrictEqual(expected, result);
  });
});
