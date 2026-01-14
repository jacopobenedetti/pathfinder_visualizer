"use client";

import { AlgorithmId, ALGORITHMS } from "../../algorithms";
import Button from "../Button";

type ButtonTextAreaProps = {
    selected: AlgorithmId;
    onChange: (next: AlgorithmId) => void;
};

const ButtonTextArea = ({ selected, onChange }: ButtonTextAreaProps) => {
    const current = ALGORITHMS.find((a) => a.id === selected);

    return (
        <div className="flex flex-col items-start justify-center w-full py-4 gap-4">
            <div className="flex flex-col md:flex-row items-start justify-start w-full gap-4">
                {ALGORITHMS.map((algo) => (
                    <Button
                        key={algo.id}
                        text={algo.label}
                        isButton
                        isActive={selected === algo.id}
                        onClick={() => onChange(algo.id)}
                    />
                ))}
            </div>

            <div className="text-base font-sans font-regular text-white">
                {current?.description}
            </div>
        </div>
    );
}

export default ButtonTextArea;
