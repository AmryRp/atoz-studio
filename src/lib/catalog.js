export const MAX_MODEL_BYTES = 15 * 1024 * 1024;
export const MAX_POSTER_BYTES = 2 * 1024 * 1024;
export function safeAsset(value, extensions) {
 if(typeof value!=='string'||value.length>2048)return false;
 if(value==='')return true;
 try{const url=new URL(value,'https://local.invalid');if(url.protocol!=='https:'||url.username||url.password)return false;if(!value.startsWith('https://') && (!value.startsWith('/')||value.startsWith('//')||value.includes('\\')||value.includes('..')))return false;return extensions.some(ext=>url.pathname.toLowerCase().endsWith(ext));}catch{return false}
}
export function validateCatalog(input){
 if(!input || !Array.isArray(input.projects) || input.projects.length<1 || input.projects.length>24)throw Error('Keep between 1 and 24 projects.');
 if(typeof input.contact!=='string'||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact)||input.contact.length>160)throw Error('Enter a valid contact email.');
 if(input.whatsapp && !/^[1-9][0-9]{7,14}$/.test(input.whatsapp))throw Error('Use an international WhatsApp number, digits only.');
 const ids=new Set();let featured=0;
 const projects=input.projects.map(p=>{
  if(!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||ids.has(p.id))throw Error('Each project needs a unique valid ID.');ids.add(p.id);
  for(const [field,max] of [['title',100],['category',80],['description',1000]])if(typeof p[field]!=='string'||!p[field].trim()||p[field].length>max)throw Error('Enter a title, category and description for every project.');
  if(!safeAsset(p.model,['.glb','.gltf']))throw Error('Use a local path or HTTPS URL ending in .glb or .gltf.');
  if(!safeAsset(p.poster,['.png','.webp','.jpg','.jpeg']))throw Error('Use a local path or HTTPS URL for a PNG, WebP or JPEG poster.');
  if(!p.model&&!p.poster)throw Error('Each project needs a model or a poster.');
  if(p.featured)featured++;
  return {id:p.id,title:p.title.trim(),category:p.category.trim(),description:p.description.trim(),model:p.model,poster:p.poster,featured:!!p.featured,colors:!!p.colors};
 });
 if(featured!==1)throw Error('Choose exactly one featured project.');
 return {contact:input.contact.trim(),whatsapp:input.whatsapp||'',projects};
}
export function parseModel(buffer,name){
 const bytes=new Uint8Array(buffer);if(bytes.byteLength>MAX_MODEL_BYTES)throw Error('This model exceeds 15 MB. Optimize it before uploading.');
 let json;
 if(name.toLowerCase().endsWith('.glb')){
  if(bytes.length<20)throw Error('Invalid GLB file.');const view=new DataView(buffer);
  if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==bytes.length||view.getUint32(16,true)!==0x4e4f534a)throw Error('Use a valid glTF 2.0 binary (.glb).');
  const len=view.getUint32(12,true);if(20+len>bytes.length)throw Error('The GLB file is incomplete.');json=JSON.parse(new TextDecoder().decode(bytes.subarray(20,20+len)));
 }else if(name.toLowerCase().endsWith('.gltf'))json=JSON.parse(new TextDecoder().decode(bytes));else throw Error('Choose a GLB or self-contained glTF file.');
 if(json.asset?.version!=='2.0')throw Error('Export this model as glTF 2.0.');
 if([...(json.buffers||[]),...(json.images||[])].some(x=>x.uri&&!x.uri.startsWith('data:')))throw Error('This file references separate textures or .bin files. Export as a single GLB, or use a hosted glTF URL with all companion files.');
 let triangles=0,primitives=0;const stack=new Set();
 const meshStats=index=>{const mesh=json.meshes?.[index];if(!mesh)throw Error('Missing mesh data.');for(const p of mesh.primitives||[]){const count=json.accessors?.[p.indices??p.attributes?.POSITION]?.count||0;if(!Number.isSafeInteger(count)||count<0)throw Error('Invalid mesh count.');const mode=p.mode??4;triangles+=mode===4?count/3:mode===5||mode===6?Math.max(0,count-2):0;primitives++;}};
 function visit(index){if(stack.has(index))throw Error('Invalid cyclic model hierarchy.');stack.add(index);const node=json.nodes?.[index];if(!node)throw Error('Missing model node.');if(node.mesh!==undefined)meshStats(node.mesh);for(const child of node.children||[])visit(child);stack.delete(index);}
 for(const node of json.scenes?.[json.scene??0]?.nodes||[])visit(node);
 if(!primitives)throw Error('Export a scene containing at least one visible mesh.');
 return {triangles:Math.round(triangles),materials:json.materials?.length||0,primitives,bytes:bytes.length};
}
export async function checkPoster(file){
 if(file.size>MAX_POSTER_BYTES)throw Error('Keep preview images under 2 MB. WebP around 100–250 KB is ideal.');
 const b=new Uint8Array(await file.slice(0,16).arrayBuffer());
 const png=b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71;
 const jpg=b[0]===255&&b[1]===216&&b[2]===255;
 const webp=new TextDecoder().decode(b.slice(0,4))==='RIFF'&&new TextDecoder().decode(b.slice(8,12))==='WEBP';
 if(!png&&!jpg&&!webp)throw Error('Choose an actual PNG, JPEG or WebP image.');
 return webp?'webp':png?'png':'jpg';
}
