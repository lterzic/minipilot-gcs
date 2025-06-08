import { pb } from "@minipilot-gcs/proto";

export type TelemetryCallback = (msg: pb.mp.ITelemetry) => void;
export type LogCallback = (msg: pb.mp.ILogMessage) => void;

export interface IReceiver {
    onReceiveTelemetry: (callback: TelemetryCallback) => void;
    onReceiveLog: (callback: LogCallback) => void;
    stop: () => Promise<[void]>;
}