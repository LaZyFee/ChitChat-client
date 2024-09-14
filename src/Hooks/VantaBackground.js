import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import RINGS from 'vanta/dist/vanta.rings.min.js';
import CLOUDS2 from 'vanta/dist/vanta.clouds2.min.js';
import FOG from 'vanta/dist/vanta.fog.min.js';
import WAVES from 'vanta/dist/vanta.waves.min.js';
import NET from 'vanta/dist/vanta.net.min.js';
import BIRDS from 'vanta/dist/vanta.birds.min.js';
import HALO from 'vanta/dist/vanta.halo.min.js';

const VANTA_EFFECTS = {
  RINGS,
  CLOUDS2,
  FOG,
  WAVES,
  NET,
  BIRDS,
  HALO,
};

const VantaBackground = ({ effect }) => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;

    const initEffect = () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }

      const effectFunction = VANTA_EFFECTS[effect];
      if (!effectFunction) return;

      try {
        vantaEffect = effectFunction({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          texturePath: './gallery/noise.png', // Adjust texture path if needed
          THREE,
          backgroundColor: 0x00000000, // Transparent background
        });
      } catch (error) {
        console.error('Vanta.js initialization error:', error);
      }
    };

    initEffect();

    const handleResize = () => {
      if (vantaEffect) {
        vantaEffect.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (vantaEffect) vantaEffect.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]); // Only depend on 'effect' for re-initializing

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Ensure the gradient stays behind the Vanta effect
      }}
    >
      <div
        ref={vantaRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1, // Vanta effect in front of the gradient
          overflow: 'hidden', // Ensure no overflow
        }}
      />
    </div>
  );
};

export default VantaBackground;
