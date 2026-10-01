import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export async function createViewer(container, url, callbacks = {}) {
 let dead=false,visible=true,rotating=false,frame=0,model,observer,resize;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.25;
 renderer.domElement.setAttribute('aria-label','Interactive 3D model. Use the buttons below to rotate and zoom, or drag the model.');
 renderer.domElement.setAttribute('role','img');
 container.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,1,.01,100);
 const controls=new OrbitControls(camera,renderer.domElement);
 renderer.domElement.style.touchAction='pan-y';
 controls.enablePan=false;controls.enableDamping=false;controls.rotateSpeed=.65;
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
 const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x7c8c6a,2));
 const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,5,4);scene.add(key);
 const draco=new DRACOLoader().setDecoderPath('/decoders/draco/');
 const ktx=new KTX2Loader().setTranscoderPath('/decoders/basis/').detectSupport(renderer);
 const loader=new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx).setMeshoptDecoder(MeshoptDecoder);
 let materials=[],originals=[];
 function render(){if(!dead && visible && !document.hidden)renderer.render(scene,camera)}
 function animate(){frame=0;if(dead||!rotating||!visible||document.hidden)return;controls.autoRotate=true;controls.update();render();frame=requestAnimationFrame(animate)}
 function restart(){cancelAnimationFrame(frame);frame=0;controls.autoRotate=false;if(rotating&&visible&&!document.hidden)animate();else render()}
 controls.addEventListener('change',render);
 const contextLost=e=>{e.preventDefault();callbacks.onError?.('The 3D display was interrupted. Close the preview and reopen it.');};
 renderer.domElement.addEventListener('webglcontextlost',contextLost);
 function dispose(){dead=true;cancelAnimationFrame(frame);observer?.disconnect();resize?.disconnect();document.removeEventListener('visibilitychange',restart);controls.dispose();draco.dispose();ktx.dispose();const textures=new Set(),geometries=new Set(),mats=new Set();model?.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [].concat(o.material)){mats.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v)}});textures.forEach(t=>{t.source?.data?.close?.();t.dispose()});geometries.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());env.dispose();renderer.dispose();renderer.domElement.remove();}
 try {
   const gltf=await loader.loadAsync(url, e=>callbacks.onProgress?.(e.total?Math.round(e.loaded/e.total*100):null));
   model=gltf.scene;
   const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
   if(box.isEmpty()||!Number.isFinite(size.length()))throw new Error('This model has no visible geometry.');
   const scale=2/Math.max(size.x,size.y,size.z);model.position.sub(center);const group=new THREE.Group();group.add(model);group.scale.setScalar(scale);scene.add(group);
   let triangles=0,draws=0;model.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?.count||o.geometry.attributes.position?.count||0)/3*(o.count||1);draws+=Math.max(1,o.geometry.groups.length);for(const m of [].concat(o.material)){if(!materials.includes(m)){materials.push(m);originals.push(m.color?.clone())}}}});
   camera.position.set(0,.35,4.5);controls.target.set(0,0,0);controls.minDistance=1.5;controls.maxDistance=8;controls.update();controls.saveState();
   function resizeView(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);render()}
   resize=new ResizeObserver(resizeView);resize.observe(container);resizeView();
   observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;restart()},{threshold:.01});observer.observe(container);
   document.addEventListener('visibilitychange',restart);
   callbacks.onStats?.({triangles:Math.round(triangles),materials:materials.length,draws});render();
   return {dispose,reset(){controls.reset();materials.forEach((m,i)=>{if(originals[i])m.color.copy(originals[i])});render()},rotate(value){rotating=value;restart()},step(direction){const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),direction*.25);camera.position.copy(controls.target).add(offset);controls.update();render()},zoom(factor){const offset=camera.position.clone().sub(controls.target);offset.multiplyScalar(factor).clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(offset);controls.update();render()},color(index,value){if(materials[index]?.color){materials[index].color.set(value);render()}},snapshot(){renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png')}};
 }catch(error){dispose();throw error;}
}
