import React, { useState } from "react";
import "./aboutUs.css"
import {
  Sphere, OrbitControls
} from "@react-three/drei/core";
import { Canvas } from "@react-three/fiber";
import Scene from './Scene'
import { a } from '@react-spring/web'
import { useSpring } from '@react-spring/core'

const AboutUs = () => {
  const [users, setUser] = useState({
    AboutUs: "About Us",
    Description: "We are 3d graphic design services that serve various kinds of orders.",
  });
  const [{ background, fill }, set] = useSpring({ background: '#f0f0f0', fill: '#202020' }, [])
  
  return (
    <>
      <div className="about-us">
        <div className="inner-about-us">
          <a.main style={{ background }}>
            <Canvas className="bubble-about" dpr={[1, 2]}>
              <Scene />
              <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
            </Canvas>
          </a.main>
          <div>
            <span className="paragraph-about-us">
              <h1 className="about-us-title">{users.AboutUs}</h1>
              <h3 className="about-us-description">{users.Description}</h3>
            </span>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
