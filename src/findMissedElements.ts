import { buildRange } from './utils.js';

type RangeData = { start: number; stop: number };
type SearchData = {
  startIndex: number;
  endIndex: number;
  minOffset: number;
  maxOffset: number;
};

const STEP = 1;

const getMiddleIndex = (startIndex: number, endIndex: number): number =>
  Math.floor((startIndex + endIndex) / 2);

function findMissedElementsLeft(
  arr: number[],
  searchData: SearchData,
  range: RangeData
): number[] {
  const { endIndex, maxOffset } = searchData;
  const rangeStart = range.start;

  if (endIndex == 0) {
    return buildRange(rangeStart, maxOffset - rangeStart);
  }

  const previousElementIndex = endIndex - 1;
  const currentElement = arr[endIndex];
  const previousElement = arr[previousElementIndex];
  const localStep = currentElement - previousElement;

  if (localStep == STEP) {
    return findMissedElementsUtil(
      arr,
      { ...searchData, endIndex: previousElementIndex },
      range
    );
  }

  const localMissedElements = buildRange(
    previousElement + STEP,
    currentElement - STEP
  );

  const missedElements = findMissedElementsUtil(
    arr,
    {
      ...searchData,
      endIndex: previousElementIndex,
      maxOffset: maxOffset - localMissedElements.length,
    },
    range
  );

  return [...localMissedElements, ...missedElements];
}

function findMissedElementsRight(
  arr: number[],
  searchData: SearchData,
  range: RangeData
): number[] {
  const { startIndex, minOffset } = searchData;
  const rangeStop = range.stop;
  const currentElement = arr[startIndex];

  if (startIndex == arr.length - 1) {
    return buildRange(currentElement + STEP, rangeStop);
  }

  const nextElementIndex = startIndex + 1;
  const nextElement = arr[nextElementIndex];
  const localStep = nextElement - currentElement;

  if (localStep == STEP) {
    return findMissedElementsUtil(
      arr,
      { ...searchData, startIndex: nextElementIndex },
      range
    );
  }

  const localMissedElements = buildRange(
    currentElement + STEP,
    nextElement - STEP
  );

  const missedElements = findMissedElementsUtil(
    arr,
    {
      ...searchData,
      startIndex: nextElementIndex,
      minOffset: minOffset + localMissedElements.length,
    },
    range
  );

  return [...localMissedElements, ...missedElements];
}

function findMissedElementsUtil(
  arr: number[],
  { startIndex, endIndex, minOffset, maxOffset }: SearchData,
  range: RangeData
): number[] {
  if (minOffset === maxOffset) return [];
  const middleIndex = getMiddleIndex(startIndex, endIndex);
  const offset = arr[middleIndex] - middleIndex;
  let leftMissedElements = [];
  let rightMissedElements = [];

  if (offset > minOffset) {
    leftMissedElements = findMissedElementsLeft(
      arr,
      { startIndex, endIndex: middleIndex, minOffset, maxOffset: offset },
      range
    );
  }

  if (offset < maxOffset) {
    rightMissedElements = findMissedElementsRight(
      arr,
      { startIndex: middleIndex, endIndex, minOffset: offset, maxOffset },
      range
    );
  }

  return [...leftMissedElements, ...rightMissedElements];
}

export const findMissedElements = (
  arr: number[],
  range: RangeData
): Set<number> => {
  const startIndex = 0;
  const endIndex = arr.length - 1;
  const minOffset = range.start;
  const maxOffset = range.stop - endIndex;

  return new Set(
    findMissedElementsUtil(
      arr,
      { startIndex, endIndex, minOffset, maxOffset },
      range
    )
  );
};
