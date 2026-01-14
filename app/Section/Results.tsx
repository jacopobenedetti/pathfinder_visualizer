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
                result={timeMs}
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
