import { useEffect, useState } from 'react';
import './App.css'
import { MotorGauge } from './components/dashboard/MotorGauge';
import { TimeSeries } from './components/dashboard/TimeSeries';
import { SimLink } from './link/SimLink';
import type { pb } from '@minipilot-gcs/proto';
import { AttitudeIndicatorTest } from './components/hud/AttitudeIndicator.test';

function App() {

    return (
        <AttitudeIndicatorTest></AttitudeIndicatorTest>
    );
}

export default App
