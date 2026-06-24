import { useEffect, useRef, useState } from 'react';
import { useTelemetria } from './Telemetria';

const websocket = new WebSocket('ws://localhost:8000/ws');
    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      useTelemetria.getState().adicionar(data);
      console.log('Received message:', data);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocket.onerror = (event) => {
      console.error('WebSocket error:', event);
        console.log('  - Code:', event.code);
        console.log('  - Reason:', event.reason);
        console.log('  - Was clean:', event.wasClean);
    };
