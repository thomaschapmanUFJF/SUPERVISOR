import { useState } from 'react';
import BarChart from './BarChart';
import AreaChart from './AreaChart';
import { useRowStore } from '../stores/useRowStore';
import DataUnavailable from './DataUnavailable';

export default function ChartPanel() {
  const [chartType, setChartType] = useState('barras');
  const hasData = useRowStore((state) => state.hasData);

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
      <div className="chart-button-group">
        <button className={chartType === 'barras' ? 'btn-chart active' : 'btn-chart'} onClick={() => setChartType('barras')}>
          Barras
        </button>
        <button className={chartType === 'area' ? 'btn-chart active' : 'btn-chart'} onClick={() => setChartType('area')}>
          Área
        </button>
      </div>
      <div className="card-label" style={{ marginTop: '8px' }}>altitude / tempo</div>
      <div className="grafico-content">
        {chartType === 'barras' ? <BarChart /> : <AreaChart />}
      </div>
    </div>
  );
}
