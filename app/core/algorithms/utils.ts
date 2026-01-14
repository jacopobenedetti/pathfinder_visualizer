import type { Grid } from "../grid";
import type { Coord } from "./types";

export function manhattanDistance(a: Coord, b: Coord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function getOrthogonalNeighbors(pos: Coord, grid: Grid): Coord[] {
  const { row, col } = pos;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const neighbors: Coord[] = [];

  if (row > 0) neighbors.push({ row: row - 1, col });
  if (row < rows - 1) neighbors.push({ row: row + 1, col });
  if (col > 0) neighbors.push({ row, col: col - 1 });
  if (col < cols - 1) neighbors.push({ row, col: col + 1 });

  return neighbors;
}

export function reconstructPath(
  parent: (Coord | null)[][],
  start: Coord,
  target: Coord
): Coord[] {
  const path: Coord[] = [];
  let current: Coord | null = target;

  while (current) {
    path.push(current);
    if (current.row === start.row && current.col === start.col) break;
    current = parent[current.row][current.col];
  }

  return path.reverse();
}
