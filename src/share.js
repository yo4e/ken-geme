import {formatTime} from './game.js';

export function resultShareData(game,url){
 const mode=game.mode==='reverse'?'県庁所在地 → 都道府県':'都道府県 → 県庁所在地';
 return {
  title:'覚えろ！ 県庁所在地',
  text:`「覚えろ！ 県庁所在地」で全47問クリア！\n${mode}\n解答タイム ${formatTime(game.elapsed,true)}（確認中は計測停止）\n答えを見た回数：${game.seen}回`,
  url:new URL('./',url).href,
 };
}

export const shareText=data=>`${data.text}\n${data.url}`;
