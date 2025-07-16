import React, { Fragment, type JSX } from "react";
import type { EulerAngles } from "../../math/quaternion";
import type { HudTheme } from "./HudTheme";

interface AttitudeIndicatorProps {
    // Vehicle orientation in ZYX Euler angles in radians
    eulerAngles: EulerAngles;
    // Length of the pitch lines
    pitchLineLength: number;
    // Distance in pixels between pitch lines
    pitchVerticalDistance: number;
    // Show pitch lines in multiples of this interval value
    pitchIntervalDegrees: number;
    // Show pitch lines from -pitchAngle to pitchAngle
    // relative to the current pitch
    pitchRangeDegrees: number;
    // HUD theme
    theme: HudTheme;
}

export const AttitudeIndicator: React.FC<AttitudeIndicatorProps> = (props) => {
    const {pitchIntervalDegrees, pitchLineLength, pitchRangeDegrees, pitchVerticalDistance, theme} = props;
    const pitch = props.eulerAngles.pitch * 180 / Math.PI;
    const roll = props.eulerAngles.roll * 180 / Math.PI;

    // Check if aircraft is inverted (roll > 90° or roll < -90°)
    const isInverted = Math.abs(roll) > 90;

    // Adjust pitch display for inverted flight
    const displayPitch = isInverted ? -pitch : pitch;
    const displayRoll = isInverted ? roll + (roll > 0 ? -180 : 180) : roll;

    // Generate pitch lines
    const generatePitchLines = () => {
        const pitchLines = [];
        const pitchPixelsPerDegree = pitchVerticalDistance / pitchIntervalDegrees;

        // Calculate the range of pitch angles to display
        const minPitch = Math.ceil((displayPitch - pitchRangeDegrees) / pitchIntervalDegrees) * pitchIntervalDegrees;
        const maxPitch = Math.floor((displayPitch + pitchRangeDegrees) / pitchIntervalDegrees) * pitchIntervalDegrees;

        for (let pitchAngle = minPitch; pitchAngle <= maxPitch; pitchAngle += pitchIntervalDegrees) {
            // Calculate vertical position relative to current pitch
            const yOffset = -(pitchAngle - displayPitch) * pitchPixelsPerDegree;
            
            pitchLines.push({
                pitch: pitchAngle,
                yOffset: yOffset
            });
        }

        return pitchLines
    };

    return (
        <g transform={`rotate(${displayRoll}, ${pitchLineLength / 2}, 0)`}>
            {generatePitchLines().map((line) => (
                <Fragment key={line.pitch}>
                    <line
                        key={line.pitch}
                        x1={0}
                        x2={pitchLineLength}
                        y1={line.yOffset}
                        y2={line.yOffset}
                        stroke={theme.lineColor}
                        strokeWidth={theme.lineWidth}
                    ></line>
                    <text
                        x={0}
                        y={line.yOffset}
                        fill={theme.lineColor}
                        fontSize={theme.fontSize}
                        textAnchor="end"
                    >
                        {Math.abs(line.pitch)}°
                    </text>
                    <text
                        x={pitchLineLength}
                        y={line.yOffset}
                        fill={theme.lineColor}
                        fontSize={theme.fontSize}
                        textAnchor="start"
                    >
                        {Math.abs(line.pitch)}°
                    </text>
                </Fragment>
            ))}
        </g>
    );
};
