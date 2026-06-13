import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function SeguirFoguete({ posicao }) {
  const map = useMap();

  if (!posicao) return null;
  useEffect(() => {
    if (posicao) {
      map.setView([posicao.latitude, posicao.longitude]);
    }
  }, [posicao]);

  return null;
}
