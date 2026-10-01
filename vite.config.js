import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({
 plugins:[svelte(),{name:'studio-local-api',configureServer(server){server.middlewares.use(async(req,res,next)=>{
  if(!/^\/api\/studio(?:\?|$)/.test(req.url))return next();
  try{let length=0;const chunks=[];for await(const chunk of req){length+=chunk.length;if(length>65536){res.statusCode=413;res.end('Request too large');return;}chunks.push(chunk)}
   req.body=chunks.length?JSON.parse(Buffer.concat(chunks).toString()):undefined;
   res.status=code=>{res.statusCode=code;return res};res.json=value=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value))};
   const {default:handler}=await import('./api/studio.js');await handler(req,res);
  }catch{res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Local studio API failed.'}))}
 })}}],build:{target:'es2022'}
});
