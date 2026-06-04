import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GraficoTeste from './GraficoTeste';
import FogueteModelo from './FogueteModelo';
import { useTelemetria } from './Telemetria';
import './WebSocket';


export default function App(){
  const time = useTelemetria((state) => state.atual?.time);
  return (
    <div>
      <h1>Supervisor</h1>
      <p>Time: {time || 'N/A'}</p>
      <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FogueteModelo />
      </Canvas>
      <GraficoTeste />
      </div>
    </div>
  )
}