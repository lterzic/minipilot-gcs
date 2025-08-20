import { pb } from "@minipilot-gcs/proto";

/**
 * Dictionary of callbacks for each payload type in the Downlink Message
 */
type DownlinkCallbacks = {
    [P in NonNullable<pb.mp.DownlinkMessage["payload"]> as P["$case"]]:
        (msg: pb.mp.DownlinkMessage & {payload: P}) => void;
};

/**
 * Represents the communication interface to the vehicle
 */
export abstract class VehicleLink {
    private downlinkCallbacks: Partial<DownlinkCallbacks> = {};
    private uplinkMessageId: number = 0;

    /**
     * Close the connection so that another
     * connection to the vehicle can be opened
     */
    abstract disconnect(): Promise<void>;

    /**
     * Send an uplink message with the given payload
     */
    sendPayload(payload: NonNullable<pb.mp.UplinkMessage["payload"]>): Promise<void> {
        // TODO: Destination ID is received during the handshake
        // and the source ID is unique globally for the GCS
        const msg: pb.mp.UplinkMessage = {
            messageId: this.uplinkMessageId++,
            srcId: 0,
            destId: 0,
            payload: payload
        };
        return this.send(msg);
    }

    /**
     * Set a callback for downlink message payload
     */
    onPayload<P extends keyof DownlinkCallbacks>(payload: P, callback: DownlinkCallbacks[P]): void {
        this.downlinkCallbacks[payload] = callback;
    }

    /**
     * Register a callback for when the connection to
     * the vehicle is lost
     */
    onTimeout(callback: () => void): void {

    }

    /**
     * Send the uplink message to the vehicle
     */
    protected abstract send(msg: pb.mp.UplinkMessage): Promise<void>;

    /**
     * Called by the implementation when a downlink message is received
     */
    protected recv(msg: pb.mp.DownlinkMessage): void {
        if (msg.payload?.$case && this.downlinkCallbacks[msg.payload.$case]) {
            // @ts-expect-error - protobuf makes sure that the case always matches the value
            this.downlinkCallbacks[msg.payload.$case](msg);
        }
    }

    // TODO: Add checkHealth() => Promise<Health>; which can measure
    // round time and signal quality
}