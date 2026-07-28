import { useRowStore } from '../stores/useRowStore';
import { useShallow } from 'zustand/react/shallow';
import DataUnavailable from './DataUnavailable';

const LAT_M_PER_DEG = 111320;
function lonMPerDeg(lat) {
  return LAT_M_PER_DEG * Math.cos((lat * Math.PI) / 180);
}

export default function FlightMap() {
  const posicaoAtual = useRowStore((state) => state.posicaoAtual);
  const posicaoInicial = useRowStore((state) => state.posicaoInicial);
  const historicoMapaPosicao = useRowStore(
    useShallow((state) => state.historicoMapaPosicao)
  );

  const hasValidGPS = posicaoAtual !== null &&
    (posicaoAtual.latitude !== 0 || posicaoAtual.longitude !== 0);

  if (!hasValidGPS) {
    return <DataUnavailable />;
  }

  const startPos = posicaoInicial || posicaoAtual;
  const startLat = startPos.latitude;
  const startLon = startPos.longitude;

  const currentX = (posicaoAtual.longitude - startLon) * lonMPerDeg(startLat);
  const currentY = (posicaoAtual.latitude - startLat) * LAT_M_PER_DEG;

  const pathPoints = historicoMapaPosicao
    .filter((p) => p.latitude !== 0 || p.longitude !== 0)
    .map((p) => ({
      x: (p.longitude - startLon) * lonMPerDeg(startLat),
      y: (p.latitude - startLat) * LAT_M_PER_DEG
    }));

const maxDisplacement = Math.max(
  ...pathPoints.map((p) => Math.hypot(p.x, p.y)),
  Math.hypot(currentX, currentY),
  15
);
const range = maxDisplacement * 1.35;

  const svgWidth = 400;
  const svgHeight = 400;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

  const mapX = (mX) => cx + (mX / range) * (svgWidth / 2);
  const mapY = (mY) => cy - (mY / range) * (svgHeight / 2);

  const polylinePoints = pathPoints.map((p) => `${mapX(p.x)},${mapY(p.y)}`).join(' ');

  const gridStepMeters = range <= 25 ? 5 : range <= 100 ? 25 : range <= 500 ? 100 : 250;
  const gridSteps = [];
  for (let m = gridStepMeters; m < range; m += gridStepMeters) {
    gridSteps.push(m);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#1a1a24', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="gnssGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
          {/* Glow effect for Rocket dot */}
          <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="#1a1a24" />
        <rect width="100%" height="100%" fill="url(#gnssGrid)" />

        {/* Distance Grid Circles */}
        {gridSteps.map((m) => {
          const r = (m / range) * (svgWidth / 2);
          return (
            <g key={m}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(191, 0, 255, 0.12)" strokeDasharray="3 3" />
              <text x={cx + 4} y={cy - r + 10} fill="rgba(255, 255, 255, 0.25)" fontSize="8" fontFamily="monospace">
                {m}m
              </text>
            </g>
          );
        })}

        {/* Main Axes Crosshairs */}
        <line x1={0} y1={cy} x2={svgWidth} y2={cy} stroke="rgba(191, 0, 255, 0.25)" strokeWidth="1.5" />
        <line x1={cx} y1={0} x2={cx} y2={svgHeight} stroke="rgba(191, 0, 255, 0.25)" strokeWidth="1.5" />

        {/* Cardinal Direction Indicators */}
        <text x={cx + 6} y={14} fill="rgba(191, 0, 255, 0.6)" fontSize="9" fontWeight="bold" fontFamily="monospace">N (+Y)</text>
        <text x={cx + 6} y={svgHeight - 6} fill="rgba(191, 0, 255, 0.6)" fontSize="9" fontWeight="bold" fontFamily="monospace">S (-Y)</text>
        <text x={svgWidth - 36} y={cy - 6} fill="rgba(191, 0, 255, 0.6)" fontSize="9" fontWeight="bold" fontFamily="monospace">E (+X)</text>
        <text x={6} y={cy - 6} fill="rgba(191, 0, 255, 0.6)" fontSize="9" fontWeight="bold" fontFamily="monospace">W (-X)</text>

        {/* Trajectory Path Line */}
        {pathPoints.length > 1 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#bf00ff"
            strokeWidth="2"
            strokeOpacity="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Start Point (0,0) Origin Marker */}
        <circle cx={cx} cy={cy} r="4" fill="#00ff88" />
        <circle cx={cx} cy={cy} r="8" fill="none" stroke="#00ff88" strokeWidth="1" strokeOpacity="0.5" />
        <text x={cx + 10} y={cy + 12} fill="#00ff88" fontSize="9" fontFamily="monospace" fontWeight="bold">
          START (0,0)
        </text>

        {/* Rocket Dot Location */}
        {(() => {
          const rx = mapX(currentX);
          const ry = mapY(currentY);
          return (
            <g>
              <circle cx={rx} cy={ry} r="10" fill="rgba(191, 0, 255, 0.3)" />
              <circle cx={rx} cy={ry} r="5" fill="#bf00ff" filter="url(#purpleGlow)" />
              <text x={rx + 10} y={ry - 6} fill="#bf00ff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                ROCKET ({currentX >= 0 ? '+' : ''}{currentX.toFixed(1)}m, {currentY >= 0 ? '+' : ''}{currentY.toFixed(1)}m)
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend / Stats overlay */}
      <div className="map-legend" style={{ background: 'rgba(26, 26, 36, 0.85)', borderColor: 'rgba(191, 0, 255, 0.3)' }}>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#bf00ff', boxShadow: '0 0 6px #bf00ff' }}></span>
          <span style={{ color: '#bf00ff' }}>Rocket</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}></span>
          <span style={{ color: '#00ff88' }}>Start</span>
        </div>
        <div className="legend-item" style={{ marginLeft: 'auto', opacity: 0.6 }}>
          <span>RANGE: ±{Math.round(range)}m</span>
        </div>
      </div>
    </div>
  );
}