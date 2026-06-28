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
    if (pacote.qx === 0 && pacote.qy === 0 && pacote.qz === 0 && pacote.qw === 0) return

    foguete3D.current.quaternion.set(
      pacote.qw,
      pacote.qx, 
      pacote.qy, 
      pacote.qz 
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