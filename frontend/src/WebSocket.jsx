import { useRef, useState } from 'react';
import { useTelemetria } from './Telemetria';
import { useErrorState } from './ErrorState';

const websocket = new WebSocket('ws://localhost:8000/ws');
    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      useTelemetria.getState().adicionar(data);
      console.log('Received message:', data);
    };

    websocket.onclose = (event) => {
      console.log('WebSocket connection closed');
      useErrorState.getState().setError({
        message: `Conexão WebSocket encerrada (code: ${event.code})`
      });
    };

    websocket.onerror = (event) => {
      console.error('WebSocket error:', event);
      useErrorState.getState().setError({
        message: 'Erro na conexão WebSocket'
      });
    };
