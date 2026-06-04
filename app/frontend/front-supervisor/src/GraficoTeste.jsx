import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect, useContext } from 'react'
import { useTelemetria } from './Telemetria'
import { useShallow } from 'zustand/react/shallow'

export default function GraficoTeste() {
    const altitudeAtual = useTelemetria((state) => state.atual?.altitude || 0)
    const historicoAltitude = useTelemetria((state) => state.historicoAltitude, useShallow)
    return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={historicoAltitude}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="altitude" stroke="#38bdf8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}