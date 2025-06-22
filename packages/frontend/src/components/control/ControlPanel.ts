import { pb } from "@minipilot-gcs/proto";

export interface IControlPanelProps {
    /**
     * Send a command to the vehicle
     * @returns Promise is resolved once the command has
     * been sent from the GCS, this does not mean that
     * the vehicle received it. Promise is rejected on send
     * failure
     */
    sendCommand: (command: pb.mp.Command) => Promise<void>;
}