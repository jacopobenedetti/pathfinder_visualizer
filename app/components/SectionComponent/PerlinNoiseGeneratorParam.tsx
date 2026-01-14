"use client";

import NumberSteppers from "../NumberSteppers";

type PerlinNoiseGeneratorParamProps = {
    scale: number;
    threshold: number;
    onScaleChange: (next: number) => void;
    onThresholdChange: (next: number) => void;
};

const PerlinNoiseGeneratorParam = ({
    scale = 0.99,
    threshold,
    onScaleChange,
    onThresholdChange
}: PerlinNoiseGeneratorParamProps) => {
    return (
        <div className="flex flex-col items-start justify-center gap-1 w-full">
            <h1 className="font-sans font-bold text-xl text-(--text-light)">PERLIN NOISE GENERATOR</h1>
            <p className="font-sans font-bold text-base text-(--text-light)">Scale</p>
            <p className="text-sm text-(--text-light)">Pattern size: lower values make tighter details, higher values create broader patches.</p>
            <div className="flex flex-col items-start w-full py-4 gap-4">
                <NumberSteppers
                    step={0.05}
                    min={0.15}
                    max={0.95}
                    initialValue={scale}
                    onChange={onScaleChange}
                />
            </div>
            <p className="font-sans font-bold text-base text-(--text-light)">Threshold</p>
            <p className="text-sm text-(--text-light)">Noise cutoff: lower values place more walls, higher values leave more open cells.</p>
            <div className="flex flex-col items-start w-full py-4 gap-4">
                <NumberSteppers
                    step={0.05}
                    min={0.1}
                    max={0.9}
                    initialValue={threshold}
                    onChange={onThresholdChange}
                />
            </div>
        </div>
    );
}

export default PerlinNoiseGeneratorParam;
