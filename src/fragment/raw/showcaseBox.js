import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { AmbientLight } from "three";

function Scene() {
  const gltf = useLoader(GLTFLoader, "../../icons.gltf");
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
const ShowcaseBox = (...props) => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Scene />
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
      </Suspense>
    </Canvas>
  );
};

export default ShowcaseBox;
