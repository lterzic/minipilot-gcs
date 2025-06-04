import { pb } from "@minipilot-gcs/proto";

// Callback type for handling received data
export type DownlinkMessageCallback = (msg: pb.mp.IDownlinkMessage) => Promise<void>;

// Callback for notifying the user that there is a timeout
// Timeout refers to when a downlink message has not been
// received during the specified time interval
export type TimeoutCallback = () => Promise<void>;

// Base class describing the connection between the GCS
// and the vehicle
export abstract class VehicleLink {
    // Required callbacks from the frontend
    constructor(
        // Triggered when a message is received from minipilot
        protected receiveCallback: DownlinkMessageCallback,
        // Triggered when a downlink message is not received
        // after 2 * MAX_DOWNLINK_INTERVAL
        protected timeoutCallback: TimeoutCallback,
    ) {}

    // TODO: Add connect and disconnect methods

    // Send data to the vehicle
    public abstract sendMessage(msg: pb.mp.IUplinkMessage): Promise<boolean>;
}