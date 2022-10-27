import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { AmbientLight } from "three";
import Scene from "../../resource/Icons";

const ShowcaseBox = () => {
  const [color2, setColor2] = useState("#ffffff");
  const [color1, setColor1] = useState("#ffffff");
  const [color3, setColor3] = useState("#ffffff");

  return (
    <div id="container">
      <div id="inner">
        <div className="ThreeCanvas child">
          <Canvas>
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
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
              objectPos={{x:0,y:2,z:0}}
              customColors={{
                color1: color1,
                color2: color2,
                color3: color3,
              }}
            />
            <Scene
              objectPos={{x:0,y:0,z:0}}
              customColors={{
                color1: color1,
                color2: color2,
                color3: color3,
              }}
            />
            <Scene
              objectPos={{x:0,y:-2,z:0}}
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
              <h1 className="firstWord"> Make Your Own 3D customizable Model
              </h1>
          </div>
          <div className="LabelColor">
              <h4> lets try make your own Color :
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
            <label for="color2">  Main Color</label>
          </div>
          <div className="LabelColor">
            <input
              type="color"
              id="color1"
              name="color1"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
            />
            <label for="color1">  Second Color</label>
          </div>
          <div className="LabelColor">
            <input
              type="color"
              id="color3"
              name="color3"
              value={color3}
              onChange={(e) => setColor3(e.target.value)}
            />
            <label for="color3">  Third Color</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseBox;
