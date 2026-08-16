export type SortStep =
  | { kind: "compare"; firstPos: number; secondPos: number }
  | { kind: "swap"; firstPos: number; secondPos: number }
  | { kind: "fixed"; pos: number };

export type BubbleSortStep = SortStep;

export type SelectionSortStep =
  | SortStep
  | {
      kind: "minimum";
      pos: number;
    };

export type AlgorithmStep = SortStep | SelectionSortStep;
