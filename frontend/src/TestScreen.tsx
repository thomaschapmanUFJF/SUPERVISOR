import { useMemo } from 'react';
import "./styles/test.css";

interface TestScreenProps {
  vezes: number;
  clickHandler: () => void
}

export default function TestScreen({ vezes , clickHandler}: TestScreenProps) {
  const matematicaPesada = useMemo(() => Math.random() + Math.random(), [vezes]);

  return (
      <div className="test-screen">
        <div className="test-card">
          <h1 className="test-title">プレイグラウンド</h1>
          <p className="test-subtitle">セッション値</p>
          <div className="test-value">{matematicaPesada.toFixed(4)}</div>
          <button className="btn-primary" onClick={clickHandler}>カウンタ {vezes}</button>
        </div>
      </div>
  );
}