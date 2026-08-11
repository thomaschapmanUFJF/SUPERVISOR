import React from 'react';

type MetricCardProps = {
    label: string,
    value: React.ReactNode,
    threshold?: string
};

export default function MetricCard({
    label,
    value,
    threshold = 'metric-nominal'
}: MetricCardProps) {
    return (
        <div className={`metric-card ${threshold}`}>
            <span className="debug-key">{label}</span>
            <div className="debug-value">{value}</div>
        </div>
    )
}