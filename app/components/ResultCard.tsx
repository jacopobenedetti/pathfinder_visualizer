
export type ResultCardProps = {
    result: number | string;
    description: string;
    unit?: boolean;
    resultClassName?: string;
}

const ResultCard = ({
    result,
    description,
    unit = false,
    resultClassName = ""
}: ResultCardProps) => {
    return (
        <div className="bg-(--bg-dark) p-8 rounded-[20] border border-(--border-dark) flex flex-col items-start w-full gap-2">
            <h1 className={`text-6xl text-white font-bold ${resultClassName}`}>{result}{unit ? <span className="text-xl">ms</span> : ""}</h1>
            <p className="font-sans font-bold text-xl text-(--text-light)">{description}</p>
        </div>
    );
}


export default ResultCard;
