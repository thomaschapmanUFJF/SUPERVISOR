import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useRowStore } from '../stores/useRowStore';
import { useShallow } from 'zustand/react/shallow';
import DataUnavailable from './DataUnavailable';

export default function ChartPanel() {
  const hasData = useRowStore((state) => state.hasData);
  const altitudeHistory = useRowStore(useShallow((state) => state.altitudeHistory));

  if (!hasData) {
    return (
      <div className="grafico-tela-wrap">
        <div className="card-label">altitude / tempo</div>
        <DataUnavailable />
      </div>
    );
  }

  return (
    <div className="grafico-tela-wrap">
      <div className="card-label">altitude / tempo</div>
      <div className="grafico-content">
        <div className="area-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={altitudeHistory} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
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
              
              {/* Tooltip 100% nativo estilizado via Props do Recharts */}
              <Tooltip
                labelFormatter={(val) => `TEMPO: ${val}s`}
                formatter={(val) => [`${val.toFixed(1)}m`, 'ALTITUDE']}
                isAnimationActive={false}
                cursor={{ stroke: 'rgba(191, 0, 255, 0.4)', strokeWidth: 1, strokeDasharray: '4 4' }}
                
                // Estilo da Caixa Externa (Card Escuro)
                contentStyle={{
                  backgroundColor: 'rgba(15, 15, 22, 0.95)',
                  borderColor: '#bf00ff',
                  borderRadius: '6px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.8), 0 0 10px rgba(191, 0, 255, 0.2)',
                  fontFamily: 'monospace',
                  padding: '8px 12px'
                }}
                
                // Estilo do Título (Tempo)
                labelStyle={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  marginBottom: '2px',
                  textTransform: 'uppercase'
                }}
                
                // Estilo do Valor (Altitude)
                itemStyle={{
                  color: '#bf00ff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  padding: 0
                }}
              />

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