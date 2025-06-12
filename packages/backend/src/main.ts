import { pb } from "@minipilot-gcs/proto";
import { SimLink } from "./link/SimLink";


const simLink = new SimLink("127.0.0.1", 25564, 25565, 0);

simLink.onReceiveTelemetry((telemetry) => {
    console.log(JSON.stringify(telemetry, null, 4));
});

setTimeout(() => {
    const command: pb.mp.ICommand = {
        copter: {
            setAngularVelocity: {
                thrust: 12,
                angularVelocity: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        }
    };
    simLink.sendCommand(command);
    console.log("Sent command");
}, 1000 * 20);

process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing the link...');

    simLink.close().then(() => {
        process.exit(0);
    })
});
