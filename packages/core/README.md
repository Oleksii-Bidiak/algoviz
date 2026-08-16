# @algoviz/core

The algorithmic core of AlgoViz: sorting algorithms expressed as **step generators**.

This package is plain TypeScript. It has no dependency on React, Next.js, or the DOM —
its `tsconfig.json` deliberately omits the `DOM` library, so browser globals do not even
exist as types here. Rendering lives elsewhere; this package only decides _what happened_,
never _how it looks_.

## The step contract

A sorting function does not return a sorted array. It returns a **sequence of steps** —
the events that occurred while sorting — and the caller decides what to do with them.

```ts
export function* bubbleSort(input: readonly number[]): Generator<BubbleSortStep>;
```

Three properties define the contract.

**Steps are deltas, not snapshots.** A step carries only what changed: positions, never the
array itself. The consumer holds the array and applies each step to it. This keeps memory
flat — the generator is lazy, so only one step exists at a time — and it makes playback
reversible, because a swap undone is a swap.

**A step describes what has already happened.** By the time a `swap` step is yielded, the
exchange is done. Consumers apply steps as they arrive rather than anticipating them.

**The input array is never mutated.** Every algorithm takes `readonly number[]` and works on
its own copy. Callers can hand over their own data and keep it.

### Step kinds

Three kinds form the shared vocabulary. They carry positions only — no roles, no values —
because they must mean the same thing for every algorithm that emits them.

| Kind      | Payload                 | Meaning                                                        |
| --------- | ----------------------- | -------------------------------------------------------------- |
| `compare` | `firstPos`, `secondPos` | The elements at these two positions were compared.             |
| `swap`    | `firstPos`, `secondPos` | The elements at these two positions were exchanged.            |
| `fixed`   | `pos`                   | The element at this position is final and will not move again. |

`swap` is the only kind that changes array state. A consumer that ignores everything else
still reconstructs the sorted array correctly.

An algorithm may extend this vocabulary with kinds of its own. Selection sort adds one:

| Kind      | Payload | Meaning                                                |
| --------- | ------- | ------------------------------------------------------ |
| `minimum` | `pos`   | The current minimum candidate is now at this position. |

Role information belongs in its own kind, not in the shared ones. A renderer knows which
position is the minimum candidate because `minimum` told it and it remembered — so `compare`
does not need to repeat it.

### What the contract does not prescribe

`fixed` positions arrive in whatever order the algorithm settles them: bubble sort fills the
array from the end (`3, 2, 1, 0`), selection sort from the front (`0, 1, 2, 3`). Consumers
must not assume a direction.

Steps that would change nothing are not emitted. Selection sort skips `swap` when the minimum
is already in place, because an exchange that moves nothing would make a renderer animate a
motion that never occurred.

## Usage

```ts
import { bubbleSort } from "@algoviz/core";

const input = [5, 1, 4, 2];
const view = [...input];

for (const step of bubbleSort(input)) {
  if (step.kind === "swap") {
    const { firstPos, secondPos } = step;
    [view[firstPos], view[secondPos]] = [view[secondPos], view[firstPos]];
  }
}

// view  -> [1, 2, 4, 5]
// input -> [5, 1, 4, 2], untouched
```

Because the step type is a discriminated union, narrowing on `step.kind` gives the compiler
the exact payload of that branch — and a `switch` over every kind is checked for
completeness.

## Adding an algorithm

1. Reuse `compare`, `swap`, and `fixed`. They are shared on purpose.
2. Add a new kind only when the picture on screen changes at that moment and no existing kind
   says it. A kind that a renderer would ignore does not belong in the contract.
3. Declare the algorithm's step type in `src/algorithms/step.ts` as the base union plus its
   own kinds.
4. Take `readonly number[]`, copy it, and yield from a generator.
5. Cover it with tests: replaying the steps produces a sorted array, the input is unchanged,
   empty and single-element arrays are handled, and every algorithm-specific kind has a test
   that pins its sequence.

## Tests

```bash
npm test -w @algoviz/core            # run once
npm run test:watch -w @algoviz/core  # watch mode
npm run typecheck -w @algoviz/core   # types only
```

`vitest` strips types without checking them, so a green test run says nothing about type
correctness. Run both.

The central test is not "does it sort". It replays a run's steps against a copy of the input
and asserts the result is sorted: proof that a consumer who knows only the protocol — and
nothing about the algorithm — arrives at the right picture. One replay helper serves every
algorithm, which is what makes the contract a contract rather than a description of one
implementation.
