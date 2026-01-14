"use client";

import { useState, MouseEvent, useCallback } from "react";
import Card from "../components/Card";
import GridVisualizer from "../components/GridVisualizer";
import Button from "../components/Button"
import { useGridController } from "../core/hooks/useGridController";
import { bfs } from "../core/algorithms/bfs";
import { gbfs } from "../core/algorithms/gbfs";
import { astar } from "../core/algorithms/astar";
import { dijkstra } from "../core/algorithms/dijkstra";
import { applyPerlinNoise } from "../core/algorithms/perlin";
import { useAlgorithmPlayer } from "../core/hooks/useAlgorithmPlayer";
import { SpeedId, getSpeedById } from "../speed";
import { AlgorithmRun } from "../core/algorithms/types";
import { AlgorithmId } from "../algorithms";
import type { SimulationResult } from "./Results";

type GridSectionProps = {
    rows: number;
    cols: number;
    speed: SpeedId;
    algorithm: AlgorithmId;
    perlinScale: number;
    perlinThreshold: number;
    onRunComplete: (result: SimulationResult) => void;
    onResetResults?: () => void;
};

const LegendItem = ({
    text,
    rounded,
    color
}: {
    text: string,
    rounded: string,
    color: string
}) => {
    return (
        <div className="flex flex-row gap-4 items-center justify-center">
            <div className={`flex h-[24] w-[24] ${rounded} ${color}`}> </div>
            <p className="font-sans font-bold text-base text-(--text-light)">{text}</p>
        </div>
    );
}

const Legend = () => {
    return (
        <div className="flex flex-row items-center w-full md:items-start md:h-full justify-between md:gap-8 pt-4">
            <LegendItem text="Start Node" color="bg-(--blue-vercel)" rounded="rounded-full" />
            <LegendItem text="Target Node" color="bg-(--orange)" rounded="rounded-full" />
            <LegendItem text="Wall" color="bg-(--wall)" rounded="rounded-[8]" />
            <LegendItem text="Visited" color="bg-(--blue-vercel)/40" rounded="rounded-[8]" />
            <LegendItem text="Shortest Path" color="bg-(--purple)" rounded="rounded-[8]" />
        </div>
    );
}

const ButtonsControl = ({
    onReset,
    onVisualize,
    onStop,
    onGeneratePerlin
}: {
    onReset: () => void,
    onVisualize: () => void,
    onStop: () => void;
    onGeneratePerlin: () => void;
}) => {
    return (
        <div className="gap-4">
            <div className="flex md:flex-row flex-col items-center justify-between w-full gap-4 pb-4">
                <Button
                    text="Generate Perlin Noise"
                    isButton
                    onClick={onGeneratePerlin}
                    className="w-full"
                />
                <Button
                    text="Clear Grid"
                    isButton
                    onClick={onReset}
                    className="w-full"
                />
                <Button
                    text="Stop Running"
                    isButton
                    onClick={onStop}
                    className="w-full bg-red-700"
                />
            </div>
            <Button
                text="Visualize Algorithm"
                isButton
                onClick={onVisualize}
                className="w-full"
            />
        </div>
    );
}



const Grid = ({ rows, cols, speed, algorithm, perlinScale, perlinThreshold, onRunComplete, onResetResults }: GridSectionProps) => {

    const {
        grid: baseGrid,
        start,
        target,
        handleCellClick,
        updateGrid,
        resetGrid
    } = useGridController(rows, cols);

    const speedMs = getSpeedById(speed).speedValue;
    const timingRuns = 20; 
    const [run, setRun] = useState<AlgorithmRun | null>(null);

    const { grid: animateGrid } = useAlgorithmPlayer (
        baseGrid,
        run,
        speedMs
    );

    const gridToRender = run ? animateGrid : baseGrid;

    const handleVisualize = () => {
        if(!start || !target) {
            console.warn("Set start and target before visualizing");
            onRunComplete({
                nodesVisited: 0,
                pathLength: 0,
                timeMs: 0,
                status: "Set start and target"
            });
            return;
        }

        const algorithmFn =
            algorithm === "BFS" ? bfs :
            algorithm === "GBFS" ? gbfs :
            algorithm === "Dijkstra" ? dijkstra :
            algorithm === "AStar" ? astar :
            bfs;

        const startTime = performance.now();
        const result = algorithmFn(baseGrid, start, target);
        for (let i = 1; i < timingRuns; i++) {
            algorithmFn(baseGrid, start, target);
        }
        const elapsedTime = (performance.now() - startTime) / timingRuns;
        setRun(result);

        const hasPath = result.path.length > 0;
        const visitedSet = new Set<string>();

        for (const step of result.steps) {
            for (const node of step.visited ?? []) {
                const isStart = node.row === start.row && node.col === start.col;
                const isTarget = node.row === target.row && node.col === target.col;
                if (!isStart && !isTarget) {
                    visitedSet.add(`${node.row}-${node.col}`);
                }
            }
        }

        const pathLength = hasPath ? Math.max(result.path.length - 1, 0) : 0;
        onRunComplete({
            nodesVisited: visitedSet.size,
            pathLength,
            timeMs: elapsedTime,
            status: hasPath ? "Completed" : "No Path"
        });
    }

    const handleStop = () => {
        setRun(null);
    }

    const handleReset = () => {
        setRun(null);
        resetGrid();
        onResetResults?.();
    }

    const handleGeneratePerlin = () => {
        setRun(null);
        const seed = Math.floor(Math.random() * 1_000_000_000);
        updateGrid((prev) =>
            applyPerlinNoise(prev, {
                scale: perlinScale,
                threshold: perlinThreshold,
                seed
            })
        );
        onResetResults?.();
    };

    const handleClickCell = useCallback((row: number, col: number, e: MouseEvent<HTMLDivElement>) => {
        setRun(null);
        handleCellClick(row, col, e);
    }, [handleCellClick]);

    return (
        <div className="flex flex-col w-full gap-8">
            <Card className="w-full" isLevelTwo={false} >
                <div className="flex flex-col gap-12 w-full h-full min-h-[520px]">
                    <ButtonsControl 
                        onReset={handleReset}
                        onStop={handleStop}
                        onVisualize={handleVisualize}
                        onGeneratePerlin={handleGeneratePerlin}
                    />
                    <GridVisualizer grid={gridToRender} onCellClick={handleClickCell} />
                    <Legend />
                </div>
            </Card>
        </div>
    );
}

export default Grid;
