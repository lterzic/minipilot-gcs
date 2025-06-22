import type { pb } from "@minipilot-gcs/proto";
import { Gauge } from "@mui/x-charts/Gauge";

export interface IMotorGaugeProps {
    name: string;
    motor: pb.mp.Motor;
}

export function MotorGauge(props: IMotorGaugeProps) {
    // Add RPM as text if available

    return (
        <Gauge
            startAngle={-110}
            endAngle={110}
            value={props.motor.inputThrottle * 100}
            text={props.name}
        />
    );
}