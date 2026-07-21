import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, Environment } from '@react-three/drei';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { useRowStore } from './stores/useRowStore';
import RocketModel from './components/RocketModel';
import DebugPanel from './components/DebugPanel';
import ChartPanel from './components/ChartPanel';
import FlightMap from './components/FlightMap';
import DataUnavailable from './components/DataUnavailable';
import useErrorSSE from './hooks/useErrorSSE';
import useRowSSE from './hooks/useRowSSE';
import useErrorToast from './hooks/useErrorToast';

function HeaderTime() {
  const time = useRowStore((state) => state.atual?.time);
  return <div className="header-time">{time ?? 'N/A'}</div>;
}

export default function App() {
  L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });
  const isLive = useRowStore((state) => state.isLive);
  const hasData = useRowStore((state) => state.hasData);
  const canvasRef = useRef();

  useRowSSE();
  useErrorSSE();
  useErrorToast();

  return (
    <div className="app-root">
      {/* TOPO */}
      <div className={`top-strip ${isLive ? 'online' : 'offline'}`}>
        <span className="top-strip-txt">SUPERNOVA · SUPERVISÓRIO DE VOO</span>
        <span className="top-strip-live">
          {isLive && <span className="live-sq" />}
          {isLive ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="header-eyebrow">tempo de missão</div>
          <HeaderTime />
          <div className="header-sub">Jiripoca v4.1 · LoRa 915 MHz</div>
        </div>
        <div className="header-right">
          <span className="tag tag-purple">MSN-2026</span>
          <span className="tag tag-outline">SETOR ELETRÔNICA</span>
        </div>
      </div>

      {/* CORPO PRINCIPAL */}
      <div className="main-grid">
        {/* COLUNA ESQUERDA: MAPA */}
        <div className="col-left">
          <section className="card card-mapa">
            <div className="card-label">rastreamento · GPS</div>
            <div className="mapa-wrap">
              <FlightMap />
            </div>
          </section>
        </div>

        {/* COLUNA MEIO: TELEMETRIA / DEBUG */}
        <div className="col-middle">
          <div className="card-debug-wrapper">
            <DebugPanel />
          </div>
        </div>

        {/* COLUNA DIREITA: FOGUETE 3D E GRÁFICOS */}
        <div className="col-right">
          {/* MODELO 3D */}
          <section className="card card-3d">
            <div className="card-label">orientação · IMU</div>
            <div className="canvas-wrap" ref={canvasRef} style={{ flex: 1, minHeight: 0 }}>
              {!hasData ? (
                <DataUnavailable />
              ) : (
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }} style={{ height: '100%', width: '100%' }}>
                  <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
                    <directionalLight position={[-5, 5, -5]} intensity={0.4} />
                    <RocketModel />
                    <Grid
                      position={[0, -1.5, 0]}
                      args={[10, 10]}
                      cellSize={0.5}
                      cellThickness={1}
                      cellColor="#6f6f6f"
                      sectionSize={1}
                      sectionThickness={1.5}
                      sectionColor="#9d9d9d"
                      fadeDistance={10}
                      fadeStrength={0.5}
                      infiniteGrid={false}
                    />
                  </Suspense>
                </Canvas>
              )}
            </div>
          </section>

          {/* GRÁFICOS */}
          <ChartPanel />
        </div>
      </div>

      {/* RODAPÉ */}
      <div className="bot-strip">
        <span className="bs-item">STATUS <span className="bs-val">{isLive ? 'NOMINAL' : 'OFFLINE'}</span></span>
        <span className="bs-item">SUPERVISÓRIO <span className="bs-val">SUPERNOVA</span></span>
      </div>
    </div>
  );
}