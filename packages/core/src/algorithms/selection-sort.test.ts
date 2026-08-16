import { expect, it } from "vitest";
import { replay } from "./replay";
import { selectionSort } from "./selection-sort";

const selectionSortRunner = (input: number[]) =>
  replay(input, selectionSort(input));

it("Playing the steps gives a sorted array.", () => {
  const arr = [1, 3, 2, 4, 2];
  const sorted = selectionSortRunner(arr);

  expect(sorted).toEqual([1, 2, 2, 3, 4]);
});

it("The input array has not changed.", () => {
  const arr = [1, 3, 2, 4, 2];
  const sorted = selectionSortRunner(arr);

  expect(arr).toEqual([1, 3, 2, 4, 2]);
});

it("An empty array does not break anything.", () => {
  const emptyArr: number[] = [];
  const sortedEmptyArr = selectionSortRunner(emptyArr);

  expect(sortedEmptyArr).toEqual([]);
});

it("An array of one element does not break anything.", () => {
  const oneElementArr = [2];
  const sortedOneElementArr = selectionSortRunner(oneElementArr);

  expect(sortedOneElementArr).toEqual([2]);
});

it("An already sorted array and an array of identical elements do not give any swap.", () => {
  const identicalElements = [2, 2, 2];
  const sortedElements = [1, 2, 3];

  expect(
    [...selectionSort(identicalElements)].filter(
      (item) => item.kind === "swap",
    ),
  ).toHaveLength(0);
  expect(
    [...selectionSort(sortedElements)].filter((item) => item.kind === "swap"),
  ).toHaveLength(0);
});

it("fixed is returned for each position exactly once", () => {
  const arr = [5, 1, 4, 2];
  const positions = [...selectionSort(arr)]
    .filter((item) => item.kind === "fixed")
    .map((item) => item.pos);

  expect(positions).toEqual([0, 1, 2, 3]);
});

it("Sequence of candidates for minimum.", () => {
  const arr = [5, 1, 4, 2];
  const stepsOfMin = [...selectionSort(arr)].filter(
    (item) => item.kind === "minimum",
  );
  const positionOfMnimums = stepsOfMin.map((item) => item.pos);

  expect(positionOfMnimums).toEqual([0, 1, 1, 2, 3, 2, 3]);
});
