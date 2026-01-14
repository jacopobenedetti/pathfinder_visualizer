"use client";

import { useState, MouseEvent, useCallback } from "react";
import { createEmptyGrid, Grid as GridType } from "../grid";

type position = { row: number; col: number } | null;

export function useGridController(rows: number, cols: number) {
  const [grid, setGrid] = useState<GridType>(() => createEmptyGrid(rows, cols));
  const [start, setStart] = useState<position>(null);
  const [target, setTarget] = useState<position>(null);

  const handleCellClick = useCallback((
    row: number,
    col: number,
    e: MouseEvent<HTMLDivElement>
  ) => {
    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = next[row][col];

      const isShift = e.shiftKey;
      const isAlt = e.altKey || e.metaKey;

      if (isShift) {
        if (start) next[start.row][start.col].type = "empty";
        cell.type = "start";
        setStart({ row, col });
        return next; 
      }

      if (isAlt) {
        if (target) next[target.row][target.col].type = "empty";
        cell.type = "target";
        setTarget({ row, col });
        return next; 
      }

      if (!start) {
        cell.type = "start";
        setStart({ row, col });
        return next; 
      }

      if (!target) {
        if (!(row === start.row && col === start.col)) {
          cell.type = "target";
          setTarget({ row, col });
        }
        return next; 
      }

      if (row === start.row && col === start.col) {
        next[row][col].type = "empty";
        setStart(null);
        return next; 
      }

      if (row === target.row && col === target.col) {
        next[row][col].type = "empty";
        setTarget(null);
        return next; 
      }

      // toggle muro
      if (cell.type === "wall") {
        cell.type = "empty";
      } else if (cell.type === "empty") {
        cell.type = "wall";
      }

      return next; 
    });
  }, [start, target]);

  return{
    grid,
    start,
    target,
    handleCellClick,
    updateGrid: useCallback((fn: (prev: GridType) => GridType) =>
      setGrid((prev) => {
        const next = fn(prev);
        let newStart: position = null;
        let newTarget: position = null;
        for (const row of next) {
          for (const cell of row) {
            if (cell.type === "start") newStart = { row: cell.row, col: cell.col };
            if (cell.type === "target") newTarget = { row: cell.row, col: cell.col };
          }
        }
        setStart(newStart);
        setTarget(newTarget);
        return next;
      }), []),
    resetGrid: useCallback(() => {
      setGrid(createEmptyGrid(rows, cols));
      setStart(null);
      setTarget(null);
    }, [rows, cols])
  }
}
