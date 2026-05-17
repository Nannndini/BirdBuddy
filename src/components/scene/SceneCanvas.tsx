import React from 'react';

export default function SceneCanvas() {
  const cubes = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const size = 60 + Math.random() * 60; // 60-120px
      const duration = 8 + Math.random() * 12; // 8s to 20s
      const delay = Math.random() * 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;

      return {
        id: i,
        size,
        duration,
        delay,
        left,
        top
      };
    });
  }, []);

  return (
    <>
      <div 
        className="sceneBackdrop" 
        aria-hidden="true" 
        style={{ 
          background: '#0a0a0a', 
          position: 'fixed', 
          inset: 0, 
          zIndex: -1, 
          overflow: 'hidden' 
        }}
      >
        {cubes.map((cube) => (
          <div
            key={cube.id}
            style={{
              position: 'absolute',
              left: `${cube.left}%`,
              top: `${cube.top}%`,
              width: `${cube.size}px`,
              height: `${cube.size}px`,
              border: '1px solid rgba(155,225,255,0.15)',
              background: 'rgba(134,247,211,0.03)',
              borderRadius: '8px',
              animation: `floatCube ${cube.duration}s infinite linear`,
              animationDelay: `-${cube.delay}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes floatCube {
            0% { transform: translateY(0) rotate3d(1, 1, 1, 0deg); }
            50% { transform: translateY(-30px) rotate3d(1, 1, 1, 180deg); }
            100% { transform: translateY(0) rotate3d(1, 1, 1, 360deg); }
          }
        `}</style>
      </div>
      <div className="sceneFade" aria-hidden="true" />
    </>
  );
}
