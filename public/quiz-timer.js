// Absolute deadlines survive reloads and background-tab throttling.
export function remainingSeconds(session,now=Date.now()){
 if(!session?.deadline)return null;
 return Math.max(0,Math.ceil((session.deadline-now)/1000));
}
export function expireQuiz(session,now=Date.now()){
 if(!session||session.finished||!session.deadline||remainingSeconds(session,now)>0)return session;
 return {...session,timedOut:true,items:session.ids.map((id,index)=>session.items[index]||{id,choice:null,correct:false,hints:session.hints?.[id]||0,revealed:false,skipped:true})};
}
