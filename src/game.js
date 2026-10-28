import { prefectures } from './data.js';
export const SCORE_KEY='ken-geme.best.v1';
export const normalize = value => value.normalize('NFKC').trim();
export const expected = (card,mode) => mode==='reverse' ? card.name : card.capital;
export function shuffle(items,rng=Math.random){
 const result=[...items];
 for(let i=result.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
 return result;
}
export function newGame(mode='normal',now=0,rng=Math.random){
 return {mode,queue:shuffle(prefectures.map(p=>p.id),rng),solved:0,stage:'question',elapsed:0,since:now,answer:'',seen:0};
}
export const current = state => prefectures[state.queue[0]-1];
export const elapsedTime = (state,now) => state.elapsed+(state.stage==='question'?Math.max(0,now-state.since):0);
export function transition(state,action,now=0,rng=Math.random){
 if(action.type==='answer' && state.stage==='question'){
  if(!normalize(action.value))return state;
  const ok=normalize(action.value)===expected(current(state),state.mode);
  return {...state,answer:action.value,stage:ok?'correct':'incorrect',solved:state.solved+Number(ok),elapsed:elapsedTime(state,now)};
 }
 if(action.type==='reveal' && ['question','incorrect'].includes(state.stage))return {...state,stage:'reveal',elapsed:elapsedTime(state,now),seen:state.seen+1};
 if(action.type==='next' && ['correct','reveal'].includes(state.stage)){
  const queue=state.queue.slice(1);
  if(state.stage==='reveal'){
   // Keep the failed card unsolved; another card comes first whenever available.
   const place=queue.length ? 1+Math.floor(rng()*queue.length) : 0;
   queue.splice(place,0,state.queue[0]);
  }
  return {...state,queue,answer:'',stage:queue.length?'question':'complete',since:now};
 }
 return state;
}
export function formatTime(ms,precise=false){
 const tenths=Math.floor(Math.max(0,ms)/100), seconds=Math.floor(tenths/10);
 return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}${precise?'.'+tenths%10:''}`;
}
export function readScores(storage){
 try{
  const data=JSON.parse(storage.getItem(SCORE_KEY)||'{}');
  const scores={};
  for(const mode of ['normal','reverse'])if(typeof data?.[mode]==='number' && Number.isFinite(data[mode]) && data[mode]>0)scores[mode]=data[mode];
  return {scores,available:true};
 }catch{return {scores:{},available:false};}
}
export function saveScore(storage,mode,time){
 const result=readScores(storage);
 if(!result.available)return {...result,newBest:false};
 const best=result.scores[mode];
 const newBest=!best || time<best;
 if(newBest)result.scores[mode]=Math.max(1,time);
 try{storage.setItem(SCORE_KEY,JSON.stringify(result.scores));return {...result,newBest};}
 catch{return {...result,available:false,newBest:false};}
}
