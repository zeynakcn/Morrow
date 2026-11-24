export async function analyseSequential(files,analyse,{onProgress=()=>{},shouldStop=()=>false}={}){
const queue=files.filter(file=>!file.analysis);const results=[];let halted=false;
for(const file of queue){if(shouldStop()){halted=true;break}onProgress({phase:'start',file,position:results.length+1,total:queue.length,results:[...results]});let result;
try{const value=await analyse(file);result={file,ok:true,value}}catch(error){result={file,ok:false,error}}
results.push(result);onProgress({phase:'complete',file,position:results.length,total:queue.length,result,results:[...results]});
if(!result.ok&&[401,403,429,503].includes(result.error?.status)){halted=true;break}
}
return {total:queue.length,results,stopped:halted||shouldStop(),remaining:queue.length-results.length};
}
