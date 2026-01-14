"use client"

import Card from "../components/Card";

import ButtonTextArea from "../components/SectionComponent/ButtonTextArea";
import ButtonSpeedArea from "../components/SectionComponent/ButtonSpeedArea";
import PerlinNoiseGeneratorParam from "../components/SectionComponent/PerlinNoiseGeneratorParam";
import { SpeedId } from "../speed";
import { AlgorithmId } from "../algorithms";

type ConfigProps = {
    selectedSpeed: SpeedId;
    onSpeedChange: (next: SpeedId) => void;
    selectedAlgorithm: AlgorithmId;
    onAlgorithmChange: (next: AlgorithmId) => void;
    perlinScale: number;
    perlinThreshold: number;
    onPerlinScaleChange: (next: number) => void;
    onPerlinThresholdChange: (next: number) => void;
};

const Config = ({
    selectedSpeed,
    onSpeedChange,
    selectedAlgorithm,
    onAlgorithmChange,
    perlinScale,
    perlinThreshold,
    onPerlinScaleChange,
    onPerlinThresholdChange
}: ConfigProps) => {
    return (
        <Card className="flex-col gap-8 w-full" isLevelTwo={false}>
            <div className="flex flex-row w-full items-start justify-center">
                <div className="w-2/3 flex flex-col items-start justify-center gap-1 pr-8">
                    <h1 className="font-sans font-bold text-xl text-(--text-light)">ALGORITHM</h1>
                    <p className="font-sans font-bold text-base text-(--text-light)">Select a pathfinding algorithm</p>
                    <ButtonTextArea
                        selected={selectedAlgorithm}
                        onChange={onAlgorithmChange}
                    />
                    <div className="flex flex-row w-full items-start justify-start">
                        <div className="w-2/3 flex flex-col items-start justify-start gap-1">
                            <h1 className="font-sans font-bold text-xl text-(--text-light)">SPEED</h1>
                            <p className="font-sans font-bold text-base text-(--text-light)">Animation speed</p>
                            <ButtonSpeedArea 
                                selected={selectedSpeed}
                                onChange={onSpeedChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col items-start justify-center gap-4">
                    <PerlinNoiseGeneratorParam
                        scale={perlinScale}
                        threshold={perlinThreshold}
                        onScaleChange={onPerlinScaleChange}
                        onThresholdChange={onPerlinThresholdChange}
                    />
                </div>
            </div>
        </Card>
    );
}


export default Config;
