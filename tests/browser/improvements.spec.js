import {test,expect} from '@playwright/test';
import {prefectures} from '../../src/data.js';

async function start(page){await page.goto('/');await page.getByRole('button',{name:'はじめる',exact:true}).click();}
async function finish(page){
 await start(page);
 for(let i=0;i<47;i++){
  const name=await page.locator('.question-card p').textContent();
  await page.locator('#answer').fill(prefectures.find(p=>p.name===name).capital);
  await page.getByRole('button',{name:'回答する',exact:true}).click();
  await page.getByRole('button',{name:i===46?'結果を見る':'次の県へ',exact:true}).click();
 }
}

test('Enter advances only a fresh confirmation: held, immediate and IME events cannot skip',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>.999999;});await start(page);
 await page.locator('#answer').fill('札幌市');
 await page.locator('#answer').dispatchEvent('compositionstart');
 await page.keyboard.down('Enter');await expect(page.locator('.question-card p')).toHaveText('北海道');
 await page.locator('#answer').dispatchEvent('compositionend');await page.keyboard.up('Enter');
 await page.waitForTimeout(100);await page.keyboard.down('Enter');
 await expect(page.getByRole('heading',{name:'正解！',exact:true})).toBeVisible();
 await page.waitForTimeout(250);await page.keyboard.down('Enter');
 await page.locator('.game-content').dispatchEvent('keydown',{key:'Enter',repeat:false});
 await expect(page.locator('.status strong')).toHaveText('クリア 1 / 47');await expect(page.locator('.answer-title')).toHaveText('札幌市');
 await page.keyboard.up('Enter');await page.keyboard.press('Enter');
 await expect(page.locator('.question-card p')).toHaveText('青森県');await expect(page.locator('#answer')).toHaveValue('');
 // A click followed synchronously by Enter must leave the answer visible.
 await page.locator('#answer').fill('青森市');
 await page.getByRole('button',{name:'回答する',exact:true}).evaluate(button=>{button.click();document.querySelector('.game-content').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));document.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',bubbles:true}));});
 await expect(page.locator('.answer-title')).toHaveText('青森市');
 await page.waitForTimeout(250);
 await page.locator('.game-content').dispatchEvent('keydown',{key:'Enter',isComposing:true,keyCode:229});
 await page.locator('.game-content').dispatchEvent('keyup',{key:'Enter'});
 await expect(page.locator('.answer-title')).toHaveText('青森市');
 await page.keyboard.press('Control+Enter');await expect(page.locator('.answer-title')).toHaveText('青森市');
 await page.getByRole('button',{name:'次の県へ',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(page.locator('.question-card p')).toHaveText('岩手県');
 await page.locator('#answer').fill('まちがい');await page.keyboard.press('Enter');await page.waitForTimeout(250);await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:'ざんねん！'})).toBeVisible();
 await page.getByRole('button',{name:'答えを見る',exact:true}).click();await page.waitForTimeout(250);await page.keyboard.press('Enter');
 await expect(page.locator('.question-card p')).toHaveText('宮城県');await expect(page.locator('.status strong')).toHaveText('クリア 2 / 47');
});

test('result sharing requires a click; native, cancellation, copying and manual fallback',async({page})=>{
 await page.addInitScript(()=>{
  window.shareCalls=[];window.copyCalls=[];
  Object.defineProperty(navigator,'share',{configurable:true,writable:true,value:data=>{window.shareCalls.push({...data,active:navigator.userActivation?.isActive});return new Promise(resolve=>{window.resolveShare=resolve;});}});
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copyCalls.push(text);}}});
 });
 await finish(page);expect(await page.evaluate(()=>window.shareCalls)).toEqual([]);
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`work/screenshots/share-result-${width}-${test.info().project.name}.png`,fullPage:true});}
 await page.setViewportSize({width:390,height:844});
 const button=page.getByRole('button',{name:'記録をシェア',exact:true});await button.click();
 await expect(page.getByRole('button',{name:'共有を準備中…'})).toBeDisabled();
 await page.locator('.share-button').evaluate(button=>{button.click();button.click();});
 expect(await page.evaluate(()=>window.shareCalls.length)).toBe(1);
 const payload=await page.evaluate(()=>window.shareCalls[0]);expect(payload.title).toBe('覚えろ！ 県庁所在地');expect(payload.text).toContain('全47問クリア');expect(payload.text).toContain('都道府県 → 県庁所在地');expect(payload.text).toContain('答えを見た回数：0回');expect(payload.url).toBe('http://127.0.0.1:4178/');expect(payload.active).toBe(true);
 await page.evaluate(()=>window.resolveShare());await expect(page.getByRole('status')).toContainText('共有画面に記録を渡しました');
 await page.evaluate(()=>{navigator.share=async()=>{throw new DOMException('Canceled','AbortError');};});await button.click();await expect(page.getByRole('status')).toContainText('キャンセル');expect(await page.evaluate(()=>window.copyCalls.length)).toBe(0);
 await page.evaluate(()=>{navigator.share=async()=>{throw new DOMException('Unavailable','NotAllowedError');};});await button.click();await expect(page.locator('#share-text')).toBeVisible();
 await page.getByRole('button',{name:'記録をコピー',exact:true}).click();await expect(page.getByRole('status')).toContainText('コピーしました');
 await page.evaluate(()=>{navigator.share=undefined;});await button.click();await expect(page.getByRole('status')).toContainText('コピーしました');expect(await page.evaluate(()=>window.copyCalls.length)).toBe(2);
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new DOMException('Denied','NotAllowedError');};});await button.click();
 await expect(page.locator('#share-text')).toBeFocused();await expect(page.locator('#share-text')).toContainText('http://127.0.0.1:4178/');expect(await page.locator('#share-text').evaluate(el=>el.selectionStart===0&&el.selectionEnd===el.value.length)).toBe(true);
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`work/screenshots/share-fallback-${width}-${test.info().project.name}.png`,fullPage:true});}
});

test('favicon, Apple icon and manifest resolve inside the app directory',async({page,request})=>{
 await page.goto('/');
 for(const selector of ['link[rel="icon"][type="image/png"]','link[rel="apple-touch-icon"]']){
  const href=await page.locator(selector).getAttribute('href');expect(href.startsWith('./')).toBe(true);
  expect((await request.get(href)).ok()).toBe(true);
  const size=await page.evaluate(async href=>{const image=new Image();image.src=href;await image.decode();return [image.naturalWidth,image.naturalHeight];},href);expect(size[0]).toBe(selector.includes('apple')?180:32);expect(size[0]).toBe(size[1]);
 }
 const manifest=await (await request.get('./site.webmanifest')).json();expect(manifest.start_url).toBe('./');expect(manifest.scope).toBe('./');expect(manifest.icons).toHaveLength(3);
 for(const icon of manifest.icons){expect(icon.src.startsWith('/')).toBe(false);expect((await request.get(icon.src)).ok()).toBe(true);const size=await page.evaluate(async src=>{const image=new Image();image.src=src;await image.decode();return `${image.naturalWidth}x${image.naturalHeight}`;},icon.src);expect(size).toBe(icon.sizes);}
 const ico=await request.get('./favicon.ico');expect(ico.ok()).toBe(true);expect((await ico.body()).readUInt16LE(2)).toBe(1);
});

test('site links stay inside the compact menu and Escape restores focus',async({page})=>{
 await page.goto('/');const menu=page.getByLabel('メニュー',{exact:true});
 await expect(page.getByRole('link',{name:'よろずコム',exact:true})).not.toBeVisible();
 await menu.click();await expect(page.getByRole('link',{name:'よろずミニゲーム',exact:true})).toHaveAttribute('href','https://4roz.com/games/');
 await page.keyboard.press('Escape');await expect(menu).toBeFocused();await expect(page.getByRole('link',{name:'よろずコム',exact:true})).not.toBeVisible();
 await menu.click();await page.locator('.eyebrow').click();await expect(page.getByRole('link',{name:'よろずコム',exact:true})).not.toBeVisible();
});
