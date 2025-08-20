import { pb } from "@minipilot-gcs/proto";
import { VehicleLink } from "./VehicleLink";

export class SimLink extends VehicleLink {
    private socket: WebSocket;

    public constructor(address = "127.0.0.1", port = 25566) {
        super();

        this.socket = new WebSocket("ws://" + address + ":" + port);

        this.socket.onopen = ((ev: Event) => {
            console.log("Gateway link established...");
        });

        this.socket.onmessage = (ev: MessageEvent) => {
            (ev.data as Blob).bytes().then((data) => {
                this.recv(pb.mp.DownlinkMessage.decode(data));
            });
        };
    }

    disconnect() {
        this.socket.close();
        return Promise.resolve();
    }

    protected send(msg: pb.mp.UplinkMessage): Promise<void> {
        this.socket.send(pb.mp.UplinkMessage.encode(msg).finish());
        return Promise.resolve();
    }
}