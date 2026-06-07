import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import { useTelemetria } from './Telemetria';
import { useShallow } from 'zustand/react/shallow';
import SeguirFoguete from './SeguirFoguete';
import 'leaflet/dist/leaflet.css'

export default function Mapa() {
  const posicaoAtual = useTelemetria((state) => state.posicaoAtual);
  const historicoPosicao = useTelemetria((state) => state.historicoPosicao, useShallow);
  return (
    posicaoAtual ? (
      <MapContainer center={[-21.76, -43.38]} zoom={15} style={{ width: '100%', height: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[posicaoAtual.latitude, posicaoAtual.longitude]} />
        <Polyline positions={historicoPosicao.map(p => [p.latitude, p.longitude])} color="#f97316" />
        <SeguirFoguete posicao={posicaoAtual} />
      </MapContainer>
    ) : null
  )
}