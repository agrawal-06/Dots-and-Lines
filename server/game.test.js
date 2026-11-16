import test from 'node:test';import assert from 'node:assert/strict';import {makeGame,play,edgeId,scores} from './game.js';
test('a completed box awards a point and extra turn',()=>{let g=makeGame(2);for(const id of ['h-0-0','v-0-0','h-1-0','v-0-1'])g=play(g,id);assert.equal(Object.keys(g.boxes).length,1);assert.equal(g.turn,1);assert.deepEqual(scores(g),[0,1]);});
test('duplicate edges do not advance turn',()=>{let g=play(makeGame(3),'h-0-0');assert.deepEqual(play(g,'h-0-0'),g)});
test('out-of-range edges are ignored',()=>{let g=makeGame(3);assert.deepEqual(play(g,'v-9-9'),g)});
test('board completes and declares finished',()=>{let g=makeGame(1);for(const id of ['h-0-0','v-0-0','h-1-0','v-0-1'])g=play(g,id);assert.equal(g.finished,true);assert.equal(scores(g).reduce((a,b)=>a+b),1)});
