/**
 * ZYX Euler angles in radians
 */
export type EulerAngles = {
    roll: number;
    pitch: number;
    yaw: number;
};

export class Quaternion {
    w: number;
    x: number;
    y: number;
    z: number;

    constructor(w: number, x: number, y: number, z: number) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Normalize the quaternion
    normalize(): Quaternion {
        const norm = Math.sqrt(this.w ** 2 + this.x ** 2 + this.y ** 2 + this.z ** 2);
        return new Quaternion(this.w / norm, this.x / norm, this.y / norm, this.z / norm);
    }

    // Convert Quaternion to Roll, Pitch, Yaw (in radians)
    toEuler(): EulerAngles {
        const { w, x, y, z } = this;

        // Roll (x-axis rotation)
        const sinr_cosp = 2 * (w * x + y * z);
        const cosr_cosp = 1 - 2 * (x * x + y * y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);

        // Pitch (y-axis rotation)
        const sinp = 2 * (w * y - z * x);
        let pitch: number;
        if (Math.abs(sinp) >= 1) {
            pitch = Math.sign(sinp) * Math.PI / 2; // use 90 degrees if out of range
        } else {
            pitch = Math.asin(sinp);
        }

        // Yaw (z-axis rotation)
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);

        return { roll, pitch, yaw };
    }

    // Create Quaternion from Roll, Pitch, Yaw (in radians)
    static fromEuler(roll: number, pitch: number, yaw: number): Quaternion {
        const cy = Math.cos(yaw * 0.5);
        const sy = Math.sin(yaw * 0.5);
        const cp = Math.cos(pitch * 0.5);
        const sp = Math.sin(pitch * 0.5);
        const cr = Math.cos(roll * 0.5);
        const sr = Math.sin(roll * 0.5);

        const w = cr * cp * cy + sr * sp * sy;
        const x = sr * cp * cy - cr * sp * sy;
        const y = cr * sp * cy + sr * cp * sy;
        const z = cr * cp * sy - sr * sp * cy;

        return new Quaternion(w, x, y, z);
    }
}
