"use client";

import { CellType } from "../core/grid";
import { MouseEvent, memo, useCallback } from "react";

type CellProps = {
    type: CellType;
    row: number;
    col: number;
    onCellClick?: (row: number, col: number, event: MouseEvent<HTMLDivElement>) => void;
}

const CellComponent = ({ type, row, col, onCellClick } : CellProps) => {

    const baseClasses = "w-full aspect-square rounded-[4px] transition-colors duration-150 cursor-pointer";

    const typeClass = getCellClass(type);
    const hoverClass = type === "empty" ? "hover:bg-(--wall) hover:border-(--wall)" : "";

    const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
        onCellClick?.(row, col, event);
    }, [onCellClick, row, col]);

    return(
        <div
            onClick={handleClick}
            className={`${baseClasses} ${typeClass} ${hoverClass}`}
        />
    );
}

const Cell = memo(CellComponent);
Cell.displayName = "Cell";

function getCellClass(type: CellType): string {
  switch (type) {
    case "start":
      return "bg-(--blue-vercel) border-[var(--blue-vercel)] rounded-full";
    case "target":
      return "bg-(--orange) border-[var(--orange)] rounded-full";
    case "wall":
      return "bg-(--wall) border-[var(--wall)]";
    case "visited":
      return "bg-(--blue-vercel)/40 border-(--blue-vercel)/40";
    case "path":
      return "bg-[var(--purple)] border-[var(--purple)]";
    default:
      return "bg-(--bg-cell) border-[#262626]";
  }
}

export default Cell;
