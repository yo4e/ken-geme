import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {prefectures} from '../src/data.js';
let svg=readFileSync('sources/japan-original.svg','utf8').replace(/\r\n/g,'\n')
 .replace('id="5" name="yamagata"','id="6" name="yamagata"')
 .replace('id="6" name="fukushima"','id="7" name="fukushima"')
 .replace('fill="lightgreen" stroke="gray" stroke-width="0.5"','fill="#ffffff" stroke="#8ba1ae" stroke-width="3"')
 .replace('stroke="dodgerblue" stroke-width="16"','stroke="#adbcc5" stroke-width="3" stroke-dasharray="8 8"');
const ids=[...svg.matchAll(/<g id="(\d+)" name="([^"]+)"/g)].map(m=>Number(m[1]));
if(ids.length!==47 || new Set(ids).size!==47 || prefectures.some(p=>!ids.includes(p.id)))throw Error('Map must contain each prefecture ID once');
mkdirSync('public/maps',{recursive:true});
writeFileSync('sources/japan-normalized.svg',svg);
for(const p of prefectures){
 const colored=svg.replace(`<g id="${p.id}"`, `<g fill="#00a376" id="${p.id}"`)
 .replace('<title>Map of Japan</title>',`<title>日本地図：${p.name}を緑色で表示</title>`);
 writeFileSync(`public/maps/${p.id}.svg`,colored);
}
console.log('Validated and generated 47 prefecture maps');
