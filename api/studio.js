import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { list, put } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';
import { validateCatalog } from '../src/lib/catalog.js';
import { defaultCatalog } from '../src/lib/defaults.js';
const attempts=new Map();
const cookieName='atoz_session';
const hasAdmin=()=>(process.env.ADMIN_PASSWORD?.length||0)>=16;
const hasBlob=()=>!!process.env.BLOB_READ_WRITE_TOKEN;
const sessionSecret=()=>process.env.SESSION_SECRET||process.env.ADMIN_PASSWORD||'unconfigured';
const hash=value=>createHash('sha256').update(String(value)).digest();
const sign=value=>createHmac('sha256',sessionSecret()).update(value).digest('base64url');
export function authenticated(req){
 if(!hasAdmin())return false;
 const value=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName+'='))?.slice(cookieName.length+1);
 if(!value)return false;const [expires,nonce,signature]=value.split('.');const payload=expires+'.'+nonce;
 return Number(expires)>Date.now()&&Number(expires)<Date.now()+3700000&&!!signature&&timingSafeEqual(hash(signature),hash(sign(payload)));
}
function sameOrigin(req){try{return new URL(req.headers.origin).host===req.headers.host}catch{return false}}
function cookie(value,maxAge){return cookieName+'='+value+'; HttpOnly; SameSite=Strict; Path=/; Max-Age='+maxAge+(process.env.VERCEL?' ;Secure':'');}
async function catalog(){
 if(!process.env.BLOB_READ_WRITE_TOKEN)return defaultCatalog;
 const {blobs}=await list({prefix:'atoz/catalog.json',limit:10});const record=blobs.find(b=>b.pathname==='atoz/catalog.json');if(!record)return defaultCatalog;
 const response=await fetch(record.url+'?revision='+Date.now(),{cache:'no-store'});if(!response.ok)throw Error('Could not read the published portfolio.');return validateCatalog(await response.json());
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 const action=req.query?.action || new URL(req.url,'https://localhost').searchParams.get('action');
 try{
  if(req.method==='GET'&&action==='status')return res.status(200).json({configured:hasAdmin(),hasBlob:hasBlob(),authenticated:authenticated(req)});
  if(req.method==='GET'&&action==='catalog')return res.status(200).json(await catalog());
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  if(!sameOrigin(req))return res.status(403).json({error:'Use the studio panel on this site.'});
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(action==='login'){
   if(!hasAdmin())return res.status(503).json({error:'Admin password is not configured in server environment variables.'});
   const ip=String(process.env.VERCEL?req.headers['x-forwarded-for']:req.socket?.remoteAddress||'local').split(',')[0];const now=Date.now();
   for(const [key,state] of attempts)if(now-state.since>900000)attempts.delete(key);
   const state=attempts.get(ip)||{count:0,since:now};if(state.count>=5||attempts.size>1000)return res.status(429).json({error:'Too many attempts. Try again in 15 minutes.'});
   if(typeof body?.password!=='string'||body.password.length>512||!timingSafeEqual(hash(body.password),hash(process.env.ADMIN_PASSWORD))){state.count++;attempts.set(ip,state);return res.status(401).json({error:'Incorrect admin password.'});}
   attempts.delete(ip);const payload=(now+3600000)+'.'+randomBytes(24).toString('hex');res.setHeader('Set-Cookie',cookie(payload+'.'+sign(payload),3600));return res.status(200).json({ok:true});
  }
  if(action==='logout'){res.setHeader('Set-Cookie',cookie('',0));return res.status(200).json({ok:true});}
  if(!hasBlob())return res.status(503).json({error:'Live publishing needs Vercel Blob, ADMIN_PASSWORD and SESSION_SECRET. Drafts and ZIP export work without them.'});
  if(!authenticated(req))return res.status(401).json({error:'Sign in to publish changes.'});
  if(action==='upload'){
   const result=await handleUpload({request:req,body,onBeforeGenerateToken:async pathname=>{
    if(!/^atoz\/assets\/[a-zA-Z0-9_-]+\.(glb|gltf|png|jpg|jpeg|webp)$/.test(pathname))throw Error('Unsupported upload name.');
    const image=/\.(png|jpe?g|webp)$/.test(pathname);
    return {allowedContentTypes:image?['image/png','image/jpeg','image/webp']:['model/gltf-binary','model/gltf+json','application/octet-stream','application/json'],maximumSizeInBytes:(image?2:15)*1024*1024,addRandomSuffix:true,tokenPayload:'studio'};
   }});return res.status(200).json(result);
  }
  if(action==='publish'){
   const value=validateCatalog(body);await put('atoz/catalog.json',JSON.stringify(value),{access:'public',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true,cacheControlMaxAge:60});return res.status(200).json({ok:true,catalog:value});
  }
  return res.status(404).json({error:'Unknown action.'});
 }catch(error){return res.status(400).json({error:error instanceof Error?error.message:'Request failed.'});}
}
