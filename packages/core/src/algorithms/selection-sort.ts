import type { SelectionSortStep } from "./step";

export function* selectionSort(
  inputArr: readonly number[],
): Generator<SelectionSortStep> {
  const arr = [...inputArr];

  for (let i = 0; i < arr.length; i++) {
    let posMin = i;
    yield { kind: "minimum", pos: i };

    for (let j = i + 1; j < arr.length; j++) {
      yield { kind: "compare", firstPos: posMin, secondPos: j };

      if (arr[posMin] > arr[j]) {
        posMin = j;
        yield { kind: "minimum", pos: j };
      }
    }

    if (i !== posMin) {
      const temp = arr[i];
      arr[i] = arr[posMin];
      arr[posMin] = temp;

      yield { kind: "swap", firstPos: i, secondPos: posMin };
    }

    yield { kind: "fixed", pos: i };
  }
}
