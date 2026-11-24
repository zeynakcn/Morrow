import {copyFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const env=new URL('../.env',import.meta.url);
try{await access(env);console.log('.env already exists. It was not changed.')}catch{await copyFile(new URL('../.env.example',import.meta.url),env);console.log('Created .env. Open it in your editor and add OPENAI_API_KEY.')}
console.log('Config file: '+fileURLToPath(env));
console.log('Next: npm start, then open http://localhost:3000');
