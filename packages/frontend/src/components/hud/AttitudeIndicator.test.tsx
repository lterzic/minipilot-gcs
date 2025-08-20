import React, { useState } from "react";
import { AttitudeIndicator } from "./AttitudeIndicator"; // adjust import path as needed
import { type EulerAngles } from "../../math/rotation";

export const AttitudeIndicatorTest: React.FC = () => {
    const [pitchDegrees, setPitchDegrees] = useState(0);
    const [rollDegrees, setRollDegrees] = useState(0);

    const eulerAngles: EulerAngles = {
        roll: rollDegrees / 180 * Math.PI,
        pitch: pitchDegrees / 180 * Math.PI,
        yaw: 0
    };

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h2>Attitude Indicator Test</h2>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <svg width={600} height={600}>
                    <rect width="100%" height="100%" fill="white" />
                    <g transform="translate(300 300)">
                        <AttitudeIndicator
                            eulerAngles={eulerAngles}
                            yawRange={10}
                            pitchRange={16}
                            pitchMarkers={[-60, -45, -30, -15, -10, -5, 0, 5, 10, 15, 30, 45, 60]}
                            pixelsPerDegree={20}
                            theme={{
                                stroke: "black",
                                strokeWidth: 2,
                                fontSize: 10
                            }}
                        />
                    </g>
                </svg>
                <div>
                    <label>
                        Pitch ({pitchDegrees}°)
                        <input
                            type="range"
                            style={{width: 300}}
                            min={-90}
                            max={90}
                            value={pitchDegrees}
                            onChange={(e) => setPitchDegrees(Number(e.target.value))}
                        />
                    </label>
                    <br />
                    <label>
                        Roll ({rollDegrees}°)
                        <input
                            type="range"
                            style={{width: 300}}
                            min={-180}
                            max={180}
                            value={rollDegrees}
                            onChange={(e) => setRollDegrees(Number(e.target.value))}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};
