import { useState, useEffect } from 'react'
import { useTelemetria } from './Telemetria'

export default function TelaDebug(){
    const telemetry = useTelemetria((state) => state.atual);
    const [debugData, setDebugData] = useState({
        qw: 0,
        qx: 0,
        qy: 0,
        qz: 0,
        altitude: 0,
        velocity: 0,
        temperature: 0,
        pressure: 0,
        battery: 0,
        signal: 0,
        gpsLat: 0,
        gpsLon: 0,
        timestamp: ''
    });

    useEffect(() => {
        if (telemetry) {
            setDebugData({
                qw: telemetry.qw || 0,
                qx: telemetry.qx || 0,
                qy: telemetry.qy || 0,
                qz: telemetry.qz || 0,
                altitude: telemetry.altitude || 0,
                velocity: telemetry.velocity || 0,
                temperature: telemetry.temperature || 0,
                pressure: telemetry.pressure || 0,
                battery: telemetry.battery || 0,
                signal: telemetry.signal || 0,
                gpsLat: telemetry.lat || 0,
                gpsLon: telemetry.lon || 0,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    }, [telemetry]);

    const formatValue = (value, decimals = 4) => {
        if (typeof value !== 'number') return 'N/A';
        return value.toFixed(decimals);
    };

    const getValueClass = (value, warningThreshold, dangerThreshold) => {
        if (value > dangerThreshold) return 'debug-value danger';
        if (value > warningThreshold) return 'debug-value warning';
        return 'debug-value';
    };

    return (
        <div className="debug-panel">
            <div className="debug-header">
                <span className="debug-title">⬢ TELEMETRY DEBUG</span>
                <div className="debug-status">
                    <span className="debug-dot"></span>
                    LIVE
                </div>
            </div>

            <div className="debug-grid">
                <div className="debug-item">
                    <span className="debug-key">QW</span>
                    <span className="debug-value">{formatValue(debugData.qw)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">QX</span>
                    <span className="debug-value">{formatValue(debugData.qx)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">QY</span>
                    <span className="debug-value">{formatValue(debugData.qy)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">QZ</span>
                    <span className="debug-value">{formatValue(debugData.qz)}</span>
                </div>

                {/* Flight data */}
                <div className="debug-item">
                    <span className="debug-key">ALT</span>
                    <span className={getValueClass(debugData.altitude, 500, 1000)}>
                        {formatValue(debugData.altitude, 2)} m
                    </span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">VEL</span>
                    <span className={getValueClass(debugData.velocity, 50, 100)}>
                        {formatValue(debugData.velocity, 2)} m/s
                    </span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">TEMP</span>
                    <span className={getValueClass(debugData.temperature, 30, 45)}>
                        {formatValue(debugData.temperature, 1)} °C
                    </span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">PRESS</span>
                    <span className="debug-value">{formatValue(debugData.pressure, 2)} hPa</span>
                </div>

                {/* System data */}
                <div className="debug-item">
                    <span className="debug-key">BATT</span>
                    <span className={getValueClass(debugData.battery, 20, 10)}>
                        {formatValue(debugData.battery, 1)} V
                    </span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">SIGNAL</span>
                    <span className={getValueClass(debugData.signal, 30, 15)}>
                        {formatValue(debugData.signal, 0)} dBm
                    </span>
                </div>

                {/* GPS */}
                <div className="debug-item">
                    <span className="debug-key">LAT</span>
                    <span className="debug-value">{formatValue(debugData.gpsLat, 6)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">LON</span>
                    <span className="debug-value">{formatValue(debugData.gpsLon, 6)}</span>
                </div>
            </div>

            <div className="debug-timestamp">
                ⏱ {debugData.timestamp} · update: 20Hz
            </div>
        </div>
    );
}