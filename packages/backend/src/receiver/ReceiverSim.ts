import { IReceiver, LogCallback, TelemetryCallback } from "./Receiver";
import { createSocket, Socket } from "dgram";
import { pb } from "@minipilot-gcs/proto";

export class ReceiverSim implements IReceiver {
    private telemetryCallback?: TelemetryCallback;
    private logCallback?: LogCallback;

    private telemetrySocket: Socket;
    // private logSocket: Socket;

    constructor(
        telemetryPort: number,
        logPort: number
    ) {
        this.telemetrySocket = this.setupSocket("Telemetry", telemetryPort, (data) => {
            if (this.telemetryCallback) {
                const telemetry = pb.mp.Telemetry.decode(data, data.length);
                this.telemetryCallback(telemetry);
            }
        });
        // this.logSocket = createSocket("udp4");
    }

    public onReceiveTelemetry(callback: TelemetryCallback) {
        this.telemetryCallback = callback;
    }

    public onReceiveLog(callback: LogCallback) {
        this.logCallback = callback;
    }

    public stop() {
        return Promise.all([
            new Promise<void>((resolve) => {
                this.telemetrySocket.close(() => {
                    resolve();
                });
            })
        ]);
    }

    private setupSocket(name: string, port: number, msgHandler: (data: Buffer) => void): Socket {
        const socket = createSocket("udp4");

        socket.on("listening", () => {
            const endpoint = socket.address();
            console.log(`${name} socket started listening on ${endpoint.address}:${endpoint.port}`);
        });

        socket.on("message", (msg, rinfo) => {
            // console.log(`${name} socket message:\n${msg}`);
            msgHandler(msg);
        });

        socket.on("error", (err) => {
            console.error(`${name} socket error:\n${err.stack}`);
            socket.close();
        });

        socket.on("close", () => {
            console.log(`${name} socket closed...`);
        });

        socket.bind(port);

        return socket;
    }
}
