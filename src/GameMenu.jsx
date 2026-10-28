import React,{useRef,useEffect} from 'react';
import {List} from '@phosphor-icons/react';

export function GameMenu(){
 const ref=useRef(null);
 useEffect(()=>{
  const close=event=>{const menu=ref.current;if(menu?.open&&!menu.contains(event.target))menu.open=false;};
  const escape=event=>{if(event.key==='Escape'&&ref.current?.open){ref.current.open=false;ref.current.querySelector('summary').focus();}};
  document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape);};
 },[]);
 return <details className="game-menu" ref={ref}><summary aria-label="メニュー"><List weight="bold" aria-hidden="true"/></summary><nav aria-label="関連サイト"><a href="https://4roz.com/games/">よろずミニゲーム</a><a href="https://4roz.com/">よろずコム</a></nav></details>;
}
