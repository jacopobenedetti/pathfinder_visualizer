export type CellType =
  | "empty"
  | "wall"
  | "start"
  | "target"
  | "visited"
  | "path";

export type Cell = {
  row: number;
  col: number;
  type: CellType;
};

export type Grid = Cell[][];

export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      type: "empty" as CellType,
    }))
  );
}