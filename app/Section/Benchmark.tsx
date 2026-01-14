"use client";

import Card from "../components/Card";
import Button from "../components/Button";
import NumberSteppers from "../components/NumberSteppers";
import ToggleSwitch from "../components/ToggleSwitch";
import { useState } from "react";
import { createEmptyGrid, Grid } from "../core/grid";
import { applyPerlinNoise } from "../core/algorithms/perlin";
import { bfs } from "../core/algorithms/bfs";
import { gbfs } from "../core/algorithms/gbfs";
import { astar } from "../core/algorithms/astar";
import { dijkstra } from "../core/algorithms/dijkstra";
import type { AlgorithmFn, AlgorithmRun, Coord } from "../core/algorithms/types";
import { AlgorithmId } from "../algorithms";

type BenchmarkResultsCardProps = {
    algorithm?: string;
    avg_path_length?: number;
    avg_nodes_length?: number;
    avg_time?: number;
};

const BenchmarkResultsCard = ({
    algorithm = "A* (A-Star)",
    avg_path_length = 42.6,
    avg_nodes_length = 451,
    avg_time = 233
}: BenchmarkResultsCardProps) => {

    return (
        <Card
            className="w-full flex-col justify-center gap-2 min-h-[190px]"
            isLevelTwo
        >
            <div className="flex w-full justify-start items-center pb-2">
                <h1 className="text-2xl font-bold">{algorithm}</h1>
            </div>

            <div className="flex w-full justify-between items-center">
                <p className="font-sans font-bold text-base text-(--text-light)">Avg. Path Length</p>
                <p className="font-bold text-base">{avg_path_length}</p>
            </div>

            <div className="flex w-full h-px bg-(--border-dark)" />

            <div className="flex w-full justify-between items-center">
                <p className="font-sans font-bold text-base text-(--text-light)">Avg. Nodes Visited</p>
                <p className="font-bold text-base">{avg_nodes_length}</p>
            </div>

            <div className="flex w-full h-px bg-(--border-dark)" />

            <div className="flex w-full justify-between items-center">
                <p className="font-sans font-bold text-base text-(--text-light)">Avg. Time (ms)</p>
                <p className="font-bold text-base">{avg_time}</p>
            </div>
        </Card>
    );
}

type BenchmarkProps = {
    rows: number;
    cols: number;
    basePerlinScale: number;
    basePerlinThreshold: number;
};

type Aggregate = {
    totalPath: number;
    totalVisited: number;
    totalTime: number;
    successes: number;
};

type BenchmarkMetrics = {
    avgPathLength: number;
    avgNodesVisited: number;
    avgTime: number;
};

const algorithms: { id: AlgorithmId; label: string; fn: AlgorithmFn }[] = [
    { id: "AStar", label: "A* (A-Star)", fn: astar },
    { id: "Dijkstra", label: "Dijkstra", fn: dijkstra },
    { id: "GBFS", label: "Greedy Best-First Search", fn: gbfs },
    { id: "BFS", label: "Breadth-First Search", fn: bfs },
];

const LoadingCard = ({ progressLabel }: { progressLabel: string }) => (
    <Card className="w-full flex-col justify-center gap-2 animate-pulse min-h-[190px]" isLevelTwo>
        <div className="flex w-full justify-between items-center">
            <p className="font-sans font-bold text-base text-(--text-light)">Running benchmarks</p>
            <p className="font-bold text-base text-(--text-light)">{progressLabel}</p>
        </div>
        <div className="w-full h-2 rounded bg-(--border-dark)">
            <div className="h-full bg-(--blue-vercel) rounded" style={{ width: progressLabel }} />
        </div>
        <p className="text-sm text-(--text-light)">Processing...</p>
    </Card>
);

const Benchmark = ({ rows, cols, basePerlinScale, basePerlinThreshold }: BenchmarkProps) => {
    const [isPerlinNoiseEnabled, setIsPerlinNoiseEnabled] = useState(false);
    const [iterations, setIterations] = useState(100);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<Record<AlgorithmId, BenchmarkMetrics> | null>(null);

    const handlePerlinNoiseToggle = (newValue: boolean) => {
        setIsPerlinNoiseEnabled(newValue);
    };

    const randomCoord = (r: number, c: number): Coord => ({
        row: Math.floor(Math.random() * r),
        col: Math.floor(Math.random() * c),
    });

    const buildGrid = (): { grid: Grid; start: Coord; target: Coord } => {
        const base = createEmptyGrid(rows, cols);
        const start = randomCoord(rows, cols);
        let target = randomCoord(rows, cols);
        while (start.row === target.row && start.col === target.col) {
            target = randomCoord(rows, cols);
        }

        base[start.row][start.col].type = "start";
        base[target.row][target.col].type = "target";

        if (!isPerlinNoiseEnabled) {
            return { grid: base, start, target };
        }

        const perlinScaleMin = Math.max(5, basePerlinScale * 0.5);
        const perlinScaleMax = Math.max(perlinScaleMin + 1, basePerlinScale * 1.5);
        const perlinScale = perlinScaleMin + Math.random() * (perlinScaleMax - perlinScaleMin);

        const perlinThresholdMin = Math.max(0.1, basePerlinThreshold - 0.2);
        const perlinThresholdMax = Math.min(0.9, basePerlinThreshold + 0.2);
        const perlinThreshold = perlinThresholdMin + Math.random() * (perlinThresholdMax - perlinThresholdMin);
        const seed = Math.floor(Math.random() * 1_000_000_000);

        const withNoise = applyPerlinNoise(base, {
            scale: perlinScale,
            threshold: perlinThreshold,
            seed
        });

        
        withNoise[start.row][start.col].type = "start";
        withNoise[target.row][target.col].type = "target";

        return { grid: withNoise, start, target };
    };

    const computeMetrics = (
        run: AlgorithmRun,
        start: Coord,
        target: Coord,
        elapsed: number
    ): { nodesVisited: number; pathLength: number; success: boolean; timeMs: number } => {
        const visitedSet = new Set<string>();
        for (const step of run.steps) {
            for (const node of step.visited ?? []) {
                const isStart = node.row === start.row && node.col === start.col;
                const isTarget = node.row === target.row && node.col === target.col;
                if (!isStart && !isTarget) {
                    visitedSet.add(`${node.row}-${node.col}`);
                }
            }
        }

        const success = run.path.length > 0;
        const pathLength = success ? Math.max(run.path.length - 1, 0) : 0;

        return {
            nodesVisited: visitedSet.size,
            pathLength,
            success,
            timeMs: elapsed
        };
    };

    const runBenchmark = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setProgress(0);
        setResults(null);

        const aggregates: Record<AlgorithmId, Aggregate> = {
            AStar: { totalPath: 0, totalVisited: 0, totalTime: 0, successes: 0 },
            Dijkstra: { totalPath: 0, totalVisited: 0, totalTime: 0, successes: 0 },
            GBFS: { totalPath: 0, totalVisited: 0, totalTime: 0, successes: 0 },
            BFS: { totalPath: 0, totalVisited: 0, totalTime: 0, successes: 0 },
        };

        const safeIterations = Math.max(1, Math.floor(iterations));

        for (let i = 0; i < safeIterations; i++) {
            const { grid, start, target } = buildGrid();

            for (const { id, fn } of algorithms) {
                const startTime = performance.now();
                const run = fn(grid, start, target);
                const elapsed = Math.round(performance.now() - startTime);
                const metrics = computeMetrics(run, start, target, elapsed);

                const agg = aggregates[id];
                agg.totalVisited += metrics.nodesVisited;
                agg.totalPath += metrics.pathLength;
                agg.totalTime += metrics.timeMs;
                if (metrics.success) {
                    agg.successes += 1;
                }
            }

            const nextProgress = i + 1;
            setProgress(nextProgress);

            if (nextProgress % 5 === 0) {
                await new Promise((resolve) => setTimeout(resolve, 0));
            }
        }

        const finalResults: Record<AlgorithmId, BenchmarkMetrics> = {} as Record<AlgorithmId, BenchmarkMetrics>;
        for (const { id } of algorithms) {
            const agg = aggregates[id];
            const avgPath = agg.successes > 0 ? agg.totalPath / agg.successes : 0;
            const avgVisited = agg.totalVisited / safeIterations;
            const avgTime = agg.totalTime / safeIterations;

            finalResults[id] = {
                avgPathLength: Number(avgPath.toFixed(2)),
                avgNodesVisited: Number(avgVisited.toFixed(2)),
                avgTime: Number(avgTime.toFixed(2)),
            };
        }

        setResults(finalResults);
        setIsRunning(false);
    };

    const progressPct = results
        ? "100%"
        : `${Math.min(100, Math.round((progress / Math.max(1, iterations)) * 100))}%`;

    return (
        <div className="flex w-full items-center justify-center">
            <Card
                className="flex w-full flex-col gap-8"
                isLevelTwo={false}
            >
                <div className="flex flex-row items-start justify-between w-full">
                    <div className="">
                        <h1 className="text-2xl font-bold text-white">Algorithm Benchmark</h1>
                        <p className="font-sans font-bold text-base text-(--text-light)">Compare performance across {iterations} scenarios {isPerlinNoiseEnabled ? "randomized with Perlin" : "on empty grids"}.</p>
                    </div>
                    <Button
                        text={isRunning ? "Running..." : "Run Benchmark"}
                        isButton
                        onClick={runBenchmark}
                        className={isRunning ? "opacity-60 cursor-not-allowed" : ""}
                    />
                </div>
                <div className="flex flex-row items-center justify-center w-full gap-4">
                    <p className="font-sans font-bold text-base text-(--text-light)">ITERATIONS</p>
                    <NumberSteppers
                        step={100}
                        initialValue={iterations}
                        max={10000}
                        min={100}
                        className="justify-between gap-12"
                        onChange={(value) => setIterations(Math.floor(value))}
                    />
                    <div className="flex flex-row items-center justify-center gap-4">
                        <p className="font-sans font-bold text-base text-(--text-light)">Perlin Noise</p>
                        <ToggleSwitch
                            onToggle={handlePerlinNoiseToggle}
                            initialValue={isPerlinNoiseEnabled}
                        />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between w-full gap-4">
                    {(isRunning ? algorithms.slice(0, 2) : algorithms.slice(0, 2)).map((alg) => (
                        isRunning
                            ? <LoadingCard key={alg.id} progressLabel={progressPct} />
                            : <BenchmarkResultsCard
                                key={alg.id}
                                algorithm={alg.label}
                                avg_path_length={results?.[alg.id]?.avgPathLength}
                                avg_nodes_length={results?.[alg.id]?.avgNodesVisited}
                                avg_time={results?.[alg.id]?.avgTime}
                            />
                    ))}
                </div>
                <div className="flex flex-row items-center justify-between w-full gap-4">
                    {(isRunning ? algorithms.slice(2) : algorithms.slice(2)).map((alg) => (
                        isRunning
                            ? <LoadingCard key={alg.id} progressLabel={progressPct} />
                            : <BenchmarkResultsCard
                                key={alg.id}
                                algorithm={alg.label}
                                avg_path_length={results?.[alg.id]?.avgPathLength}
                                avg_nodes_length={results?.[alg.id]?.avgNodesVisited}
                                avg_time={results?.[alg.id]?.avgTime}
                            />
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Benchmark;
