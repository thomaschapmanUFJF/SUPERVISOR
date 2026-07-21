import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRowStore } from '../stores/useRowStore';
import { useGLTF, Center } from '@react-three/drei';

export default function RocketModel() {
  const foguete3D = useRef();
  const { scene } = useGLTF('/rocket.glb');

  useFrame(() => {
    const pacote = useRowStore.getState().atual;
    const foguete = foguete3D.current;

    if (!foguete || !pacote) return;
    const { qx, qy, qz, qw } = pacote;
    if (qx === 0 && qy === 0 && qz === 0 && qw === 0) return;

    foguete3D.current.quaternion.set(qx, qy, qz, qw);
  });

  return (
    <group ref={foguete3D}>
      <Center>
        <group rotation={[0, 0, -Math.PI / 2]}>
          <primitive
            object={scene}
            scale={1}
          />
        </group>
      </Center>
    </group>
  );
}
