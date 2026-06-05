import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useTelemetria } from './Telemetria';
import { useShallow } from 'zustand/react/shallow';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      <div className="ct-val">{payload[0].value} <span>m</span></div>
    </div>
  );
};

export default function GraficoTeste() {
  const altitudeAtual = useTelemetria((state) => state.atual?.altitude || 0);
  const historicoAltitude = useTelemetria((state) => state.historicoAltitude, useShallow);

  return (
    <div className="grafico-wrap">
      <div className="grafico-kpi">
        <span className="grafico-kpi-val">{altitudeAtual}</span>
        <span className="grafico-kpi-unit">m AGL</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={historicoAltitude} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e1e1e"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: '#444', fontSize: 10, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}
            axisLine={{ stroke: '#1e1e1e' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#444', fontSize: 10, fontFamily: "'Space Mono', monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="altitude"
            stroke="#bf00ff"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#bf00ff', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}