import { pb } from "@minipilot-gcs/proto";

type TelemetryCallback = (msg: pb.mp.Telemetry) => void;
type LogCallback = (msg: pb.mp.LogMessage) => void;

/**
 * Represents the communication interface to the vehicle
 */
export interface IVehicleLink {
    /**
     * Close the connection so that another
     * connection to the vehicle can be opened
     */
    disconnect: () => Promise<void>;

    /**
     * Sends the command to the vehicle
     * @returns Resolved promise if the data was sent successfully,
     * but does not mean that the vehicle received it correctly
     */
    sendCommand: (command: pb.mp.Command) => Promise<void>;

    /**
     * Handle incoming telemetry data
     */
    onTelemetry: (callback: TelemetryCallback) => void;

    /**
     * Handle incoming logs
     */
    onLog: (callback: LogCallback) => void;

    /**
     * Register a callback for when the connection to
     * the vehicle is lost
     */
    onTimeout: (callback: () => void) => void;

    // TODO: Add checkHealth() => Promise<Health>; which can measure
    // round time and signal quality
}