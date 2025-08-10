import { createSocket } from "dgram";
import { WebSocketServer } from "ws";

// Has to match with the minipilot-sim udp ports
const SIM_ADDRESS = "127.0.0.1";
const SIM_UPLINK_PORT = 25564;
const SIM_DOWNLINK_PORT = 25565;

// Sockets for the simulator connection
const uplinkSocket = createSocket("udp4");
const downlinkSocket = createSocket("udp4");
// This is the socket for the frontend connection
const wss = new WebSocketServer({port: 25566});

wss.on('connection', (ws) => {
    console.log("New WS connection...");

    ws.on('error', console.error);

    // Pass the message from the frontend to the simulator
    ws.on('message', (data) => {
        uplinkSocket.send(data as Buffer, SIM_UPLINK_PORT, SIM_ADDRESS);
    });

    ws.on('close', () => {
        console.log("WS connection closed...");
    });
});

downlinkSocket.on("message", (msg, rinfo) => {
    // Pass downlink messages from the simulator to the frontend
    wss.clients.forEach((client) => {
        client.send(msg);
    });
});
downlinkSocket.bind(SIM_DOWNLINK_PORT, SIM_ADDRESS);

console.log("Simulator link started...");

process.on("SIGINT", () => {
    console.log("\nClosing the simulator link...");
    
    wss.close(() => {
        downlinkSocket.close(() => {
            uplinkSocket.close(() => {
                process.exit(0);
            });
        });
    });
});
process.on("exit", (code) => {
    console.log("Exiting...");
});