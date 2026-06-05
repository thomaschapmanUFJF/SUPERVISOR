import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GraficoTeste from './GraficoTeste';
import FogueteModelo from './FogueteModelo';
import { useTelemetria } from './Telemetria';
import './WebSocket';


export default function App(){
  const time = useTelemetria((state) => state.atual?.time);
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
          <div className="card-label">altitude / tempo</div>
          <GraficoTeste />
        </section>
 
        {/* ── MODELO 3D ── */}
        <section className="card card-3d">
          <div className="card-label">orientação · IMU</div>
          <div className="canvas-wrap">
            <Canvas camera={{ position: [5, 5, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <FogueteModelo />
            </Canvas>
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
