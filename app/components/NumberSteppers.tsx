"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

type NumberSteppersProps = {
    step?: number;
    min?: number;
    max?: number;
    initialValue?: number;
    className?: string;
    onChange?: (value: number) => void;
}

const NumberSteppers = ({
    step = 0.01,
    min = 0,
    max = 0,
    initialValue,
    className = "w-full",
    onChange
}: NumberSteppersProps) => {

    const [value, setValue] = useState<number>(
        initialValue !== undefined ? initialValue : min ?? 0
    )

    const decimals = useMemo(() => {
        const s = step.toString();
        const parts = s.split(".");
        return parts[1]?.length ?? 0;
    }, [step]);

    const clamp = useCallback((v: number) => {
        let next = v;
        if (min !== undefined) next = Math.max(min, next);
        if (max !== undefined) next = Math.min(max, next);
        return next;
    }, [min, max]);

    useEffect(() => {
        if (initialValue !== undefined) {
            setValue(clamp(initialValue));
        }
    }, [initialValue, min, max, clamp]);

    const handleChange = (next: number) => {
        const clamped = clamp(next);
        setValue(clamped);
        onChange?.(clamped);
    };

    const handleDecrease = () => {
        handleChange(value - step);
    };

    const handleIncrease = () => {
        handleChange(value + step);
    };

    const isAtMin = min !== undefined && value <= min;
    const isAtMax = max !== undefined && value >= max;

    const formatted = value.toFixed(decimals);

    return (
        <div className={`flex items-center justify-between ${className} px-8 py-3 bg-black border border-(--border-dark) rounded-[12]`}>
            {/* - */}
            <button
                type="button"
                onClick={handleDecrease}
                disabled={isAtMin}
                className={`cursor-pointer select-none ${isAtMin ? "opacity-40 cursor-not-allowed" : "opacity-100"
                    }`}
            >
                <FaMinus className="hover:cursor-pointer" />
            </button>

            {/* valore */}
            <span className="flex-1 text-center font-mono text-sm">
                {formatted}
            </span>

            {/* + */}
            <button
                type="button"
                onClick={handleIncrease}
                disabled={isAtMax}
                className={`text-sm font-semibold cursor-pointer select-none ${isAtMax ? "opacity-40 cursor-not-allowed" : "opacity-100"
                    }`}
            >
                <FaPlus className="hover:cursor-pointer" />
            </button>
        </div>
    );
}

export default NumberSteppers;
