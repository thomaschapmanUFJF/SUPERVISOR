import { useRowStore } from '../stores/useRowStore';
import { useShallow } from 'zustand/react/shallow';
import FollowRocket from './FollowRocket';
import DataUnavailable from './DataUnavailable';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';

export default function FlightMap() {
  const posicaoAtual = useRowStore((state) => state.posicaoAtual);
  const historicoMapaPosicao = useRowStore(
    useShallow((state) => state.historicoMapaPosicao)
  );
  const hasValidGPS = posicaoAtual !== null &&
    (posicaoAtual.latitude !== 0 || posicaoAtual.longitude !== 0);

  if (!hasValidGPS) {
    return <DataUnavailable />;
  }

  return (
    <MapContainer
      center={[posicaoAtual.latitude, posicaoAtual.longitude]}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {historicoMapaPosicao.length > 1 && (
        <Polyline
          positions={historicoMapaPosicao.filter(p => p.latitude !== 0 || p.longitude !== 0).map(p => [p.latitude, p.longitude])}
          color="#bf00ff"
          weight={3}
        />
      )}
      <Marker position={[posicaoAtual.latitude, posicaoAtual.longitude]} />
      <FollowRocket posicao={posicaoAtual} />
    </MapContainer>
  );
}
