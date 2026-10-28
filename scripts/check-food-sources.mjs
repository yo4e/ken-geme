import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {prefectures} from '../src/data.js';
const index=readFileSync('work/food-areas.html','utf8');
const urls=[...index.matchAll(/href="([^\"]+area\/[^\"]+\.html)"/g)].map(m=>new URL(m[1],'https://www.maff.go.jp').href);
mkdirSync('work/food',{recursive:true});
const results=[];
for(let i=0;i<prefectures.length;i+=4){
 await Promise.all(prefectures.slice(i,i+4).map(async p=>{
  if(p.id!==40 && !urls.includes(p.foodSource))throw Error('Source not observed '+p.foodSource);
  const res=await fetch(p.foodSource);const html=await res.text();
  writeFileSync(`work/food/${p.id}.html`,html);
  results.push({id:p.id,name:p.name,url:p.foodSource,status:res.status,found:p.specialties.map(name=>({name,found:html.includes(name)}))});
 }));
}
results.sort((a,b)=>a.id-b.id);
writeFileSync('work/food-validation.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.filter(r=>r.status!==200 || r.found.some(f=>!f.found)),null,2));
