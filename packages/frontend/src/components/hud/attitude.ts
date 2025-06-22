import type { pb } from "@minipilot-gcs/proto";

export interface IAttitudeProps {
    // Width of the indicator as percentage of canvas width
    width: number;
    // Height of the indicator as percentage of canvas height
    height: number;
    // Vertical spacing between 5 degree angle of attack lines
    // as percentage of height
    verticalSpacing: number;
    // Quaternion data
    attitude: pb.mp.Vector4f;
}

export function drawAttitude(ctx: CanvasRenderingContext2D, props: IAttitudeProps) {
    
}