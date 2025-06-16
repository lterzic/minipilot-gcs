import { createSocket } from "dgram";
import { WebSocketServer } from "ws";

const SIM_ADDRESS = "127.0.0.1";
const SIM_PORT_TELEMETRY = 25565;
const SIM_PORT_COMMAND = 25564;

const commandSocket = createSocket("udp4");
const telemetrySocket = createSocket("udp4");
const wss = new WebSocketServer({port: 25566});

wss.on('connection', (ws) => {
    console.log("New WS connection...");

    ws.on('error', console.error);

    // Assuming that only command messages are received from clients
    ws.on('message', (data) => {
        commandSocket.send(data as Buffer, SIM_PORT_COMMAND, SIM_ADDRESS);
    });

    ws.on('close', () => {
        console.log("WS connection closed...");
    });
});

telemetrySocket.on("message", (msg, rinfo) => {
    // Assuming that client expects only telemetry messages for now
    wss.clients.forEach((client) => {
        client.send(msg);
    });
});

telemetrySocket.bind(SIM_PORT_TELEMETRY, SIM_ADDRESS);

console.log("Simulator link started...");

process.on("SIGINT", () => {
    console.log("\nClosing the simulator link...");
    
    wss.close(() => {
        telemetrySocket.close(() => {
            commandSocket.close(() => {
                process.exit(0);
            });
        });
    });
});
process.on("exit", (code) => {
    console.log("Exiting...");
});