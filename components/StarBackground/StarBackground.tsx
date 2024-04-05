import React from 'react';
import Particles from 'react-tsparticles';
import particlesConfig from "./particles.config.js";
import { loadFull } from "tsparticles";

const StarBackground: React.FC = () => {
    async function loadParticles(main: any){
        await loadFull(main)
    }
  return (
    <Particles
      id="star-background"
      init={loadParticles}
      options={particlesConfig}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
};

export default StarBackground;
