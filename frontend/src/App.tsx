import { useCallback, useState} from 'react';
import MainScreen from './MainScreen';
import TestScreen from './TestScreen';

type ScreenType = 'MAIN' | 'TEST';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('MAIN');
  const [counter, setCounter] = useState<number>(0);
  const handleToggleScreen = () => {
    if (screen === 'MAIN') {
      setCounter((value) => value + 1);
      setScreen('TEST');
      return;
    }
    setScreen('MAIN');
  };
  const handleClick = useCallback(() => {
    setCounter(counter+1);
  },[])
  return (
    <div className="app-shell">
      <header className="screen-toolbar">
        <h1 className="screen-title">SUPERVISOR</h1>
        <button className="screen-toggle" onClick={handleToggleScreen}>
          {screen === 'MAIN' ? 'IR PARA TESTE' : 'VOLTAR AO MAIN'}
        </button>
      </header>

      {screen === 'MAIN' ? <MainScreen /> : <TestScreen vezes={counter} clickHandler={handleClick}/>}
    </div>
  );
}