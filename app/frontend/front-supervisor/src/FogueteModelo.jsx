import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTelemetria } from './Telemetria';
import { useGLTF, Center } from '@react-three/drei'; 

export default function FogueteModelo(){
  const foguete3D = useRef();
  const { scene } = useGLTF('/rocket.glb');

  useFrame(() => {
    if (!foguete3D.current) return
    const pacote = useTelemetria.getState().atual
    if (!pacote) return
    
    if (pacote.q1 === 0 && pacote.q2 === 0 && pacote.q3 === 0 && pacote.q4 === 0) return

    foguete3D.current.quaternion.set(
      pacote.q1,
      pacote.q2,
      pacote.q3,
      pacote.q4 
    )
  })

  return (
    <group ref={foguete3D}>
      <Center> 
        <primitive 
          object={scene} 
          scale={1} 
        />
      </Center>
    </group>
  );
}