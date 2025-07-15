import React, { useState } from "react";
import { AttitudeIndicator } from "./AttitudeIndicator"; // adjust import path as needed
import type { Quaternion } from "../../math/quaternion";

// Convert degrees to radians
const deg2rad = (deg: number) => deg * Math.PI / 180;

// Convert roll and pitch (in degrees) to quaternion
function eulerToQuaternion(rollDeg: number, pitchDeg: number): Quaternion {
    const roll = deg2rad(rollDeg);
    const pitch = deg2rad(pitchDeg);
    const yaw = 0; // ignore yaw for this test

    const cy = Math.cos(yaw * 0.5);
    const sy = Math.sin(yaw * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);

    const w = cr * cp * cy + sr * sp * sy;
    const x = sr * cp * cy - cr * sp * sy;
    const y = cr * sp * cy + sr * cp * sy;
    const z = cr * cp * sy - sr * sp * cy;

    return {x, y, z, w};
}

export const AttitudeIndicatorTest: React.FC = () => {
    const [pitch, setPitch] = useState(0);
    const [roll, setRoll] = useState(0);

    const quaternion = eulerToQuaternion(roll, pitch);

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h2>Attitude Indicator Test</h2>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <AttitudeIndicator
                    quaternion={quaternion}
                    width={200}
                    height={300}
                    pitchInterval={15}
                    pitchRange={90}
                />
                <div>
                    <label>
                        Pitch ({pitch}°)
                        <input
                            type="range"
                            min={-90}
                            max={90}
                            value={pitch}
                            onChange={(e) => setPitch(Number(e.target.value))}
                        />
                    </label>
                    <br />
                    <label>
                        Roll ({roll}°)
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            value={roll}
                            onChange={(e) => setRoll(Number(e.target.value))}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};
