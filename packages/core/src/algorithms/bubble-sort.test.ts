import { expect, it } from "vitest";
import { bubbleSort } from "./bubble-sort";
import { replay } from "./replay";

const bubbleSortRunner = (input: number[]) => replay(input, bubbleSort(input));

it("Playing the steps gives a sorted array.", () => {
  const arr = [1, 3, 2, 4, 2];
  const sorted = bubbleSortRunner(arr);

  expect(sorted).toEqual([1, 2, 2, 3, 4]);
});

it("The input array has not changed.", () => {
  const arr = [1, 3, 2, 4, 2];
  const sorted = bubbleSortRunner(arr);

  expect(arr).toEqual([1, 3, 2, 4, 2]);
});

it("An empty array does not break anything.", () => {
  const emptyArr: number[] = [];
  const sortedEmptyArr = bubbleSortRunner(emptyArr);

  expect(sortedEmptyArr).toEqual([]);
});

it("An array of one element does not break anything.", () => {
  const oneElementArr = [2];
  const sortedOneElementArr = bubbleSortRunner(oneElementArr);

  expect(sortedOneElementArr).toEqual([2]);
});

it("An already sorted array and an array of identical elements do not give any swap.", () => {
  const identicalElements = [2, 2, 2];
  const sortedElements = [1, 2, 3];

  expect(
    [...bubbleSort(identicalElements)].filter((item) => item.kind === "swap"),
  ).toHaveLength(0);
  expect(
    [...bubbleSort(sortedElements)].filter((item) => item.kind === "swap"),
  ).toHaveLength(0);
});

it("fixed is returned for each position exactly once.", () => {
  const arr = [1, 3, 2, 4, 2];
  const positions = [...bubbleSort(arr)]
    .filter((item) => item.kind === "fixed")
    .map((item) => item.pos);

  expect(positions).toEqual([4, 3, 2, 1, 0]);
});
