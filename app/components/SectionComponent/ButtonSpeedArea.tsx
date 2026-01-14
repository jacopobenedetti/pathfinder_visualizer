

import Button from "../Button";
import { SpeedId, SPEED } from "../../speed";

const ButtonSpeedArea = ({
    selected,
    onChange
} : {
    selected: SpeedId;
    onChange: (id: SpeedId) => void; 
}) => {

    return (
        <div className="flex flex-col md:flex-row items-start justify-start w-full gap-4 py-4">
            {SPEED.map((speed) => (
                <Button
                    key={speed.id}
                    text={speed.label}
                    isButton
                    isActive={selected === speed.id}
                    onClick={() => onChange(speed.id)}
                />
            ))}
        </div>
    );
}

export default ButtonSpeedArea;
