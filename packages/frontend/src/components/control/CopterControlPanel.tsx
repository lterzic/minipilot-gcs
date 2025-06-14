import Joystick from "rc-joystick";
import { useState } from "react";
import { IControlPanelProps } from "./ControlPanel";

interface ICopterControlPanelProps extends IControlPanelProps {
    // Copter info received from the handshake/configuration
    // Maximum speed, hover throttle, ...

    /**
     * Maximum magnitude of the velocity vector's x and y components
     * @note Units are `m/s`
     */
    maximumGroundSpeed: number;

    /**
     * Maximum value of the upwards velocity component such that
     * any combination of ground and climb speed within the limits
     * should be achievable
     * @note Units are `m/s`
     */
    maximumClimbSpeed: number;

    /**
     * Opposite of `maximumClimbSpeed`, represents the maximum
     * velocity going downwards that can be combined with any
     * allowed ground speed
     * @note Units are `m/s`
     */
    maximumDescentSpeed: number;

    /**
     * Maximum speed of rotation in both directions
     * @note Units are `rad/s`
     */
    maximumYawSpeed: number;

    /**
     * Maximum absolute value of angular velocity's x and y
     * components when controlling the angular velocity
     * directly
     * @note Units are `rad/s`
     */
    maximumAngularVelocity: number;
}

function CopterControlPanel(props: IControlPanelProps) {
    // TODO: Replace with enum
    const [controlModeVelocity, setControlModeVelocity] = useState(true);

    return (
        <div>
            <Joystick
                onChange={() => {
                    props.sendCommand({
                        copter: {
                            setAngularVelocity: {
                                angularVelocity: {x: 0, y: 0, z: 0},
                                thrust: 1
                            }
                        }
                    })
                }}
            />
        </div>
    );
}

export default CopterControlPanel;