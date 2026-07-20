import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useTelemetria } from './Telemetria';
import { useShallow } from 'zustand/react/shallow';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="ct-label">Tempo: {label}</p>
        <p className="ct-val">
          {payload[0].value.toFixed(1)}
          <span>m</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function GraficoArea() {
  const historicoAltitude = useTelemetria((state) => state.historicoAltitude, useShallow);

  const historicoEmMetros = historicoAltitude.map(p => ({
    time: p.time,
    altitude: p.altitude / 10
  }));

  return (
    <div style={{ width: '100%', height: '100%', flex: 1, minHeight: '180px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={historicoEmMetros} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bf00ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#bf00ff" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#222" strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="altitude"
            stroke="#bf00ff"
            fill="url(#colorAltitude)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}