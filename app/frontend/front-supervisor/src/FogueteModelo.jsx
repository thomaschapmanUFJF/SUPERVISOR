import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTelemetria } from './Telemetria';

export default function FogueteModelo(){
  const foguete3D = useRef();
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
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.4, 1.0, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}