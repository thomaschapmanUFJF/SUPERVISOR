import { useRowStore } from '../stores/useRowStore';
import DataUnavailable from './DataUnavailable';

function formatTime(timeMs) {
    if (timeMs == null || isNaN(Number(timeMs))) return <span className="value-main">N/A</span>;
    const totalSeconds = Math.floor(Number(timeMs) / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return <span className="value-main">{minutes}:{seconds}</span>;
}

function formatAltitude(altitudeDm) {
    if (altitudeDm == null || isNaN(Number(altitudeDm))) return <span className="value-main">N/A</span>;
    const meters = Math.round(Number(altitudeDm) / 10);
    return (
        <>
            <span className="value-main">{meters}</span>
            <span className="value-unit">m</span>
        </>
    );
}

function formatVelocity(velDmS) {
    if (velDmS == null || isNaN(Number(velDmS))) return <span className="value-main">N/A</span>;
    const mS = (Number(velDmS) / 10).toFixed(1);
    return (
        <>
            <span className="value-main">{mS}</span>
            <span className="value-unit">m/s</span>
        </>
    );
}

function formatVoltage(voltageRaw) {
    if (voltageRaw == null || isNaN(Number(voltageRaw))) return <span className="value-main">N/A</span>;
    const volts = Number(voltageRaw).toFixed(2);
    return (
        <>
            <span className="value-main">{volts}</span>
            <span className="value-unit">V</span>
        </>
    );
}

function getVoltageThreshold(volts) {
    if (volts == null) return 'metric-nominal';
    if (volts < 3.80) return 'metric-danger';
    if (volts < 3.85) return 'metric-warning';
    return 'metric-nominal';
}

export default function DebugPanel() {
    const telemetry = useRowStore((state) => state.atual);
    const isLive = useRowStore((state) => state.isLive);

    if (!telemetry) {
        return <DataUnavailable />;
    }

    const batteryValue = telemetry?.voltage ?? telemetry?.voltage_int;
    const battery = batteryValue == null ? null : Number(batteryValue) / 10;
    const altitudeValue = telemetry?.kf_altitude ?? telemetry?.altitude;
    const velocityValue = telemetry?.kf_vel_vertical ?? telemetry?.vel_vertical;
    const timestamp = telemetry?.timestamp || 'N/A';

    return (
        <div className={`debug-panel ${isLive ? 'online' : 'offline'}`}>
            <div className={`debug-header ${isLive ? 'online' : 'offline'}`}>
                <span className="debug-title">⬢ TELEMETRY</span>
                <div className="debug-status">
                    {isLive && <span className="debug-dot"></span>}
                    {isLive ? 'LIVE' : 'OFFLINE'}
                </div>
            </div>

            <div className="debug-grid">
                <div className="metric-card metric-nominal">
                    <span className="debug-key">TIME</span>
                    <div className="debug-value">{formatTime(telemetry.time)}</div>
                </div>
                <div className="metric-card metric-nominal">
                    <span className="debug-key">ALT</span>
                    <div className="debug-value">{formatAltitude(altitudeValue)}</div>
                </div>
                <div className="metric-card metric-nominal">
                    <span className="debug-key">VEL</span>
                    <div className="debug-value">{formatVelocity(velocityValue)}</div>
                </div>
                <div className={`metric-card ${getVoltageThreshold(battery)}`}>
                    <span className="debug-key">BATT</span>
                    <div className="debug-value">{formatVoltage(battery)}</div>
                </div>
            </div>

            <div className="debug-timestamp">
                ⏱ {timestamp} · 20Hz
            </div>
        </div>
    );
}