import { pb } from "@minipilot-gcs/proto";

export function runCommandSequence(sendCommand: (cmd: pb.mp.Command) => void): void {
    setTimeout(() => {
        sendCommand({
            copter: {
                setLinearVelocity: {
                    velocity: {x: 0, y: 0, z: 0.5},
                    direction: 0
                }
            }
        })
    }, 3000);

    setTimeout(() => {
        sendCommand({
            copter: {
                setLinearVelocity: {
                    velocity: {x: 1, y: 0, z: 0.0},
                    direction: 0
                }
            }
        })
    }, 8000);

    setTimeout(() => {
        sendCommand({
            copter: {
                setLinearVelocity: {
                    velocity: {x: 0, y: 1, z: 0.0},
                    direction: 0
                }
            }
        })
    }, 13000);

    setTimeout(() => {
        sendCommand({
            copter: {
                setLinearVelocity: {
                    velocity: {x: 0, y: 0, z: 0},
                    direction: 0
                }
            }
        })
    }, 18000);
}