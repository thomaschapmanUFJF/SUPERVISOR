import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

export default function FollowRocket({ posicao }) {
  const map = useMap();
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!posicao) return;
    const now = Date.now();
    if (lastUpdateRef.current === 0 || now - lastUpdateRef.current > 2000) {
      map.setView([posicao.latitude, posicao.longitude]);
      lastUpdateRef.current = now;
    }
  }, [posicao, map]);

  return null;
}
