import { Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Item = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  spin: number;
};

export default function VortexField() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const items: Item[] = useMemo(() => {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const colors = ["#9BE1FF", "#86F7D3", "#FFFFFF"];

    // FEWER cubes, better composition (premium)
    return Array.from({ length: 12 }).map((_, i) => ({
      position: [rnd(-10, 10), rnd(-6, 6), rnd(-15, -3)],
      rotation: [rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)],
      scale: rnd(0.4, 0.9),
      color: colors[i % colors.length]!,
      spin: rnd(0.9, 1.8)
    }));
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // faster but smooth global motion
    group.current.rotation.y = t * 0.08;
    group.current.rotation.x = Math.sin(t * 0.28) * 0.07;

    // cursor parallax (premium depth)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 1.4, 0.08);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, pointer.y * 1.0, 0.08);

   
  });

  return (
    <group ref={group} position={[0, 0, -7.2]}>
      {items.map((it, i) => (
        <Float key={i} speed={1.4} rotationIntensity={0.25} floatIntensity={0.35} position={it.position}>
          <mesh rotation={it.rotation} scale={it.scale}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial
  color={it.color}
  roughness={0.3}
  metalness={0.2}
  opacity={0.4}
  transparent
/>
          </mesh>
        </Float>
      ))}
    </group>
  );
}
