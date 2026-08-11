import { useRowStore } from './stores/useRowStore';
import AreaChart from './components/AreaChart';
import RocketModel from './components/RocketModel';
import DebugPanel from './components/DebugPanel';
import FlightMap from './components/FlightMap';
import Placeholder from './components/Placeholder';
import useErrorSSE from './hooks/useErrorSSE';
import useRowSSE from './hooks/useRowSSE';
import useErrorToast from './hooks/useErrorToast';

function HeaderTime() {
  const time = useRowStore((state) => state.current?.time);
  const formattedTime = time != null && !isNaN(Number(time)) ? Math.round(Number(time)) : (time ?? 'N/A');
  return <span>{formattedTime}</span>;
}

export default function MainScreen() {
  const isLive = useRowStore((state) => state.isLive);

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
          <FlightMap />
          <RocketModel />
        </div>

        <div className="bottom-row">
          <AreaChart flex={2} />
          <Placeholder />
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
