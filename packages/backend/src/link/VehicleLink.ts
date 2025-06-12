import { pb } from "@minipilot-gcs/proto";

export type Command = pb.mp.ICommand;
export type TelemetryCallback = (msg: pb.mp.ITelemetry) => void;
export type LogCallback = (msg: pb.mp.ILogMessage) => void;

/**
 * Represents the communication interface to the vehicle
 */
export interface IVehicleLink {
    /**
     * Sends the command to the vehicle
     * @returns Resolved promise if the data was sent successfully,
     * but does not mean that the vehicle received it correctly
     */
    sendCommand: (command: Command) => Promise<void>;

    /**
     * Register a callback for receiving telemetry
     */
    onReceiveTelemetry: (callback: TelemetryCallback) => void;

    /**
     * Register a callback for receiving logs
     */
    onReceiveLog: (callback: LogCallback) => void;

    /**
     * Close the link to the vehicle so that another can be opened
     */
    close: () => Promise<[void]>;

    /**
     * Register a callback for when the connection to
     * the vehicle is lost
     */
    // onTimeout: (callback: () => void) => void;

    // TODO: Add checkHealth() => Promise<Health>; which can measure
    // round time and signal quality
}