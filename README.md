# AlgoViz

Algorithm visualizer with the ability to save and share.

## Structure

npm workspaces monorepo.

| Package                            | What it is                                                               |
| ---------------------------------- | ------------------------------------------------------------------------ |
| [`packages/core`](./packages/core) | Sorting algorithms as step generators. Plain TypeScript, no DOM, tested. |
| `apps/web`                         | Next.js front end. Visualization is not implemented yet.                 |

The core package is written so that an algorithm reports **what happened** as a sequence of
steps, and the renderer decides how to draw it. That contract is described in
[`packages/core/README.md`](./packages/core/README.md).

## Tech stack (planned)

- Next.js
- Nest.js
- PostgreSQL
- Docker

## Development

```bash
npm install                          # install every workspace
npm test                             # run tests across workspaces
npm run typecheck                    # typecheck across workspaces
npm run format:check                 # prettier
npm run dev -w web                   # start the front end
```
