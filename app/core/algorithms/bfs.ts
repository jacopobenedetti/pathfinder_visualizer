import type { AlgorithmFn, AlgorithmRun, AlgorithmStep, Coord } from "./types";
import { getOrthogonalNeighbors, reconstructPath } from "./utils";

export const bfs: AlgorithmFn = (grid, start, target): AlgorithmRun => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  if (!rows || !cols) {
    return { steps: [], visitedOrder: [], path: [] };
  }

  const closed: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const gScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Number.POSITIVE_INFINITY)
  );
  const parent: (Coord | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const queue: Coord[] = [];
  const steps: AlgorithmStep[] = [];
  const visitedOrder: Coord[] = [];

  gScore[start.row][start.col] = 0;
  queue.push(start);

  let reachedTarget = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

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
        parent[neighbor.row][neighbor.col] = current;
        queue.push(neighbor);
        newlyVisited.push(neighbor);
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
