import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRowStore } from '../stores/useRowStore';
import { useGLTF, Center } from '@react-three/drei';
import { isEqualQuaternion } from '../utils/deadband';
import * as THREE from 'three';

export default function RocketModel() {
  const foguete3D = useRef();
  const { scene } = useGLTF('/rocket.glb');
  const lastQ = useRef(new THREE.Quaternion());

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.side = THREE.DoubleSide;
      }
    });
  }, [scene]);

  useFrame(() => {
    const pacote = useRowStore.getState().orientacaoFoguete;
    const foguete = foguete3D.current;

    if (!foguete || !pacote) return;

    const qx = pacote.x ?? pacote.qx;
    const qy = pacote.y ?? pacote.qy;
    const qz = pacote.z ?? pacote.qz;
    const qw = pacote.w ?? pacote.qw;

    if (qw === 0 && qx === 0 && qy === 0 && qz === 0) return;

    if (isEqualQuaternion(lastQ.current, qx, qy, qz, qw)) return;

    foguete.quaternion.set(qx, qy, qz, qw);
    lastQ.current.set(qx, qy, qz, qw);
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

useGLTF.preload('/rocket.glb');