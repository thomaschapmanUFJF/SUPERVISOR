import { create } from 'zustand';
import { isInvalidQuaternion, exceedsDeadband } from '../utils/deadband';

const MAX_POINTS = 50;
const MAX_MAP_POINTS = 1000;

const MAP_THROTTLE = 300; // ms
const CHART_THROTTLE = 500; // ms

let liveTimeout = null;
let lastApprovedQuaternion = null;
let lastMapUpdateTime = 0;
let lastChartUpdateTime = 0;

export const useRowStore = create((set) => ({
  // State
  current: null,
  rocketOrientation: null,
  currentCoordinates: null,
  initialCoordinates: null,
  altitudeHistory: [],
  mapCoordinatesHistory: [],
  isLive: false,
  hasData: false,

  // Action
  addTelemetry: (telemetry) => {
    if (liveTimeout) clearTimeout(liveTimeout);
    liveTimeout = setTimeout(() => {
      useRowStore.setState({ isLive: false });
    }, 2000);

    set((state) => {
      const now = performance.now();
      const shouldUpdateMap = now - lastMapUpdateTime >= MAP_THROTTLE;
      const shouldUpdateChart = now - lastChartUpdateTime >= CHART_THROTTLE;

      if (shouldUpdateMap) lastMapUpdateTime = now;
      if (shouldUpdateChart) lastChartUpdateTime = now;

      const isValidGps = telemetry.latitude !== 0 && telemetry.longitude !== 0;

      const validCoordinates = isValidGps
        ? { latitude: telemetry.latitude, longitude: telemetry.longitude }
        : state.currentCoordinates;

      const initialCoordinates =
        state.initialCoordinates ?? (isValidGps ? validCoordinates : null);

      let mapCoordinatesHistory = state.mapCoordinatesHistory;
      if (shouldUpdateMap && isValidGps) {
        const lastMapCoord = state.mapCoordinatesHistory.at(-1);
        const hasMoved =
          !lastMapCoord ||
          lastMapCoord.latitude !== validCoordinates.latitude &&
          lastMapCoord.longitude !== validCoordinates.longitude;

        if (hasMoved) {
          mapCoordinatesHistory = [
            ...state.mapCoordinatesHistory,
            validCoordinates,
          ].slice(-MAX_MAP_POINTS);
        }
      }

      const calculateOrientation = () => {
        const { q1, q2, q3, q4 } = telemetry || {};

        if (isInvalidQuaternion(q2, q3, q4, q1)) {
          return state.rocketOrientation;
        }

        const candidateQuaternion = { x: q2, y: q3, z: q4, w: q1 };
        if (exceedsDeadband(lastApprovedQuaternion, candidateQuaternion)) {
          lastApprovedQuaternion = candidateQuaternion;
          return candidateQuaternion;
        }

        return state.rocketOrientation;
      };

      return {
        current: {
          ...telemetry,
          timestamp: new Date().toLocaleTimeString(),
        },
        rocketOrientation: calculateOrientation(),
        isLive: true,
        hasData: true,
        currentCoordinates: validCoordinates,
        initialCoordinates,
        mapCoordinatesHistory,
        altitudeHistory: shouldUpdateChart
          ? [
              ...state.altitudeHistory,
              {
                time: Math.round(telemetry.time / 1000),
                altitude: telemetry.kf_altitude / 10,
              },
            ].slice(-MAX_POINTS)
          : state.altitudeHistory,
      };
    });
  },
}));