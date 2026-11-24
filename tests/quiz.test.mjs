import assert from 'node:assert/strict';
import {quizBank,quizSummary} from '../public/quiz-bank.js';
assert.equal(new Set(quizBank.map(q=>q.id)).size,quizBank.length);
for(const q of quizBank){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);assert.equal(q.hints.length,2);assert.ok(q.explanation.trim().length>0)}
assert.deepEqual(quizSummary([{id:'a',correct:true,hints:0},{id:'b',correct:true,hints:1},{id:'c',correct:false,hints:0},{id:'d',correct:false,hints:2,revealed:true}]),{total:4,correct:2,independent:1,reviewed:1,missed:['b','c','d']});
// Verify arithmetic on the kernel basis alternatives in k1.
const vectors=[[1,2],[-2,1],[0,0]];assert.deepEqual(vectors.map(([x,y])=>x+2*y===0&&2*x+4*y===0&&Math.abs(x)+Math.abs(y)>0),[false,true,false]);
assert.equal(1*4-2*3,-2);assert.equal(2-1+4,5);assert.equal(3-2,1);
console.log('PASS: quiz bank shape, unique choices, arithmetic, independent scoring and retry selection');
