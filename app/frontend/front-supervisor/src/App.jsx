import { useState, useEffect } from 'react';
import FogueteTela from './FogueteTela';

export default function App(){
  const [conectado, setConectado] = useState(false);
  
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');

    websocket.onopen = () => {
      setConectado(true);
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    websocket.onclose = () => {
      setConectado(false);
      console.log('WebSocket connection closed');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
        console.log('  - Code:', event.code);
        console.log('  - Reason:', event.reason);
        console.log('  - Was clean:', event.wasClean);
    };

    return () => {
      websocket.close();
    };
  },[])
  return (
    <div>
      <h1>Supervisor</h1>
       <p>WebSocket connection status: {conectado ? 'Connected' : 'Disconnected'}</p>
       <h1>Canvas</h1>
      <FogueteTela />
    </div>
  )
}