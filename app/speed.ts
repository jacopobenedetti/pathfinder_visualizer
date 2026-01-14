export const SPEED = [
    {
        id: 1,
        label: "Slow",
        speedValue: 300
    },
    {
        id: 2,
        label: "Medium",
        speedValue: 175
    },
    {
        id: 3,
        label: "Fast",
        speedValue: 90 
    }
] as const;

export type SpeedId = (typeof SPEED)[number]["id"];

export function getSpeedById(id: SpeedId) {
    return SPEED.find((s) => s.id === id) ?? SPEED[1];
}
