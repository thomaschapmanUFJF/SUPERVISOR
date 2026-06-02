import { Canvas } from '@react-three/fiber'

import FogueteModelo from './FogueteModelo';
export default function FogueteTela(){
  return (
    <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <FogueteModelo />
    </Canvas>
  )
}