"use client";

import { Grid } from "../core/grid";
import Cell from "./Cell";
import { MouseEvent } from "react";

type GridVisualizerProps = {
  grid: Grid;
  onCellClick?: (row: number, col: number, e: MouseEvent<HTMLDivElement>) => void;
};

const GridVisualizer = ({ grid, onCellClick }: GridVisualizerProps) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  if (!rows || !cols) return null;

  return (
    <div className="w-full h-full bg-(--bg-dark)">
      <div className="w-full h-full  rounded-[24] flex items-center justify-center">
        <div
          className="grid aspect-square w-full max-w-[500px]"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: "3px",
          }}
        >
          {grid.flat().map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              row={cell.row}
              col={cell.col}
              type={cell.type}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridVisualizer;
