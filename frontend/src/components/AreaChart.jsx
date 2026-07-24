import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useRowStore } from '../stores/useRowStore';
import { useShallow } from 'zustand/react/shallow';
import DataUnavailable from './DataUnavailable';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="ct-label">Tempo: {label}s</p>
        <p className="ct-val">
          {payload[0].value.toFixed(1)}
          <span>m</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ChartPanel() {
  const hasData = useRowStore((state) => state.hasData);
  const historicoAltitude = useRowStore((state) => state.historicoAltitude, useShallow);
  if (!hasData) {
    return (
      <div className="grafico-tela-wrap">
        <div className="card-label">altitude / tempo</div>
        <DataUnavailable />
      </div>
    );
  }

  const historicoEmMetros = historicoAltitude.map(p => ({
    time: p.time,
    altitude: p.altitude / 10
  }));

  return (
    <div className="grafico-tela-wrap">
      <div className="card-label">altitude / tempo</div>
      <div className="grafico-content">
        <div className="area-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicoEmMetros} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bf00ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#bf00ff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                stroke="#444"
                tick={{ fill: '#888', opacity: 0.4, fontSize: 10 }}
                tickLine={{ stroke: '#333', opacity: 0.4 }}
                interval={8}
                tickFormatter={(val) => `${val}s`}
                isAnimationActive={false}
              />
              <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} isAnimationActive={false} />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Area
                type="monotone"
                dataKey="altitude"
                stroke="#bf00ff"
                fill="url(#colorAltitude)"
                fillOpacity={1}
                isAnimationActive={false}
                animationDuration={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}