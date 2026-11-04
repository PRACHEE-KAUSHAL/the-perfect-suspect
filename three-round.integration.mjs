import assert from 'node:assert/strict';
import handler from '../dist/game-handler.mjs';
const call = async (method, body={}, query='') => {
 const req = new Request('https://example.test/api/game'+query,{method,headers:{'content-type':'application/json'},...(method==='POST'?{body:JSON.stringify(body)}:{})});
 const res=await handler(req); const data=await res.json(); assert.ok(res.ok,JSON.stringify(data)); return data;
};
const host=await call('POST',{action:'create',name:'Morgan'});
const guest=await call('POST',{action:'join',code:host.code,pid:host.pid,name:'Riley'});
assert.equal(guest.state.players.length,2);
await call('POST',{action:'start',code:host.code,pid:host.pid});
const roundOutcomes=[];
for(let round=1;round<=3;round++){
 let state=(await call('GET',{},`?code=${host.code}&pid=${host.pid}`));
 assert.equal(state.round,round);
 for(let i=0;i<4;i++) await call('POST',{action:'advance',code:host.code,pid:host.pid});
 const h=await call('GET',{},`?code=${host.code}&pid=${host.pid}`);
 const g=await call('GET',{},`?code=${host.code}&pid=${guest.pid}`);
 assert.equal(h.phase,'accusation');
 const investigator=h.role?.kind==='investigator'?h:g;
 const mastermind=h.role?.kind==='mastermind'?h:g;
 assert.equal(mastermind.role.kind,'mastermind');
 const invPid=investigator===h?host.pid:guest.pid;
 const killerPid=mastermind===h?host.pid:guest.pid;
 const vote=await call('POST',{action:'vote',code:host.code,pid:invPid,suspectId:killerPid,evidenceIds:['ledger','key']});
 assert.equal(vote.state.phase,'reveal');
 assert.equal(vote.state.results.solved,true);
 assert.ok(vote.state.results.scores[invPid]>=8);
 assert.equal(vote.state.results.scores[killerPid],-4);
 roundOutcomes.push({round,invPid,killerPid,scores:vote.state.results.scores,total:vote.state.results.totalScores});
 if(round<3){const hostReveal=await call('GET',{},`?code=${host.code}&pid=${host.pid}`);assert.equal(hostReveal.canNextRound,true);await call('POST',{action:'nextRound',code:host.code,pid:host.pid});}
}
const final=await call('GET',{},`?code=${host.code}&pid=${host.pid}`);
assert.equal(final.phase,'reveal');
assert.equal(final.round,3);
const winner=final.players.slice().sort((a,b)=>(final.totalScores[b.id]||0)-(final.totalScores[a.id]||0))[0];
assert.ok(winner);
assert.ok(final.totalScores[host.pid]!==final.totalScores[guest.pid]);
console.log(JSON.stringify({rounds:roundOutcomes,finalScores:final.totalScores,winner:winner.name},null,2));
