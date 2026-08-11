import { useRowStore } from '../stores/useRowStore';
import DataUnavailable from './DataUnavailable';
import MetricCard from './MetricCard';
import FormattedValue from './FormattedValue';

function formatTime(timeMs: number | null) {
    if (timeMs == null || isNaN(Number(timeMs))) return <span className="value-main">N/A</span>;
    const totalSeconds = Math.floor(Number(timeMs) / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return (
        <FormattedValue mainValue={`${minutes}:${seconds}`} />
    );
}

function formatAltitude(altitudeDm: number | null) {
    if (altitudeDm == null || isNaN(Number(altitudeDm))) return <span className="value-main">N/A</span>;
    const meters = Math.round(Number(altitudeDm) / 10);
    return (
        <FormattedValue mainValue={meters} unit="m" />
    );
}

function formatVelocity(velDmS: number | null) {
    if (velDmS == null || isNaN(Number(velDmS))) return <span className="value-main">N/A</span>;
    const mS = Number((Number(velDmS) / 10).toFixed(1));
    return (
        <FormattedValue mainValue={mS} unit="m/s" />
    );
}

function formatVoltage(voltageRaw: number | null) {
    if (voltageRaw == null || isNaN(Number(voltageRaw))) return <span className="value-main">N/A</span>;
    const volts = Number(Number(voltageRaw).toFixed(2));
    return (
        <FormattedValue mainValue={volts} unit="V" />
    );
}

function getVoltageThreshold(volts: number | null) {
    if (volts == null) return 'metric-nominal';
    if (volts < 3.80) return 'metric-danger';
    if (volts < 3.85) return 'metric-warning';
    return 'metric-nominal';
}

export default function DebugPanel() {
    const telemetry = useRowStore((state) => state.current);
    const isLive = useRowStore((state) => state.isLive);

    if (!telemetry) {
        return (
            <div className={`debug-panel ${isLive ? 'online' : 'offline'}`}>
                <div className={`debug-header ${isLive ? 'online' : 'offline'}`}>
                    <span className="debug-title">⬢ TELEMETRY</span>
                    <div className="debug-status">
                        {isLive && <span className="debug-dot"></span>}
                        {isLive ? 'LIVE' : 'OFFLINE'}
                    </div>
                </div>
                <DataUnavailable />
            </div>
        );
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
                <MetricCard label="TIME" value={formatTime(telemetry.time)} />
                <MetricCard label="ALT" value={formatAltitude(altitudeValue)} />
                <MetricCard label="VEL" value={formatVelocity(velocityValue)} />
                <MetricCard label="BATT" value={formatVoltage(battery)} threshold={getVoltageThreshold(battery)} />
            </div>

            <div className="debug-timestamp">
                ⏱ {timestamp} · 20Hz
            </div>
        </div>
    );
}