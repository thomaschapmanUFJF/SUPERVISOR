import { useState } from 'react'
import GraficoBarras from './GraficoBarras'
import GraficoArea from './GraficoArea'

export const GraficoOption = () => {option('GRAFICO', () => {<GraficoTela/>})}

export default function GraficoTela(){
  const [chartType, setChartType] = useState('barras');
    return (
        <section className="card card-chart">
            <div className="chart-button-group">
            <button className={chartType === 'barras' ? 'btn-chart active' : 'btn-chart'} onClick={() => setChartType('barras')}>
                Barras
            </button>
            <button className={chartType === 'area' ? 'btn-chart active' : 'btn-chart'} onClick={() => setChartType('area')}>
                Área
            </button>
            </div>
            <div className="card-label">altitude / tempo</div>
            {chartType === 'barras' ? <GraficoBarras /> : <GraficoArea />}
        </section>
    )
}