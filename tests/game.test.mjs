import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {prefectures} from '../src/data.js';
import {newGame,current,transition,expected,elapsedTime,readScores,saveScore,SCORE_KEY} from '../src/game.js';
const rng=()=>.999999;
test('47 unique prefectures, official capitals and map IDs align',()=>{
 const official='札幌市 青森市 盛岡市 仙台市 秋田市 山形市 福島市 水戸市 宇都宮市 前橋市 さいたま市 千葉市 新宿区 横浜市 新潟市 富山市 金沢市 福井市 甲府市 長野市 岐阜市 静岡市 名古屋市 津市 大津市 京都市 大阪市 神戸市 奈良市 和歌山市 鳥取市 松江市 岡山市 広島市 山口市 徳島市 高松市 松山市 高知市 福岡市 佐賀市 長崎市 熊本市 大分市 宮崎市 鹿児島市 那覇市'.split(' ');
 assert.equal(prefectures.length,47);assert.equal(new Set(prefectures.map(p=>p.name)).size,47);assert.deepEqual(prefectures.map(p=>p.capital),official);
 for(const p of prefectures){const svg=readFileSync(`public/maps/${p.id}.svg`,'utf8');assert.equal((svg.match(/fill="#00a376"/g)||[]).length,1);assert.ok(svg.includes(`<g fill="#00a376" id="${p.id}" name="${p.id===15?'neigata':p.slug}"`));assert.equal(new Set([...svg.matchAll(/<g (?:fill="[^"]+" )?id="(\d+)"/g)].map(m=>m[1])).size,47);assert.ok(p.specialties.length>=1&&p.specialties.length<=2);}
});
test('strict spelling, official hiragana, suffixes and surrounding space',()=>{
 for(const [id,wrong,right] of [[1,'札幌','札幌市'],[11,'埼玉市','さいたま市'],[13,'東京市','新宿区']]){let s={...newGame('normal',0,rng),queue:[id]};assert.equal(transition(s,{type:'answer',value:wrong},10).stage,'incorrect');assert.equal(transition(s,{type:'answer',value:`　${right} `},10).stage,'correct');}
 const s={...newGame('reverse',0,rng),queue:[40]};assert.equal(transition(s,{type:'answer',value:'福岡'},10).stage,'incorrect');assert.equal(transition(s,{type:'answer',value:'福岡県'},10).stage,'correct');
});
test('wrong → reveal → randomized reinsert remains unsolved',()=>{
 let s={...newGame('normal',100,rng),queue:[40,1,2]};s=transition(s,{type:'answer',value:'北九州市'},1100);assert.equal(s.solved,0);assert.equal(s.stage,'incorrect');assert.equal(transition(s,{type:'next'},2000),s);
 s=transition(s,{type:'reveal'},5000);assert.equal(s.elapsed,1000);assert.equal(s.solved,0);s=transition(s,{type:'next'},9000,()=>0);assert.deepEqual(s.queue,[1,40,2]);assert.equal(s.solved,0);assert.equal(elapsedTime(s,9500),1500);
});
test('reveal last card repeats; double submit/next cannot skip',()=>{
 let s={...newGame('normal',0),queue:[40]};s=transition(s,{type:'reveal'},100);s=transition(s,{type:'next'},200);assert.deepEqual(s.queue,[40]);s=transition(s,{type:'answer',value:'福岡市'},400);assert.equal(transition(s,{type:'answer',value:'福岡市'},500),s);assert.equal(elapsedTime(s,80000),300);s=transition(s,{type:'next'},90000);assert.equal(s.stage,'complete');assert.equal(transition(s,{type:'next'},95000),s);
});
for(const mode of ['normal','reverse'])test(`${mode}: all 47 self-solved before completion`,()=>{
 let s=newGame(mode,0,rng);const ids=[];let now=0;
 for(let i=0;i<47;i++){ids.push(current(s).id);s=transition(s,{type:'answer',value:expected(current(s),mode)},now+1000);assert.equal(s.solved,i+1);s=transition(s,{type:'next'},now+5000);now+=5000;}
 assert.equal(new Set(ids).size,47);assert.equal(s.stage,'complete');assert.equal(s.elapsed,47000);
});
test('mode-specific best times, reload and unavailable/corrupt storage',()=>{
 let value=null;const st={getItem:()=>value,setItem:(k,v)=>{assert.equal(k,SCORE_KEY);value=v;}};
 assert.equal(saveScore(st,'normal',9000).newBest,true);assert.equal(saveScore(st,'normal',10000).newBest,false);saveScore(st,'reverse',8000);assert.deepEqual(readScores(st).scores,{normal:9000,reverse:8000});saveScore(st,'normal',7000);assert.equal(readScores(st).scores.normal,7000);
 assert.equal(saveScore(null,'normal',1000).available,false);assert.equal(saveScore({getItem:()=>null,setItem:()=>{throw Error('quota')}},'normal',1000).available,false);
 value='{';assert.deepEqual(readScores(st),{scores:{},available:false});value='{"normal":-2,"reverse":"bad"}';assert.deepEqual(readScores(st).scores,{});
});
test('initial and repeated games are shuffled permutations',()=>{const a=newGame('normal',0,()=>0),b=newGame('normal',0,()=>.5);assert.equal(new Set(a.queue).size,47);assert.notDeepEqual(a.queue,b.queue);});
