import { pb } from "@minipilot-gcs/proto";
import type { IVehicleLink } from "./VehicleLink";

export class SimLink implements IVehicleLink {
    private socket: WebSocket;

    public constructor(address = "127.0.0.1", port = 25566) {
        this.socket = new WebSocket("ws://" + address + ":" + port);

        this.socket.onopen = ((ev: Event) => {
            console.log("Simulator link established...");
        });
    }

    public disconnect() {
        this.socket.close();
        return Promise.resolve();
    }

    public sendCommand(command: pb.mp.Command) {
        const serialData = pb.mp.Command.encode(command).finish();
        this.socket.send(serialData);
        return Promise.resolve();
    }

    public onTelemetry(callback: (msg: pb.mp.Telemetry) => void) {
        // Currently assuming only telemetry data is received through the websocket
        this.socket.onmessage = (ev: MessageEvent) => {
            (ev.data as Blob).bytes().then((data) => {
                callback(pb.mp.Telemetry.decode(data));
            });
        };
    }

    public onLog(callback: (msg: pb.mp.LogMessage) => void) {

    }

    public onTimeout(callback: () => void) {

    }
}