import { pb } from "@minipilot-gcs/proto";
import { createSocket } from "dgram";
import { writeFileSync } from "fs";
import { WebSocketServer } from "ws";
import { runCommandSequence } from "./mock-command.js";

const SIM_ADDRESS = "127.0.0.1";
const SIM_PORT_TELEMETRY = 25565;
const SIM_PORT_COMMAND = 25564;

const commandSocket = createSocket("udp4");
const telemetrySocket = createSocket("udp4");
const wss = new WebSocketServer({port: 25566});

wss.on('connection', (ws) => {
    console.log("Connection from: %s", ws.url);

    ws.on('error', console.error);

    // Assuming that only command messages are received from clients
    ws.on('message', (data) => {
        commandSocket.send(data as Buffer, SIM_PORT_COMMAND, SIM_ADDRESS);
    });

    ws.on('close', () => {
        console.log("WS connection closed...");
    });
});

const telemetryHistory: pb.mp.Telemetry[] = [];

telemetrySocket.on("message", (msg, rinfo) => {
    // Save decoded telemetry data
    const tel = pb.mp.Telemetry.decode(msg);
    telemetryHistory.push(tel);
    console.log(tel.state?.rotation);
    
    // Assuming that client expects only telemetry messages for now
    wss.clients.forEach((client) => {
        client.send(msg);
    });
});

telemetrySocket.bind(SIM_PORT_TELEMETRY, SIM_ADDRESS);
console.log("Simulator link started...");

runCommandSequence((cmd) => {
    commandSocket.send(
        pb.mp.Command.encode(cmd).finish(),
        SIM_PORT_COMMAND,
        SIM_ADDRESS
    );
    console.log("Command sent: %s", cmd);
})

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
    writeFileSync("dist/telemetryLog.json", JSON.stringify(telemetryHistory));
    console.log("Exiting...");
});