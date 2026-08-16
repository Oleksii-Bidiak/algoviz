import type { AlgorithmStep } from "./step";

export const replay = (
  input: readonly number[],
  steps: Iterable<AlgorithmStep>,
): number[] => {
  const arr = [...input];

  for (const step of steps) {
    switch (step.kind) {
      case "swap": {
        const { firstPos, secondPos } = step;
        const temp = arr[firstPos];
        arr[firstPos] = arr[secondPos];
        arr[secondPos] = temp;
        break;
      }
    }
  }

  return arr;
};
