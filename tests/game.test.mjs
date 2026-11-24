import assert from 'node:assert/strict';
import {makeQuestion,isCorrect,unlocked,rewards} from '../public/game-engine.js';
for(let v=0;v<12;v++){let q=makeQuestion(1,v);assert.ok(isCorrect(q,{x:-q.k,y:1}));assert.ok(isCorrect(q,{x:2*q.k,y:-2}));assert.ok(!isCorrect(q,{x:0,y:0}));assert.ok(!isCorrect(q,{x:'',y:''}));assert.ok(!isCorrect(q,{x:1,y:1}));let b=makeQuestion(3,v);assert.ok(isCorrect(b,{rank:1,dimension:1,x:-b.k,y:1}));assert.ok(!isCorrect(b,{rank:2,dimension:1,x:-b.k,y:1}));assert.ok(!isCorrect(b,{rank:'',dimension:1,x:-b.k,y:1}));}
assert.equal(unlocked([],1),false);assert.equal(unlocked([{index:0,reviewed:true}],1),true);
assert.deepEqual(rewards([{index:0,reviewed:true}]),{xp:5,gems:0});
assert.deepEqual(rewards([{index:0,correct:true},{index:0,correct:true}]),{xp:20,gems:1});
assert.deepEqual(rewards([{index:0,reviewed:true},{index:0,correct:true}]),{xp:20,gems:1});
assert.ok(!isCorrect(makeQuestion(2),{dimension:''}));console.log('PASS: generated maths, scalar-equivalent bases, zero-vector rejection, boss grading, unlocks, reviewed rewards and duplicate reward prevention');
