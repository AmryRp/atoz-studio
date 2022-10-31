import React, { useRef, useState, Suspense } from "react";
import { gl, Canvas, useFrame, useLoader } from "@react-three/fiber";
import Scene from "../../resource/Icons";
import {

  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei/core";
import { AmbientLight } from "three";
const ShowcaseBox = () => {
  const [color2, setColor2] = useState("#293462");
  const [color1, setColor1] = useState("#D61C4E");
  const [color3, setColor3] = useState("#FEB139");

  function saveImage() {
    const canvas = document.getElementsByTagName("canvas")[0]
    const image = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    a.download = "image.png"
    a.click();
  }
  return (
    <div id="container">
      <div id="inner">
        <div className="ThreeCanvas child">
          <Canvas gl={{ preserveDrawingBuffer: true }}>
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
            />
            <PerspectiveCamera />
            <ambientLight />
            <spotLight
              intensity={0.9}
              angle={0.1}
              penumbra={1}
              position={[100, 150, 100]}
              castShadow
            />
            <Scene
              objectPos={{ x: 1, y: 1, z: 0 }}
              customColors={{
                color1: color1,
                color2: color2,
                color3: color3,
              }}
            />
          </Canvas>
        </div>
        <div className="colors child">
          <div>
            <h1 className="firstWord"> Make Your Own 3D custom Model
            </h1>
          </div>
          <div className="LabelColor">
            <h4 className="description-title"> lets try make your own Color :
            </h4>
          </div>
          <div className="LabelColor">
            <input
              type="color"
              id="color2"
              name="color2"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
            />
            <input
              type="color"
              id="color1"
              name="color1"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
            />
            <input
              type="color"
              id="color3"
              name="color3"
              value={color3}
              onChange={(e) => setColor3(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button id="save-button" onClick={() => saveImage()}> save image</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseBox;
