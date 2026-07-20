import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import { useTelemetria } from './Telemetria';
import { useShallow } from 'zustand/react/shallow';
import SeguirFoguete from './SeguirFoguete';
import TelaDadosIndisponiveis from './TelaDadosIndisponiveis';
import 'leaflet/dist/leaflet.css'

export default function Mapa() {
  const posicaoAtual = useTelemetria((state) => state.posicaoAtual);
  const historicoMapaPosicao = useTelemetria((state) => state.historicoMapaPosicao, useShallow);

  // Show TelaDadosIndisponiveis until we get non-zero GPS coordinates
  const hasValidGPS = posicaoAtual !== null &&
                     (posicaoAtual.latitude !== 0 || posicaoAtual.longitude !== 0);

  if (!hasValidGPS) {
    return <TelaDadosIndisponiveis />;
  }

  return (
    <MapContainer
      center={[posicaoAtual.latitude, posicaoAtual.longitude]}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {historicoMapaPosicao.length > 1 && (
        <Polyline
          positions={historicoMapaPosicao.filter(p => p.latitude !== 0 || p.longitude !== 0).map(p => [p.latitude, p.longitude])}
          color="#bf00ff"
          weight={3}
        />
      )}
      <Marker position={[posicaoAtual.latitude, posicaoAtual.longitude]} />
      <SeguirFoguete posicao={posicaoAtual} />
    </MapContainer>
  )
}
