import { useEffect, useState } from 'react';
import './App.css'
import { MotorGauge } from './components/dashboard/MotorGauge';
import { TimeSeries } from './components/dashboard/TimeSeries';
import { SimLink } from './link/SimLink';
import type { pb } from '@minipilot-gcs/proto';

function App() {
    const [telemetry, setTelemetry] = useState<pb.mp.Telemetry[]>([]);

    
    useEffect(() => {
        const link = new SimLink();

        link.onTelemetry((msg) => {
            setTelemetry([
                ...telemetry,
                msg
            ]);
        });

        return () => {
            link.disconnect();
        };
    });

    return (
        <div>
            <MotorGauge
                name={"FL"}
                motor={{
                    inputThrottle: 0.78,
                    angularSpeed: 3
                }}
            />
            <TimeSeries
                name={"Accelerometer"}
                t={telemetry.map((v, i) => i * 0.1)}
                data={[
                    telemetry.map((v) => v.state?.acceleration?.x ?? 0),
                    telemetry.map((v) => v.state?.acceleration?.y ?? 0),
                    telemetry.map((v) => v.state?.acceleration?.z ?? 0)
                ]}
            />
        </div>
    );
}

export default App
