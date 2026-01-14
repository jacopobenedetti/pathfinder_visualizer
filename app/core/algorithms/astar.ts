import type { AlgorithmFn, AlgorithmRun, AlgorithmStep, Coord } from "./types";
import { getOrthogonalNeighbors, manhattanDistance, reconstructPath } from "./utils";

export const astar: AlgorithmFn = (grid, start, target): AlgorithmRun => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  if (!rows || !cols) return { steps: [], visitedOrder: [], path: [] };

  const closed: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const gScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Number.POSITIVE_INFINITY)
  );
  const hScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0)
  );
  const fScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Number.POSITIVE_INFINITY)
  );
  const parent: (Coord | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  type QueueItem = Coord;
  const open: QueueItem[] = [];
  const steps: AlgorithmStep[] = [];
  const visitedOrder: Coord[] = [];

  const push = (coord: Coord) => {
    open.push(coord);
    open.sort((a, b) => {
      const fa = fScore[a.row][a.col];
      const fb = fScore[b.row][b.col];
      if (fa !== fb) return fa - fb;
      return hScore[a.row][a.col] - hScore[b.row][b.col];
    });
  };

  gScore[start.row][start.col] = 0;
  hScore[start.row][start.col] = manhattanDistance(start, target);
  fScore[start.row][start.col] = hScore[start.row][start.col];
  push(start);

  let reachedTarget = false;

  while (open.length > 0) {
    const current = open.shift()!; // sorted by f then h
    if (closed[current.row][current.col]) continue;
    if (grid[current.row][current.col].type === "wall") continue;

    closed[current.row][current.col] = true;
    visitedOrder.push(current);

    if (current.row === target.row && current.col === target.col) {
      reachedTarget = true;
      break;
    }

    const newlyVisited: Coord[] = [];

    for (const neighbor of getOrthogonalNeighbors(current, grid)) {
      if (grid[neighbor.row][neighbor.col].type === "wall") continue;
      if (closed[neighbor.row][neighbor.col]) continue;

      const tentativeG = gScore[current.row][current.col] + 1;
      if (tentativeG < gScore[neighbor.row][neighbor.col]) {
        gScore[neighbor.row][neighbor.col] = tentativeG;
        hScore[neighbor.row][neighbor.col] = manhattanDistance(neighbor, target);
        fScore[neighbor.row][neighbor.col] =
          gScore[neighbor.row][neighbor.col] + hScore[neighbor.row][neighbor.col];
        parent[neighbor.row][neighbor.col] = current;
        newlyVisited.push(neighbor);
        push(neighbor);
      }
    }

    if (newlyVisited.length > 0) {
      steps.push({ visited: newlyVisited });
    }
  }

  let path: Coord[] = [];
  if (reachedTarget) {
    path = reconstructPath(parent, start, target);
    steps.push({ visited: [], path });
  }

  return { steps, visitedOrder, path };
};
