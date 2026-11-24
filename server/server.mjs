import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join,resolve} from 'node:path';
import {createLocalBucket} from './storage.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||3000);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be between 1024 and 65535.');
globalThis.__MORROW_ENV={BUCKET:createLocalBucket(join(process.env.MORROW_DATA_DIR||join(root,'data'),'objects')),OPENAI_API_KEY:process.env.OPENAI_API_KEY||'',OPENAI_MODEL:process.env.OPENAI_MODEL||'gpt-4.1-mini'};
const api=await import('./api.mjs');
const types={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
async function send(res,response){res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}
createServer(async(req,res)=>{try{
 const allowed=new Set(['localhost:'+port,'127.0.0.1:'+port]);
 if(!allowed.has(req.headers.host)){res.writeHead(403);res.end('This app only accepts localhost requests.');return}
 const url=new URL(req.url,'http://'+req.headers.host);
 const secureHeaders={'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Referrer-Policy':'same-origin'};
 if(url.pathname.startsWith('/api/')){
  if(!['GET','POST'].includes(req.method)){res.writeHead(405);res.end();return}
  let chunks=[],length=0;for await(const chunk of req){length+=chunk.length;if(length>4600000){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Upload too large. Maximum file size is 3 MB.'}));return}chunks.push(chunk)}
  const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(typeof v==='string'&&k.toLowerCase()!=='oai-authenticated-user-id')headers.set(k,v);
  // Single-user local mode: never trust a supplied identity header.
  headers.set('oai-authenticated-user-id','local-user');
  const request=new Request(url,{method:req.method,headers,body:req.method==='POST'?Buffer.concat(chunks):undefined});
  const action=url.pathname.slice(5);const response=await api[req.method](request,{params:Promise.resolve({action})});for(const[k,v]of Object.entries(secureHeaders))response.headers.set(k,v);await send(res,response);return
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}
 if(url.pathname==='/signin-with-chatgpt'){res.writeHead(302,{Location:'/study'});res.end();return}
 let file,contentType;
 if(url.pathname==='/'||url.pathname==='/study'){file=join(root,'pages',url.pathname==='/'?'index.html':'study.html');contentType='text/html; charset=utf-8'}
 else if(/^\/[a-zA-Z0-9_.-]+\.(css|js|svg)$/.test(url.pathname)){file=join(root,'public',url.pathname.slice(1));contentType=types[url.pathname.slice(url.pathname.lastIndexOf('.'))]}
 else{res.writeHead(404,secureHeaders);res.end('Not found');return}
 try{let bytes=await readFile(file);res.writeHead(200,{...secureHeaders,'Content-Type':contentType});res.end(req.method==='HEAD'?undefined:bytes)}catch(e){if(e.code!=='ENOENT')throw e;res.writeHead(404,secureHeaders);res.end('Not found')}
 }catch(e){console.error('Request failed:',e.message);if(!res.headersSent)res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'The local server could not complete that request.'}))}
}).listen(port,'127.0.0.1',()=>{console.log('\nMorrow is running at http://localhost:'+port);console.log('Local single-user mode. Keep this server on your own computer.');console.log('AI: '+(process.env.OPENAI_API_KEY?'key configured (not yet verified)':'not configured — add OPENAI_API_KEY to .env and restart.'));console.log('Press Control+C to stop.\n')});
