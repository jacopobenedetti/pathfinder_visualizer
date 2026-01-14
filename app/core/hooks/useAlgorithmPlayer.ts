"use client";

import { useEffect, useMemo, useState } from "react";
import type { Grid } from "../grid";
import type { AlgorithmRun, AlgorithmStep } from "../algorithms/types";

export type PlayerStatus = "idle" | "running" | "finished";

export function useAlgorithmPlayer(
  baseGrid: Grid,
  run: AlgorithmRun | null,
  speedMs: number,
) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [grid, setGrid] = useState<Grid>(baseGrid);
  const [status, setStatus] = useState<PlayerStatus>("idle");

  // Expand the final path into sequential steps so it animates node-by-node
  const expandedSteps = useMemo<AlgorithmStep[]>(() => {
    if (!run) return [];
    const out: AlgorithmStep[] = [];
    for (const step of run.steps) {
      const { visited = [], path } = step;
      if (visited.length) {
        out.push({ visited });
      }
      if (path && path.length) {
        for (const node of path) {
          out.push({ visited: [], path: [node] });
        }
      }
    }
    return out;
  }, [run]);

  // Precompute all grid frames once per run to avoid heavy work on every tick
  const frames = useMemo<Grid[]>(() => {
    if (!run || expandedSteps.length === 0) return [];
    const out: Grid[] = [];
    let current = baseGrid.map((row) => row.map((cell) => ({ ...cell })));

    for (const step of expandedSteps) {
      current = applyStep(current, step);
      out.push(current);
    }
    return out;
  }, [run, expandedSteps, baseGrid]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const schedule = (fn: () => void) => {
      Promise.resolve().then(fn);
    };

    if (!run) {
      schedule(() => {
        setGrid(baseGrid);
        setFrameIndex(0);
        setStatus("idle");
      });
      return;
    }

    if (expandedSteps.length === 0 || frames.length === 0) {
      schedule(() => {
        setGrid(baseGrid);
        setFrameIndex(0);
        setStatus("finished");
      });
      return;
    }

    schedule(() => {
      setGrid(baseGrid);
      setFrameIndex(-1);
      setStatus("running");
    });

    const tick = () => {
      setFrameIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= frames.length) {
          setStatus("finished");
          return prev;
        }

        setGrid(frames[nextIndex]);
        timer = setTimeout(tick, speedMs);
        return nextIndex;
      });
    };

    timer = setTimeout(tick, speedMs);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [run, speedMs, baseGrid, frames, expandedSteps]);
  return { grid, frameIndex, status };
}

function applyStep(old: Grid, step: AlgorithmRun["steps"][number]): Grid {
  const next = old.map((row) => row.map((cell) => ({ ...cell })));

  for (const { row, col } of step.visited) {
    if (
      next[row][col].type !== "start" &&
      next[row][col].type !== "target" &&
      next[row][col].type !== "wall"
    ) {
      next[row][col].type = "visited";
    }
  }

  if (step.path) {
    for (const { row, col } of step.path) {
      if (
        next[row][col].type !== "start" &&
        next[row][col].type !== "target" &&
        next[row][col].type !== "wall"
      ) {
        next[row][col].type = "path";
      }
    }
  }

  return next;
}
