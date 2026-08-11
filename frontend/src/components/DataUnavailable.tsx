import { useState, useEffect } from 'react';

export default function DataUnavailable() {
  const [index, setIndex] = useState(0);
  const texts = ["Aguardando dados.", "Aguardando dados..", "Aguardando dados..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 500);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="dados-indisponiveis">
      <div className="loading-dots">{texts[index]}</div>
    </div>
  );
}
