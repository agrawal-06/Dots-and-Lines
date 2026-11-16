export const makeGame=(size=4,names=['Player 1','Player 2'])=>({size,names,turn:0,edges:{},boxes:{},finished:false});
export const edgeId=(orientation,r,c)=>`${orientation}-${r}-${c}`;
export function play(game,id){
 if(game.finished||game.edges[id]!==undefined)return game;
 const [orientation,rs,cs]=id.split('-'),r=+rs,c=+cs,n=game.size;
 if(!['h','v'].includes(orientation)||!Number.isInteger(r)||!Number.isInteger(c)||r<0||c<0||(orientation==='h'&&(r>n||c>=n))||(orientation==='v'&&(r>=n||c>n)))return game;
 const edges={...game.edges,[id]:game.turn},boxes={...game.boxes};let scored=0;
 const candidates=orientation==='h'?[[r-1,c],[r,c]]:[[r,c-1],[r,c]];
 for(const [br,bc] of candidates){if(br<0||bc<0||br>=n||bc>=n)continue;
 const key=`${br}-${bc}`;
 if(boxes[key]!==undefined)continue;
 if([edgeId('h',br,bc),edgeId('h',br+1,bc),edgeId('v',br,bc),edgeId('v',br,bc+1)].every(e=>edges[e]!==undefined)){boxes[key]=game.turn;scored++;}}
 const finished=Object.keys(boxes).length===n*n;
 return {...game,edges,boxes,finished,turn:scored?game.turn:(game.turn+1)%game.names.length};
}
export const scores=game=>game.names.map((_,i)=>Object.values(game.boxes).filter(v=>v===i).length);