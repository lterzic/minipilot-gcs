import { pb } from "@minipilot-gcs/proto";

export interface IControlPanelProps {
    /**
     * Send a command to the vehicle
     * @returns Promise is resolved once the command has
     * been sent from the GCS, this does not mean that
     * the vehicle received it. Promise is rejected on send
     * failure
     */
    sendCommand: (command: pb.mp.ICommand) => Promise<void>;
}

/**
 * Used to apply a throttle to the send command before
 * passing it to the control panel
 * @todo Fix this
 */
export function throttle(
    frequency: number,
    func: (command: pb.mp.ICommand) => Promise<void>
) {
    let lastCommand: pb.mp.ICommand | undefined;
    let promise: Promise<void> | undefined;

    // Call the func and start the timer for the next one
    function callFunc(cmd: pb.mp.ICommand): Promise<void> {
        const result = func(cmd);
            
        promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                promise = undefined;
                if (lastCommand) {
                    resolve(callFunc(lastCommand));
                    lastCommand = undefined;
                } else {
                    resolve();
                }
            }, 1000 / frequency);
        });
        return result;
    }
    
    const throttled = (command: pb.mp.ICommand) => {
        if (promise) {
            // If there is a triggered function waiting
            // to execute, just update the latest command
            lastCommand = command;
            return promise;
        } else {
            // Send the current command and start a throttled
            // execution so that the next call doesn't send
            // immediately
            return callFunc(command);
        }
    };
    return throttled;
}