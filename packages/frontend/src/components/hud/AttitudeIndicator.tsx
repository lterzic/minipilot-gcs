import React, { Fragment, type JSX } from "react";
import type { EulerAngles } from "../../math/rotation";
import type { HudTheme } from "./HudTheme";

interface AttitudeIndicatorProps {
    // Vehicle orientation in ZYX Euler angles in radians
    eulerAngles: EulerAngles;
    // Pitch lines which can be displayed in degrees
    pitchMarkers: number[];
    // Show pitch lines from -pitchAngle to pitchAngle degrees
    // relative to the current pitch
    pitchRange: number;
    // Length of the pitch lines in pixels
    pitchLineLength: number;
    // Render distance between pitch lines
    pixelsPerDegree: number;
    // HUD theme
    theme: HudTheme;
}

export const AttitudeIndicator: React.FC<AttitudeIndicatorProps> = (props) => {
    const { pitchMarkers, pitchRange, pitchLineLength, pixelsPerDegree, theme } = props;
    const pitch = props.eulerAngles.pitch * 180 / Math.PI;
    const roll = props.eulerAngles.roll * 180 / Math.PI;

    const minPitchDisplay = pitch - pitchRange;
    const maxPitchDisplay = pitch + pitchRange;

    const pitchDisplayMarkers = pitchMarkers
        .filter((v) => v >= minPitchDisplay && v <= maxPitchDisplay)
        .map((v) => ({ pitch: v, verticalOffset: (pitch - v) * pixelsPerDegree }));

    const drawPitchMarker = (v: typeof pitchDisplayMarkers[number]) => {
        const lineRadius = pitchLineLength / 2;
        return (<Fragment key={v.verticalOffset}>
            <line
                x1={-lineRadius}
                x2={lineRadius}
                y1={v.verticalOffset}
                y2={v.verticalOffset}
                stroke={theme.lineColor}
                strokeWidth={theme.lineWidth}
            />
            <text
                x={-lineRadius}
                y={v.verticalOffset}
                textAnchor="end"
                fill={theme.lineColor}
                fontSize={theme.fontSize}
            >
                {Math.abs(v.pitch)}°
            </text>
            <text
                x={lineRadius}
                y={v.verticalOffset}
                textAnchor="start"
                fill={theme.lineColor}
                fontSize={theme.fontSize}
            >
                {Math.abs(v.pitch)}°
            </text>
        </Fragment>);
    };

    return (
        <g transform={`rotate(${roll})`}>
            {pitchDisplayMarkers.map((v) => drawPitchMarker(v))}
        </g>
    );
};
