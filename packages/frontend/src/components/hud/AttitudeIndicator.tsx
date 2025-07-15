import React, { type JSX } from "react";
import type { Quaternion } from "../../math/quaternion";

type PitchRoll = {
    pitch: number;
    roll: number;
};

interface AttitudeIndicatorProps {
    width: number;
    height: number;
    pitchInterval: number;
    pitchRange: number;

    pitchRoll?: PitchRoll;
    quaternion?: Quaternion;
    
    lineColor?: string;
    lineWidth?: number;
}

function quaternionToEuler({ w, x, y, z }: Quaternion): PitchRoll {
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp); // x-axis

    const sinp = 2 * (w * y - z * x);
    const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp); // y-axis

    return { pitch, roll };
}

export const AttitudeIndicator: React.FC<AttitudeIndicatorProps> = (props) => {
    const { pitch, roll } = props.pitchRoll ?? quaternionToEuler(props.quaternion ?? {w: 1, x: 0, y: 0, z: 0});

    const pitchLinearDistance = props.height / (props.pitchRange * 2);
    const pitchOffset = (pitch * 180 / Math.PI) * pitchLinearDistance;

    const viewBox = `0 0 ${props.width} ${props.height}`;

    const lines: JSX.Element[] = [];
    for (let deg = -props.pitchRange; deg <= props.pitchRange; deg += props.pitchInterval) {
        const y = props.height / 2 + pitchOffset - deg * pitchLinearDistance;
        if (y >= 0 && y < props.height) {
            lines.push(
                <line
                    key={deg}
                    x1={0}
                    y1={y}
                    x2={props.width}
                    y2={y}
                    stroke={props.lineColor}
                    strokeWidth={props.lineWidth}
                />
            );
        }
    }

    return (
        <svg width={props.width} height={props.height} viewBox={viewBox}>
            <g transform={`rotate(${-roll * 180 / Math.PI}, ${props.width / 2}, ${props.height / 2})`}>
                {lines}
            </g>
        </svg>
    );
};
