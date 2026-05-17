import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

const FloatingLeaves = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 50 : 200;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const leaves = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 20,
        speed: 0.5 + Math.random() * 1.5,
        seed: Math.random() * Math.PI * 2,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    leaves.forEach((leaf, i) => {
      leaf.y -= leaf.speed * 0.02;
      if (leaf.y < -10) leaf.y = 10;
      
      const x = leaf.x + Math.sin(time + leaf.seed) * 0.5;
      
      dummy.position.set(x, leaf.y, leaf.z);
      dummy.rotation.set(
        leaf.rx + time * 0.2,
        leaf.ry + time * 0.3,
        leaf.rz + time * 0.1
      );
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.15, 0.2]} />
      {/* green/gold materials mix using base color */}
      <meshStandardMaterial color="#4ade80" side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

const FireflyField = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 150 : 500;
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, offsets, speeds] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const o = new Float32Array(count);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
      o[i] = Math.random() * Math.PI * 2;
      s[i] = 1 + Math.random() * 2;
    }
    return [p, o, s];
  }, [count]);

  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.color.array as Float32Array;
    
    const baseColor = new THREE.Color('#4ade80');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(time * 0.2 + offsets[i]) * 0.01;
      pos[i * 3 + 1] += Math.cos(time * 0.2 + offsets[i]) * 0.01;
      pos[i * 3 + 2] += Math.sin(time * 0.3 + offsets[i]) * 0.01;
      
      const pulse = (Math.sin(time * speeds[i] + offsets[i]) + 1) / 2;
      const intensity = 0.2 + pulse * 0.8; 
      
      col[i * 3] = baseColor.r * intensity;
      col[i * 3 + 1] = baseColor.g * intensity;
      col[i * 3 + 2] = baseColor.b * intensity;
    }
    
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} depthWrite={false} sizeAttenuation />
    </points>
  );
};

const ForestRings = () => {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (r1.current) {
      r1.current.rotation.x = time * 0.1;
      r1.current.rotation.y = time * 0.15;
    }
    if (r2.current) {
      r2.current.rotation.y = time * 0.12;
      r2.current.rotation.z = time * 0.1;
    }
    if (r3.current) {
      r3.current.rotation.x = time * -0.1;
      r3.current.rotation.z = time * -0.08;
    }
  });

  return (
    <group>
      <mesh ref={r1}>
        <torusGeometry args={[4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.08} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[6, 0.02, 16, 100]} />
        <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.08} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
};

const CentralOrb = () => {
  const orb = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orb.current) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time) * 0.05;
      orb.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={orb}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial emissive="#4ade80" emissiveIntensity={1} roughness={0.1} color="#000000" />
      <pointLight color="#4ade80" intensity={3} distance={8} />
    </mesh>
  );
};

const ForestScene = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <ErrorBoundary fallback={<div style={{ background: 'var(--col-deep)', width: '100%', height: '100%' }} />}>
        <Canvas camera={{ position: [0, 0, 8] }} gl={{ alpha: true }}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          <ambientLight intensity={0.05} />
          <pointLight position={[5, 5, 5]} color="#fbbf24" intensity={2} />
          <pointLight position={[-5, -3, 2]} color="#2dd4bf" intensity={1.5} />

          <FloatingLeaves />
          <FireflyField />
          <ForestRings />
          <CentralOrb />

          <EffectComposer>
            <Bloom luminanceThreshold={0.3} mipmapBlur intensity={1.2} />
          </EffectComposer>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

// Export as default (Note: for Next.js, this would be wrapped in dynamic with ssr: false. 
// For Vite, standard export works since there's no SSR by default)
export default ForestScene;
