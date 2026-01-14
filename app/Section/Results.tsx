import ResultCard from "../components/ResultCard";

export type SimulationResult = {
    nodesVisited: number;
    pathLength: number;
    timeMs: number;
    status: string;
};

const Results = ({
    nodesVisited,
    pathLength,
    timeMs,
    status
}: SimulationResult) => {
    const formattedTimeMs = Number.isFinite(timeMs)
        ? new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }).format(timeMs)
        : "0";

    return (
        <div className="flex flex-row gap-8 items-center justify-center w-full">
            <ResultCard
                result={nodesVisited}
                description="NODES VISITED"
            />
            <ResultCard
                result={pathLength}
                description="PATH LENGTH"
            />
            <ResultCard
                result={formattedTimeMs}
                description="TIME"
                unit
            />
            <ResultCard
                result={status}
                description="STATUS"
            />
        </div>
    );
}


export default Results;
