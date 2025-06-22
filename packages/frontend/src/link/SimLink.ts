export class SimLink {
    private socket: WebSocket;

    public constructor(address = "127.0.0.1", port = 25566) {
        this.socket = new WebSocket("ws://" + address + ":" + port);

        this.socket.onopen = ((ev: Event) => {
            console.log(ev);
        });

        this.socket.onmessage = ((ev: Event) => {
            console.log(ev);
        });
    }

    public close() {
        this.socket.close();
    }
}