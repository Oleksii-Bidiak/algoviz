export type SortStep =
  | { kind: "compare"; firstPos: number; secondPos: number }
  | { kind: "swap"; firstPos: number; secondPos: number }
  | { kind: "fixed"; pos: number };

export function* bubbleSort(inputArr: readonly number[]): Generator<SortStep> {
  const arr = [...inputArr];

  for (let i = arr.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      yield { kind: "compare", firstPos: j, secondPos: j + 1 };

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        yield { kind: "swap", firstPos: j, secondPos: j + 1 };
      }
    }

    yield { kind: "fixed", pos: i };
  }
}
