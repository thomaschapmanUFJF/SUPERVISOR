import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import { useRowStore } from '../stores/useRowStore';
import { isEqualQuaternion } from '../utils/deadband';
import DataUnavailable from './DataUnavailable';
import * as THREE from 'three';

interface RocketOrientation {
  x?: number;
  y?: number;
  z?: number;
  w?: number;
  qx?: number;
  qy?: number;
  qz?: number;
  qw?: number;
}

function RocketMesh() {
  const rocketRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF('/rocket.glb');
  const lastQuaternion = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const targetQuaternion = useRef<THREE.Quaternion>(new THREE.Quaternion());

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.side = THREE.DoubleSide;
          });
        } else if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    const orientation = useRowStore.getState().rocketOrientation as RocketOrientation | undefined;
    const rocket = rocketRef.current;

    if (!rocket || !orientation) return;

    const qx = orientation.x ?? orientation.qx ?? 0;
    const qy = orientation.y ?? orientation.qy ?? 0;
    const qz = orientation.z ?? orientation.qz ?? 0;
    const qw = orientation.w ?? orientation.qw ?? 0;

    if (qw === 0 && qx === 0 && qy === 0 && qz === 0) return;

    if (isEqualQuaternion(lastQuaternion.current, qx, qy, qz, qw)) return;

    targetQuaternion.current.set(qx, qy, qz, qw);
    rocket.quaternion.slerp(targetQuaternion.current, 0.5);
    lastQuaternion.current.set(qx, qy, qz, qw);
  });

  return (
    <group ref={rocketRef}>
      <Center>
        <group rotation={[0, 0, -Math.PI / 2]}>
          <primitive object={scene} scale={1} />
        </group>
      </Center>
    </group>
  );
}

export default function RocketModel() {
  const hasData = useRowStore((state) => state.hasData);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="card card-3d">
      <div className="card-label">orientação · IMU</div>
      <div className="canvas-wrap" ref={canvasRef} style={{ flex: 1, minHeight: 0 }}>
        {!hasData ? (
          <DataUnavailable />
        ) : (
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ height: '100%', width: '100%' }}>
            <Suspense fallback={null}>
              <Environment preset="city" />
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
              <directionalLight position={[-5, 5, -5]} intensity={0.4} />
              <RocketMesh />
              <axesHelper args={[2]} />
            </Suspense>
          </Canvas>
        )}
      </div>
    </section>
  );
}

useGLTF.preload('/rocket.glb');