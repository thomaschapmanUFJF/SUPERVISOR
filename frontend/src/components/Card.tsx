import React from 'react';

export type CardProps = {
  label?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  flex?: number | string;
};

export default function Card({
  label,
  children,
  className = '',
  style,
  flex,
}: CardProps) {
  const combinedStyle: React.CSSProperties = {
    ...(flex != null ? { flex } : {}),
    ...style,
  };

  return (
    <div className={`card ${className}`.trim()} style={combinedStyle}>
      {label && <div className="card-label">{label}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}