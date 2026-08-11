import { useRowStore } from '../stores/useRowStore';
import { useShallow } from 'zustand/react/shallow';
import DataUnavailable from './DataUnavailable';
import Card from './Card';

const LAT_METERS_PER_DEGREE = 111320;

function getMetersPerLongitudeDegree(latitude) {
  return LAT_METERS_PER_DEGREE * Math.cos((latitude * Math.PI) / 180);
}

type FlightMapProps = {
  flex?: number | string;
};

export default function FlightMap({ flex }: FlightMapProps) {
  const currentCoordinates = useRowStore((state) => state.currentCoordinates);
  const initialCoordinates = useRowStore((state) => state.initialCoordinates);
  const mapCoordinatesHistory = useRowStore(
    useShallow((state) => state.mapCoordinatesHistory)
  );

  const hasValidGps =
    currentCoordinates !== null &&
    currentCoordinates.latitude != null &&
    currentCoordinates.longitude != null &&
    (currentCoordinates.latitude !== 0 || currentCoordinates.longitude !== 0);

  if (!hasValidGps) {
    return (
      <Card label="rastreamento · GPS" flex={flex}>
        <DataUnavailable />
      </Card>
    );
  }

  const startCoordinates = initialCoordinates || currentCoordinates;
  const startLat = startCoordinates.latitude;
  const startLon = startCoordinates.longitude;

  const currentX =
    (currentCoordinates.longitude - startLon) *
    getMetersPerLongitudeDegree(startLat);
  const currentY =
    (currentCoordinates.latitude - startLat) * LAT_METERS_PER_DEGREE;

  const pathPoints = mapCoordinatesHistory
    .filter((point) => point.latitude !== 0 || point.longitude !== 0)
    .map((point) => ({
      x: (point.longitude - startLon) * getMetersPerLongitudeDegree(startLat),
      y: (point.latitude - startLat) * LAT_METERS_PER_DEGREE,
    }));

  const maxDisplacement = Math.max(
    ...pathPoints.map((point) => Math.hypot(point.x, point.y)),
    Math.hypot(currentX, currentY),
    15
  );
  const range = maxDisplacement * 1.35;

  const svgWidth = 400;
  const svgHeight = 400;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

  const mapX = (meterX) => cx + (meterX / range) * (svgWidth / 2);
  const mapY = (meterY) => cy - (meterY / range) * (svgHeight / 2);

  const polylinePoints = pathPoints
    .map((point) => `${mapX(point.x)},${mapY(point.y)}`)
    .join(' ');

  const gridStepMeters =
    range <= 25 ? 5 : range <= 100 ? 25 : range <= 500 ? 100 : 250;
  const gridSteps: number[] = [];
  for (let meters = gridStepMeters; meters < range; meters += gridStepMeters) {
    gridSteps.push(meters);
  }

  return (
    <Card label="rastreamento · GPS" flex={flex}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#1a1a24',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Subtle Grid Pattern */}
            <pattern
              id="gnssGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
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
          {gridSteps.map((meters) => {
            const radius = (meters / range) * (svgWidth / 2);
            return (
              <g key={meters}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="rgba(191, 0, 255, 0.12)"
                  strokeDasharray="3 3"
                />
                <text
                  x={cx + 4}
                  y={cy - radius + 10}
                  fill="rgba(255, 255, 255, 0.25)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {meters}m
                </text>
              </g>
            );
          })}

          {/* Main Axes Crosshairs */}
          <line
            x1={0}
            y1={cy}
            x2={svgWidth}
            y2={cy}
            stroke="rgba(191, 0, 255, 0.25)"
            strokeWidth="1.5"
          />
          <line
            x1={cx}
            y1={0}
            x2={cx}
            y2={svgHeight}
            stroke="rgba(191, 0, 255, 0.25)"
            strokeWidth="1.5"
          />

          {/* Cardinal Direction Indicators */}
          <text
            x={cx + 6}
            y={14}
            fill="rgba(191, 0, 255, 0.6)"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            N (+Y)
          </text>
          <text
            x={cx + 6}
            y={svgHeight - 6}
            fill="rgba(191, 0, 255, 0.6)"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            S (-Y)
          </text>
          <text
            x={svgWidth - 36}
            y={cy - 6}
            fill="rgba(191, 0, 255, 0.6)"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            E (+X)
          </text>
          <text
            x={6}
            y={cy - 6}
            fill="rgba(191, 0, 255, 0.6)"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            W (-X)
          </text>

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
          <circle
            cx={cx}
            cy={cy}
            r="8"
            fill="none"
            stroke="#00ff88"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text
            x={cx + 10}
            y={cy + 12}
            fill="#00ff88"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            START (0,0)
          </text>

          {/* Rocket Dot Location */}
          {(() => {
            const rocketX = mapX(currentX);
            const rocketY = mapY(currentY);
            return (
              <g>
                <circle
                  cx={rocketX}
                  cy={rocketY}
                  r="10"
                  fill="rgba(191, 0, 255, 0.3)"
                />
                <circle
                  cx={rocketX}
                  cy={rocketY}
                  r="5"
                  fill="#bf00ff"
                  filter="url(#purpleGlow)"
                />
                <text
                  x={rocketX + 10}
                  y={rocketY - 6}
                  fill="#bf00ff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ROCKET ({currentX >= 0 ? '+' : ''}
                  {currentX.toFixed(1)}m, {currentY >= 0 ? '+' : ''}
                  {currentY.toFixed(1)}m)
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Legend / Stats Overlay */}
        <div
          className="map-legend"
          style={{
            background: 'rgba(26, 26, 36, 0.85)',
            borderColor: 'rgba(191, 0, 255, 0.3)',
          }}
        >
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ background: '#bf00ff', boxShadow: '0 0 6px #bf00ff' }}
            ></span>
            <span style={{ color: '#bf00ff' }}>Rocket</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}
            ></span>
            <span style={{ color: '#00ff88' }}>Start</span>
          </div>
          <div
            className="legend-item"
            style={{ marginLeft: 'auto', opacity: 0.6 }}
          >
            <span>RANGE: ±{Math.round(range)}m</span>
          </div>
        </div>
      </div>
    </Card>
  );
}