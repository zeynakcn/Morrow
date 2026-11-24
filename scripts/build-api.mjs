import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
process.chdir(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
await build({entryPoints:['source/api.ts'],outfile:'server/api.mjs',bundle:true,format:'esm',platform:'node',target:'node22',plugins:[{name:'local-environment',setup(b){b.onResolve({filter:/^cloudflare:workers$/},()=>({path:'environment',namespace:'local'}));b.onLoad({filter:/.*/,namespace:'local'},()=>({contents:'export const env = globalThis.__MORROW_ENV;'}))}}]});
console.log('Built server/api.mjs');
