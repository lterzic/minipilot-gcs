import type { Vector3 } from "../../math/vector";
import type { HudTheme } from "./HudTheme";

interface FlightPathVectorProps {
    // Velocity vector (in m/s) such that positive x is forwards,
    // positive y is right and positive z is down
    velocityLocal: Vector3;
    // Minimum velocity magnitude to display FPV
    minimumDisplayVelocity: number;
    // Pixels per degree
    pixelsPerDegree: number;
    // Radius of the displayed vector - rest of the indicator
    // is sized accordingly
    indicatorRadius: number;
    // HUD theme
    theme: HudTheme;
}

export const FlightPathVector: React.FC<FlightPathVectorProps> = (props) => {
    const { velocityLocal, minimumDisplayVelocity, pixelsPerDegree, indicatorRadius, theme } = props;

    // Move to the vector class
    const velocityMagnitude = Math.sqrt(velocityLocal.x ** 2 + velocityLocal.y ** 2 + velocityLocal.z ** 2);
    
    if (velocityMagnitude < minimumDisplayVelocity) {
        return (<></>);
    }

    const angleOfAttack = Math.atan2(velocityLocal.z, velocityLocal.x) * 180 / Math.PI;
    const slipAngle = Math.atan2(velocityLocal.y, velocityLocal.x) * 180 / Math.PI;

    return (
        <g transform={`translate(${slipAngle * pixelsPerDegree} ${angleOfAttack * pixelsPerDegree})`}>
            <circle
                cx={0}
                cy={0}
                r={indicatorRadius}
                fill="none"
                {...theme}
            />
            <line
                x1={-indicatorRadius * 2}
                x2={-indicatorRadius}
                y1={0}
                y2={0}
                {...theme}
            />
            <line
                x1={indicatorRadius}
                x2={indicatorRadius * 2}
                y1={0}
                y2={0}
                {...theme}
            />
            <line
                x1={0}
                x2={0}
                y1={indicatorRadius}
                y2={indicatorRadius * 2}
                {...theme}
            />
        </g>
    )
};