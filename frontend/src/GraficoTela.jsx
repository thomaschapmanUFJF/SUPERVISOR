import { useState } from 'react'
import GraficoBarras from './GraficoBarras'
import GraficoArea from './GraficoArea'
import { useTelemetria } from './Telemetria'
import TelaDadosIndisponiveis from './TelaDadosIndisponiveis'

export default function GraficoTela(){
  const [chartType, setChartType] = useState('barras');
  const hasData = useTelemetria((state) => state.hasData);

  if (!hasData) {
    return (
      <div className="grafico-tela-wrap">
        <div className="card-label">altitude / tempo</div>
        <TelaDadosIndisponiveis />
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
        {chartType === 'barras' ? <GraficoBarras /> : <GraficoArea />}
      </div>
    </div>
  )
}
