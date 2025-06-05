import { pb } from "@minipilot-gcs/proto";
import Joystick from "rc-joystick";
import { useState } from "react";

interface CopterControlPanelProps {
    // Maximum number of commands per second
    throttle: number;
    // Send command to the vehicle
    sendCommand: (msg: pb.mp.IUplinkMessage) => Promise<boolean>;
    // Copter info received from the handshake/configuration
    // Maximum speed, hover throttle, ...
}

function CopterControlPanel(props: CopterControlPanelProps) {
    // TODO: Replace with enum
    const [controlModeVelocity, setControlModeVelocity] = useState(true);

    return (
        <div>
            <Joystick
                onChange={() => {props.sendCommand({});}}
                throttle={1000 / props.throttle}
            />
        </div>
    );
}

export default CopterControlPanel;