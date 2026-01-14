"use client";

import { useState } from "react";
import Config from "../Section/Config";
import Grid from "../Section/Grid";
import { SpeedId } from "../speed";
import { AlgorithmId } from "../algorithms";
import Results, { SimulationResult } from "../Section/Results";
import Benchmark from "../Section/Benchmark";

const GridManager = () => {
    const [gridWidth] = useState(30);
    const [gridHeight] = useState(30);
    const [selectedSpeed, setSelectedSpeed] = useState<SpeedId>(2);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmId>("AStar");
    const [perlinScale, setPerlinScale] = useState(0.95);
    const [perlinThreshold, setPerlinThreshold] = useState(0.3);
    const [lastResult, setLastResult] = useState<SimulationResult>({
        nodesVisited: 0,
        pathLength: 0,
        timeMs: 0,
        status: "Ready"
    });

    return (
        <>
            <Config
                selectedSpeed={selectedSpeed}
                onSpeedChange={setSelectedSpeed}
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmChange={setSelectedAlgorithm}
                perlinScale={perlinScale}
                perlinThreshold={perlinThreshold}
                onPerlinScaleChange={setPerlinScale}
                onPerlinThresholdChange={setPerlinThreshold}
            />
            <Grid
                rows={gridHeight}
                cols={gridWidth}
                speed={selectedSpeed}
                algorithm={selectedAlgorithm}
                perlinScale={perlinScale}
                perlinThreshold={perlinThreshold}
                onRunComplete={setLastResult}
                onResetResults={() => setLastResult({
                    nodesVisited: 0,
                    pathLength: 0,
                    timeMs: 0,
                    status: "Ready"
                })}
            />
            <Results
                nodesVisited={lastResult.nodesVisited}
                pathLength={lastResult.pathLength}
                timeMs={lastResult.timeMs}
                status={lastResult.status}
            />
            <Benchmark
                rows={gridHeight}
                cols={gridWidth}
                basePerlinScale={perlinScale}
                basePerlinThreshold={perlinThreshold}
            />
        </>
    );
};

export default GridManager;
