import { Command, IVehicleLink, LogCallback, TelemetryCallback } from "./VehicleLink.js";
import { createSocket, Socket } from "dgram";
import { pb } from "@minipilot-gcs/proto";

export class SimLink implements IVehicleLink {
    private telemetryCallback?: TelemetryCallback;
    private logCallback?: LogCallback;

    private commandSocket: Socket;
    private telemetrySocket: Socket;
    // private logSocket: Socket;

    constructor(
        private mpSimAddress: string,
        private commandPort: number,
        telemetryPort: number,
        logPort: number
    ) {
        this.telemetrySocket = this.setupSocket("Telemetry", telemetryPort, (data) => {
            if (this.telemetryCallback) {
                const telemetry = pb.mp.Telemetry.decode(data, data.length);
                this.telemetryCallback(telemetry);
            }
        });
        this.commandSocket = createSocket("udp4");
    }

    public sendCommand(command: Command) {
        this.commandSocket.send(
            pb.mp.Command.encode(command).finish(),
            this.commandPort,
            this.mpSimAddress
        );
        return Promise.resolve();
    }

    public onReceiveTelemetry(callback: TelemetryCallback) {
        this.telemetryCallback = callback;
    }

    public onReceiveLog(callback: LogCallback) {
        this.logCallback = callback;
    }

    public close() {
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

        socket.bind(port, this.mpSimAddress);

        return socket;
    }
}
