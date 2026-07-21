import { useRowStore } from '../stores/useRowStore';
import DataUnavailable from './DataUnavailable';

export default function DebugPanel() {
    const telemetry = useRowStore((state) => state.atual);
    const isLive = useRowStore((state) => state.isLive);

    if (!telemetry) {
        return <DataUnavailable />;
    }

    const formatValue = (value, decimals = 4) => {
        if (typeof value !== 'number') return 'N/A';
        return value.toFixed(decimals);
    };

    const getValueClass = (value, warningThreshold, dangerThreshold) => {
        if (value === null || value === undefined) return 'debug-value';
        if (value > dangerThreshold) return 'debug-value danger';
        if (value > warningThreshold) return 'debug-value warning';
        return 'debug-value';
    };

    const qw = telemetry?.qw;
    const qx = telemetry?.qx;
    const qy = telemetry?.qy;
    const qz = telemetry?.qz;

    const altitude = telemetry ? telemetry.altitude / 10 : null;
    const velocity = telemetry ? telemetry.vel_vertical / 10 : null;
    const battery = telemetry ? telemetry.voltage_int / 10 : null;

    const gpsLat = telemetry?.latitude;
    const gpsLon = telemetry?.longitude;

    const timestamp = telemetry?.timestamp || 'N/A';

    return (
        <div className={`debug-panel ${isLive ? 'online' : 'offline'}`}>
            <div className={`debug-header ${isLive ? 'online' : 'offline'}`}>
                <span className="debug-title">⬢ TELEMETRY DEBUG</span>
                <div className="debug-status">
                    {isLive && <span className="debug-dot"></span>}
                    {isLive ? 'LIVE' : 'OFFLINE'}
                </div>
            </div>

            <div className="debug-grid">
                <div className="debug-item">
                    <span className="debug-key">QW</span>
                    <span className="debug-value">{formatValue(qw)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">QX</span>
                    <span className="debug-value">{formatValue(qx)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">QY</span>
                    <span className="debug-value">{formatValue(qy)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">QZ</span>
                    <span className="debug-value">{formatValue(qz)}</span>
                </div>

                {/* Flight data */}
                <div className="debug-item">
                    <span className="debug-key">ALT</span>
                    <span className={getValueClass(altitude, 500, 1000)}>
                        {formatValue(altitude, 2)} m
                    </span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">VEL</span>
                    <span className={getValueClass(velocity, 50, 100)}>
                        {formatValue(velocity, 2)} m/s
                    </span>
                </div>

                {/* System data */}
                <div className="debug-item">
                    <span className="debug-key">BATT</span>
                    <span className={getValueClass(battery, 2.0, 1.0)}>
                        {formatValue(battery, 1)} V
                    </span>
                </div>

                {/* GPS */}
                <div className="debug-item">
                    <span className="debug-key">LAT</span>
                    <span className="debug-value">{formatValue(gpsLat, 6)}</span>
                </div>
                <div className="debug-item">
                    <span className="debug-key">LON</span>
                    <span className="debug-value">{formatValue(gpsLon, 6)}</span>
                </div>
            </div>

            <div className="debug-timestamp">
                ⏱ {timestamp} · update: 20Hz
            </div>
        </div>
    );
}
