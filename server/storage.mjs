import {mkdir,readFile,readdir,rename,unlink,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
export function createLocalBucket(directory){
 const locks=new Map();
 const path=key=>join(directory,createHash('sha256').update(key).digest('hex')+'.json');
 async function record(key){try{return JSON.parse(await readFile(path(key),'utf8'))}catch(e){if(e.code==='ENOENT')return null;throw e}}
 async function locked(key,fn){let previous=locks.get(key)||Promise.resolve();let current=previous.catch(()=>{}).then(fn);locks.set(key,current);try{return await current}finally{if(locks.get(key)===current)locks.delete(key)}}
 return {
 async get(key){let item=await record(key);if(!item)return null;const bytes=Buffer.from(item.body,'base64');return {etag:item.etag,text:async()=>bytes.toString('utf8'),json:async()=>JSON.parse(bytes.toString('utf8')),arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)}},
 async put(key,value,options={}){return locked(key,async()=>{await mkdir(directory,{recursive:true});const old=await record(key);if(options.onlyIf?.etagMatches&&old?.etag!==options.onlyIf.etagMatches)return null;const bytes=typeof value==='string'?Buffer.from(value):Buffer.from(value);let item={key,etag:randomUUID(),body:bytes.toString('base64')};let target=path(key),temp=target+'.'+randomUUID()+'.tmp';await writeFile(temp,JSON.stringify(item),{mode:0o600});await rename(temp,target);return {key,etag:item.etag}})},
 async list({prefix='',cursor,limit=1000}={}){await mkdir(directory,{recursive:true});let names=(await readdir(directory)).filter(n=>n.endsWith('.json'));let matches=[];for(let name of names){let item=JSON.parse(await readFile(join(directory,name),'utf8'));if(item.key.startsWith(prefix))matches.push({key:item.key,etag:item.etag})}matches.sort((a,b)=>a.key.localeCompare(b.key));let index=cursor?Number(cursor):0,objects=matches.slice(index,index+limit),truncated=index+limit<matches.length;return {objects,truncated,cursor:truncated?String(index+limit):undefined}},
 async delete(key){return locked(key,async()=>{try{await unlink(path(key))}catch(e){if(e.code!=='ENOENT')throw e}})}
 }
}
