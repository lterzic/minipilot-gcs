import { ReceiverSim } from "./receiver/ReceiverSim";

const simReceiver = new ReceiverSim(25565, 0);

simReceiver.onReceiveTelemetry((telemetry) => {
    console.log(JSON.stringify(telemetry, null, 4));
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down UDP server...');
    simReceiver.stop().then(() => {
        process.exit(0);
    })
});