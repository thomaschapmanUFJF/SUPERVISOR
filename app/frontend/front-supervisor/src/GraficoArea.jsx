import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useTelemetria } from './Telemetria';
import { useShallow } from 'zustand/react/shallow';

export default function GraficoArea() {
    const historicoAltitude = useTelemetria((state) => state.historicoAltitude, useShallow);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart width={1000} height={300} data={historicoAltitude}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="altitude" stroke="#bf00ff" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
        </ResponsiveContainer>
    )
}