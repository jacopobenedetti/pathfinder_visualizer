export const SPEED = [
    {
        id: 1,
        label: "Slow",
        speedValue: 600
    },
    {
        id: 2,
        label: "Medium",
        speedValue: 350
    },
    {
        id: 3,
        label: "Fast",
        speedValue: 180 
    }
] as const;

export type SpeedId = (typeof SPEED)[number]["id"];

export function getSpeedById(id: SpeedId) {
    return SPEED.find((s) => s.id === id) ?? SPEED[1];
}
