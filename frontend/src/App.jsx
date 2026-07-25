import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { useRowStore } from './stores/useRowStore';
import AreaChart from './components/AreaChart'
import RocketModel from './components/RocketModel';
import DebugPanel from './components/DebugPanel';
import FlightMap from './components/FlightMap';
import DataUnavailable from './components/DataUnavailable';
import useErrorSSE from './hooks/useErrorSSE';
import useRowSSE from './hooks/useRowSSE';
import useErrorToast from './hooks/useErrorToast';

function HeaderTime() {
  const time = useRowStore((state) => state.atual?.time);
  const formattedTime = time != null && !isNaN(Number(time)) ? Math.round(Number(time)) : (time ?? 'N/A');
  return <span>{formattedTime}</span>;
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
      <main className="main-grid">
        <div className="top-row">
          <div className="col-telemetry">
            <DebugPanel />
          </div>

          {/* COLUNA CENTRO: MAPA DE VOO */}
          <div className="col-map">
            <section className="card card-mapa">
              <div className="card-label">rastreamento · GPS</div>
              <div className="mapa-wrap">
                <FlightMap />
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA: ORIENTAÇÃO 3D */}
          <div className="col-3d">
            <section className="card card-3d">
              <div className="card-label">orientação · IMU</div>
              <div className="canvas-wrap" ref={canvasRef} style={{ flex: 1, minHeight: 0 }}>
                {!hasData ? (
                  <DataUnavailable />
                ) : (
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ height: '100%', width: '100%' }}>
                    <Suspense fallback={null}>
                      <Environment preset="city" />
                      <ambientLight intensity={0.4} />
                      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
                      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
                      <RocketModel />
                      {/* Referência estática de orientação */}
                      <axesHelper args={[2]} />
                    </Suspense>
                  </Canvas>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* PARTE INFERIOR: GRÁFICO 100% LARGURA */}
        <div className="bottom-row">
          <AreaChart />
        </div>
      </main>

      {/* RODAPÉ INTEGRADO COM METADADOS DA MISSÃO */}
      <footer className="bot-strip">
        <div className="bs-group">
          <span className={`bs-status-badge ${isLive ? 'online' : 'offline'}`}>
            {isLive && <span className="bs-live-dot" />}
            {isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          <span className="bs-item">SUPERVISÓRIO <span className="bs-val">SUPERNOVA</span></span>
          <span className="bs-item">MISSÃO <span className="bs-val">MSN-2026</span></span>
        </div>
        <div className="bs-group">
          <span className="bs-item">TEMPO DE MISSÃO <span className="bs-val bs-time"><HeaderTime />s</span></span>
          <span className="bs-item">HARDWARE <span className="bs-val">Jiripoca v4.1 · 915 MHz</span></span>
          <span className="tag tag-outline">SETOR ELETRÔNICA</span>
        </div>
      </footer>
    </div>
  );
}
