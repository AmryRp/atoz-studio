import React, { useRef, useState, Suspense } from "react";
import { gl, Canvas, useFrame, useLoader } from "@react-three/fiber";
import Scene from "../../../resource/Icons";
import {
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei/core";
import './showcaseBox.css'

const ShowcaseBox = () => {
  const [color2, setColor2] = useState("#4CB1B8");
  const [color1, setColor1] = useState("#4CB1B8");
  const [color3, setColor3] = useState("#4CB1B8");

  function saveImage() {
    const canvas = document.getElementsByTagName("canvas")[0]
    const image = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    a.download = "image.png"
    a.click();
  }
  return (
      <div className="inner">
        <div className="inner-left">
          <div className="object-three">
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
                objectPos={{ x: 0, y: 0, z: 0 }}
                customColors={{
                  color1: color1,
                  color2: color2,
                  color3: color3,
                }}
              />
            </Canvas>
          </div>
            <div className="color-chooser">
              <div>
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
              <button className="button-save">
              Save Image
            </button>
            </div>
            
        </div>
        <div className="inner-right">
          <h1 className="main-title">ORDER YOUR OWN 3D NOW !!!</h1>
          <p className="main-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>
        </div>
      </div>
  );
};

export default ShowcaseBox;
