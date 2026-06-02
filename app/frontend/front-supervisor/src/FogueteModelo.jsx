import {useRef} from 'react'

export default function FogueteModelo(){
  const foguete3D = useRef();
  return (
    <mesh ref={foguete3D} position={[0, 0, 0]}>
      <coneGeometry args={[0.5, 2, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}