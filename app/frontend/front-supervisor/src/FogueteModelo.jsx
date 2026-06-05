import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTelemetria } from './Telemetria';
import { useGLTF } from '@react-three/drei'; 


export default function FogueteModelo(){
  const foguete3D = useRef();
  const { scene } = useGLTF('/foguete.glb');
  useFrame(() => {
    if (!foguete3D.current) return
    const pacote = useTelemetria.getState().atual
    if (!pacote) return
    foguete3D.current.quaternion.set(
      pacote.q1,
      pacote.q2,
      pacote.q3,
      pacote.q4
    )
  })
  return (
    <group ref={foguete3D}>
      <primitive 
        object={scene} 
        scale={1}           
        position={[0, 0, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}