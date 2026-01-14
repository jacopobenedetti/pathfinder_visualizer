import React, { useEffect, useState } from "react";

type ToggleSwitchProps = {
    initialValue: boolean;
    onToggle: (value: boolean) => void;
}

const ToggleSwitch = ({ initialValue = false, onToggle }: ToggleSwitchProps) => {
    const [isOn, setIsOn] = useState(initialValue);

    useEffect(() => {
        setIsOn(initialValue);
    }, [initialValue]);

    const handleToggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);
        onToggle(newValue);
    };

    return (
        <div
            className={`relative inline-flex items-center w-12 h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in-out border border-(--border-dark) ${isOn ? 'bg-blue-600 border-blue-600' : 'bg-(--bg-dark)'}`}
            onClick={handleToggle}
            aria-checked={isOn}
        >
            <span className={`inline-block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
    );
};

export default ToggleSwitch;
