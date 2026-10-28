import React,{useRef,useState,useEffect} from 'react';
import {ShareNetwork,Copy} from '@phosphor-icons/react';
import {resultShareData,shareText} from './share.js';

export function ResultShare({game}){
 const data=resultShareData(game,window.location.href);
 const text=shareText(data);
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[manual,setManual]=useState(false);
 const pending=useRef(false),textRef=useRef(null);
 useEffect(()=>{if(manual){textRef.current?.focus();textRef.current?.select();}},[manual]);
 async function copy(){
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(text);
   setManual(false);setMessage('記録をコピーしました。好きな場所に貼り付けて送れます。');
  }catch{
   setManual(true);setMessage('下の文章を選択してコピーできます。');
  }
 }
 async function share(){
  if(pending.current)return;
  pending.current=true;setBusy(true);setMessage('');setManual(false);
  try{
   if(typeof navigator.share==='function'){
    // Keep this call directly in the user's click, before any await.
    await navigator.share(data);
    setMessage('共有画面に記録を渡しました。');
   }else await copy();
  }catch(error){
   if(error?.name==='AbortError')setMessage('シェアをキャンセルしました。');
   else{setManual(true);setMessage('共有を開けませんでした。記録をコピーして送れます。');}
  }finally{pending.current=false;setBusy(false);}
 }
 return <div className="result-share">
  <button type="button" className="secondary share-button" onClick={share} disabled={busy}><ShareNetwork weight="bold" aria-hidden="true"/>{busy?'共有を準備中…':'記録をシェア'}</button>
  <p className="share-status" role="status" aria-live="polite">{message}</p>
  {manual&&<div className="share-fallback"><label htmlFor="share-text">シェアする記録</label><textarea id="share-text" ref={textRef} readOnly value={text} rows={7} onFocus={e=>e.currentTarget.select()}/><button type="button" className="copy-button" onClick={copy}><Copy aria-hidden="true"/>記録をコピー</button></div>}
 </div>;
}
