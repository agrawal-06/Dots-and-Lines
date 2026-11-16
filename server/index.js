import express from 'express';import {createServer} from 'node:http';import {Server} from 'socket.io';import {randomInt} from 'node:crypto';import {makeGame,play} from './game.js';
const app=express();app.get('/health',(_,res)=>res.json({ok:true}));const http=createServer(app);const io=new Server(http,{cors:{origin:'*'}});const rooms=new Map();
const code=()=>Array.from({length:6},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[randomInt(32)]).join('');
function emit(room){const entry=rooms.get(room);if(!entry)return;entry.players.forEach((id,i)=>{if(id)io.to(id).emit('state',{room,game:entry.game,player:i})});}
io.on('connection',socket=>{
 socket.on('create',()=>{let room=code();while(rooms.has(room))room=code();rooms.set(room,{game:makeGame(4,['Player 1','Player 2']),players:[socket.id,null]});socket.join(room);emit(room)});
 socket.on('join',({room}={})=>{if(typeof room!=='string')return;room=room.toUpperCase();const entry=rooms.get(room);if(!entry)return socket.emit('errorMessage','Room not found');if(entry.players[1])return socket.emit('errorMessage','Room is full');entry.players[1]=socket.id;socket.join(room);emit(room)});
 socket.on('move',({room,id}={})=>{const entry=rooms.get(room);if(!entry||typeof id!=='string')return;const index=entry.players.indexOf(socket.id);if(index<0||index!==entry.game.turn||!entry.players[1])return;entry.game=play(entry.game,id);emit(room)});
 socket.on('disconnect',()=>{for(const [room,entry] of rooms){if(entry.players.includes(socket.id)){io.to(room).emit('opponentLeft');rooms.delete(room)}}});
});http.listen(process.env.PORT||3001,()=>console.log('Dots & Lines server ready'));