import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GraficoBarras from './GraficoBarras';
import GraficoArea from './GraficoArea';
import FogueteModelo from './FogueteModelo';
import { useTelemetria } from './Telemetria';
import { Suspense } from 'react';
import { OrbitControls, Stage, Grid} from '@react-three/drei'; 
import Mapa from './Mapa';
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import './WebSocket';


export default function App(){
  L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });
  const time = useTelemetria((state) => state.atual?.time);
  const [chartType, setChartType] = useState('barras');
  const canvasRef = useRef();
  return (
    <div className="app-root">

      {/* ── TOPO ── */}
      <div className="top-strip">
        <span className="top-strip-txt">SUPERNOVA · SUPERVISÓRIO DE VOO</span>
        <span className="top-strip-live">
          <span className="live-sq" />
          LIVE
        </span>
      </div>
 
      {/* ── HEADER ── */}
      <div className="header">
        <div className="header-left">
          <div className="header-eyebrow">tempo de missão</div>
          <div className="header-time">{time ?? 'N/A'}</div>
          <div className="header-sub">Jiripoca v4.1 · LoRa 915 MHz</div>
        </div>
        <div className="header-right">
          <span className="tag tag-purple">MSN-2026</span>
          <span className="tag tag-outline">SETOR ELETRÔNICA</span>
        </div>
      </div>
 
      {/* ── CORPO PRINCIPAL ── */}
      <div className="main-grid">
 
        {/* ── GRÁFICO ── */}
        <section className="card card-chart">
          <div className="chart-button-group">
            <button className={chartType === 'barras' ? 'btn-chart active' : 'btn-chart'} onClick={() => setChartType('barras')}>
              Barras
            </button>
            <button className={chartType === 'area' ? 'btn-chart active' : 'btn-chart'} onClick={() => setChartType('area')}>
              Área
            </button>
          </div>
          <div className="card-label">altitude / tempo</div>
          {chartType === 'barras' ? <GraficoBarras /> : <GraficoArea />}
        </section>
 
        {/* ── MODELO 3D ── */}
        <section className="card card-3d">
          <div className="card-label">orientação · IMU</div>
          <div className="canvas-wrap" ref={canvasRef}>
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.5} contactShadow={false}>
                <Grid 
                  position={[0, -1, 0]}  
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
                  <FogueteModelo />
              </Stage>
            </Suspense>
            <OrbitControls makeDefault domElement={canvasRef.current}/>
          </Canvas>
          </div>
        </section>

          {/* ── MAPA ── */}
        <section className="card card-mapa">
          <div className="card-label">rastreamento · GPS</div>
          <div className="mapa-wrap">
            <Mapa />
          </div>
        </section>
      </div>
 
      {/* ── RODAPÉ ── */}
      <div className="bot-strip">
        <span className="bs-item">STATUS <span className="bs-val">NOMINAL</span></span>
        <span className="bs-item">SUPERVISÓRIO <span className="bs-val">SUPERNOVA</span></span>
      </div>
 
    </div>
  );
}
