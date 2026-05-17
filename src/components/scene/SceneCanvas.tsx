import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import VortexField from "./VortexField";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0, 9));
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = h <= 0 ? 0 : window.scrollY / h;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    const p = state.pointer;
    const s = scroll.current;

    // More "3D website" feel: pointer parallax + scroll depth
    target.current.set(p.x * 1.2, p.y * 0.8, 9.3 + s * 2.2);

    state.camera.position.lerp(target.current, 0.05);
    state.camera.lookAt(0, 0, -6.2);
  });

  return null;
}

export default function SceneCanvas() {
  return (
    <>
      <div className="sceneBackdrop" aria-hidden="true">
        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} camera={{ position: [0, 0, 9.3], fov: 45 }}>
          <Suspense fallback={null}>
            <CameraRig />

            <ambientLight intensity={0.35} />
            <directionalLight position={[7, 6, 6]} intensity={1.25} />
            <directionalLight position={[-6, -4, 3]} intensity={0.6} />

            <VortexField />

            <Sparkles count={75} scale={[26, 16, 24]} size={1.2} speed={0.32} color="#9BE1FF" />
            <Sparkles count={55} scale={[26, 16, 24]} size={1.0} speed={0.26} color="#86F7D3" />

            <Environment preset="city" />

            <EffectComposer>
              <Bloom intensity={0.95} luminanceThreshold={0.22} luminanceSmoothing={0.9} />
              <Noise opacity={0.05} />
              <Vignette eskil={false} offset={0.22} darkness={0.72} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      <div className="sceneFade" aria-hidden="true" />
    </>
  );
}
