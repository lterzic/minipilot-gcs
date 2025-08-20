import { createSocket } from "dgram";
import { WebSocketServer } from "ws";

// Has to match with the minipilot-sim udp ports
const SIM_ADDRESS = "127.0.0.1";
const SIM_UPLINK_PORT = 25564;
const SIM_DOWNLINK_PORT = 25565;

// Port for forwarding data to the frontend
const FRONTEND_PORT = 25566;

// Socket for communication with the minipilot port
const linkSocket = createSocket("udp4");
// This is the socket for the frontend connection
const wss = new WebSocketServer({port: FRONTEND_PORT});

// Setup forwarding from the frontend to minipilot
wss.on('connection', (ws) => {
    console.log("Connection from: %s", ws.url);

    ws.on('error', console.error);

    ws.on('message', (data) => {
        linkSocket.send(data as Buffer, SIM_UPLINK_PORT, SIM_ADDRESS);
    });

    ws.on('close', () => {
        console.log("WS connection closed...");
    });
});

// Setup forwarding from minipilot to the frontend
linkSocket.on("message", (msg, rinfo) => {
    wss.clients.forEach((client) => {
        client.send(msg);
    });
});
linkSocket.bind(SIM_DOWNLINK_PORT, SIM_ADDRESS);


console.log("Simulator gateway started...");

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