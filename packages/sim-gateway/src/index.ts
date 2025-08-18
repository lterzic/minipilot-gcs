import { createSocket } from "dgram";
import { WebSocketServer } from "ws";
import { runCommandSequence } from "./mock-command.js";
import { pb } from "@minipilot-gcs/proto";

// Has to match with the minipilot-sim udp ports
const SIM_ADDRESS = "127.0.0.1";
const SIM_UPLINK_PORT = 25564;
const SIM_DOWNLINK_PORT = 25565;

// Socket for the simulator connection
const linkSocket = createSocket("udp4");
// This is the socket for the frontend connection
const wss = new WebSocketServer({port: 25566});

wss.on('connection', (ws) => {
    console.log("Connection from: %s", ws.url);

    ws.on('error', console.error);

    // Pass the message from the frontend to the simulator
    ws.on('message', (data) => {
        linkSocket.send(data as Buffer, SIM_UPLINK_PORT, SIM_ADDRESS);
    });

    ws.on('close', () => {
        console.log("WS connection closed...");
    });
});

linkSocket.on("message", (msg, rinfo) => {
    // Pass downlink messages from the simulator to the frontend
    wss.clients.forEach((client) => {
        client.send(msg);
    });
    console.log(JSON.stringify(
        pb.mp.DownlinkMessage.decode(msg).telemetry,
        (key, v) => {
            if (typeof v === "number")
                return v.toPrecision(3);
            return v;
        },
        2
    ));
});
linkSocket.bind(SIM_DOWNLINK_PORT, SIM_ADDRESS);

console.log("Simulator link started...");

let uplinkCounter = 0;
runCommandSequence((cmd) => {
    linkSocket.send(pb.mp.UplinkMessage.encode({
        messageId: uplinkCounter++,
        command: cmd
    }).finish(), SIM_UPLINK_PORT, SIM_ADDRESS);
    console.log("Command sent: %s", cmd);
});

process.on("SIGINT", () => {
    console.log("\nClosing the simulator link...");
    
    wss.close(() => {
        linkSocket.close(() => {
            process.exit(0);
        });
    });
});
process.on("exit", (code) => {
    console.log("Exiting...");
});