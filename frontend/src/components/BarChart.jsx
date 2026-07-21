import { useRowStore } from '../stores/useRowStore';
import { useShallow } from 'zustand/react/shallow';

export default function BarChart() {
  const altitudeAtual = useRowStore((state) => state.atual?.altitude || 0);
  const historicoAltitude = useRowStore((state) => state.historicoAltitude, useShallow);

  const maxAlt = Math.max(...historicoAltitude.map(p => p.altitude || 0), 1);
  const apogeuIdx = historicoAltitude.reduce(
    (iMax, p, i, arr) => (p.altitude > arr[iMax].altitude ? i : iMax),
    0
  );

  const altitudeAtualEmMetros = (altitudeAtual / 10).toFixed(1);

  return (
    <div className="grafico-wrap">
      <div className="grafico-kpi">
        <span className="grafico-kpi-val">{altitudeAtualEmMetros}</span>
        <span className="grafico-kpi-unit">m AGL</span>
      </div>

      <div className="chart-outer bevel-inset">
        <div className="bars">
          {historicoAltitude.length === 0 ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bar" style={{ height: '4px' }} />
            ))
          ) : (
            historicoAltitude.map((p, i) => {
              const h = Math.max((p.altitude / maxAlt) * 100, 2);
              const isPeak = i === apogeuIdx;
              const isHi = h > 40;
              return (
                <div
                  key={i}
                  className={`bar${isPeak ? ' peak' : isHi ? ' hi' : ''}`}
                  style={{ height: `${h}%` }}
                  title={`${p.time} · ${(p.altitude / 10).toFixed(1)} m`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
