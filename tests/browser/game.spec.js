import {test,expect} from '@playwright/test';
import {prefectures} from '../../src/data.js';
const start=async(page,mode='normal')=>{await page.goto('/');if(mode==='reverse')await page.getByLabel('県庁所在地 → 都道府県').check();await page.getByRole('button',{name:'はじめる',exact:true}).click();};
const byName=name=>prefectures.find(p=>p.name===name||p.capital===name);
const answer=async(page,mode='normal')=>{const shown=await page.locator('.question-card p').textContent();const p=byName(shown);expect(p).toBeTruthy();await page.locator('#answer').fill(mode==='reverse'?p.name:p.capital);await page.getByRole('button',{name:'回答する',exact:true}).click();return p;};
test('wrong, reveal, reinsertion, no early clear and frozen confirmation time',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>.999999});await start(page);
 const first=await page.locator('.question-card p').textContent();
 await page.locator('#answer').fill('間違い');await page.getByRole('button',{name:'回答する',exact:true}).click();
 await expect(page.getByRole('heading',{name:'ざんねん！'})).toBeVisible();await expect(page.getByRole('button',{name:'次の県へ'})).toHaveCount(0);
 const time=await page.locator('.clock span').textContent();await page.waitForTimeout(1100);await expect(page.locator('.clock span')).toHaveText(time);
 await page.getByRole('button',{name:'答えを見る',exact:true}).click();await expect(page.locator('.status strong')).toHaveText('クリア 0 / 47');await expect(page.locator('.map img')).toBeVisible();
 await page.getByRole('button',{name:'次の県へ',exact:true}).click();await expect(page.locator('.question-card p')).not.toHaveText(first);
 for(let i=0;i<46;i++){await answer(page);await page.getByRole('button',{name:'次の県へ',exact:true}).click();}
 await expect(page.locator('.question-card p')).toHaveText(first);await expect(page.locator('.status strong')).toHaveText('クリア 46 / 47');await answer(page);await page.getByRole('button',{name:'結果を見る'}).click();await expect(page.getByRole('heading',{name:'全47問 クリア！'})).toBeVisible();
});
for(const mode of ['normal','reverse'])test(`complete ${mode}, save, reload`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page,mode);const seen=new Set();
 for(let i=0;i<47;i++){const p=await answer(page,mode);expect(seen.has(p.id)).toBe(false);seen.add(p.id);await expect(page.locator('.map img')).toHaveAttribute('src',new RegExp(`maps/${p.id}\\.svg$`));await expect(page.locator('.map img')).toHaveJSProperty('complete',true);await page.getByRole('button',{name:i===46?'結果を見る':mode==='reverse'?'次の問題へ':'次の県へ',exact:true}).click();}
 expect(seen.size).toBe(47);await expect(page.getByRole('heading',{name:'全47問 クリア！'})).toBeVisible();
 const score=await page.evaluate(mode=>JSON.parse(localStorage.getItem('ken-geme.best.v1'))[mode],mode);expect(score).toBeGreaterThan(0);await page.reload();if(mode==='reverse')await page.getByLabel('県庁所在地 → 都道府県').check();await expect(page.locator('.best strong')).not.toHaveText('まだなし');expect(errors).toEqual([]);
});
test('IME composition Enter does not submit, Enter repeat and duplicate click are guarded',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>.999999});await start(page);await page.locator('#answer').fill('札幌市');
 await page.locator('#answer').dispatchEvent('compositionstart');await page.locator('#answer').dispatchEvent('keydown',{key:'Enter',code:'Enter',isComposing:true,keyCode:229});await expect(page.locator('.question-card')).toBeVisible();
 await page.locator('#answer').dispatchEvent('compositionend');await page.locator('#answer').dispatchEvent('keydown',{key:'Enter',code:'Enter'});await expect(page.locator('.question-card')).toBeVisible();
 await page.waitForTimeout(100);await page.locator('#answer').press('Enter');await expect(page.locator('.status strong')).toHaveText('クリア 1 / 47');
 await page.getByRole('button',{name:'次の県へ',exact:true}).evaluate(button=>{button.click();button.click();});await expect(page.locator('.question-card p')).toHaveText('青森県');await expect(page.locator('.status strong')).toHaveText('クリア 1 / 47');
});
test('reload clears only current run; storage denied or corrupt remains playable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError')}})});await page.goto('/');await expect(page.getByRole('status')).toContainText('保存できません');await page.getByRole('button',{name:'はじめる',exact:true}).click();await answer(page);await page.reload();await expect(page.getByRole('button',{name:'はじめる',exact:true})).toBeVisible();
});
test('storage write denied at finish keeps result visible',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')}});await start(page);
 for(let i=0;i<47;i++){await answer(page);await page.getByRole('button',{name:i===46?'結果を見る':'次の県へ',exact:true}).click();}
 await expect(page.getByRole('heading',{name:'全47問 クリア！'})).toBeVisible();await expect(page.locator('.storage-note')).toContainText('保存できませんでした');
});
for(const width of [320,390,1280])test(`responsive ${width}px, long answers and all key states`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.addInitScript(()=>{Math.random=()=>.999999});await page.goto('/');
 const check=async()=>{expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);for(const box of await page.locator('button:visible,input:visible').all()){const b=await box.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width+1);}};
 await check();await start(page);await check();await page.locator('#answer').fill('北九州市');await page.getByRole('button',{name:'回答する',exact:true}).click();await check();await page.getByRole('button',{name:'答えを見る',exact:true}).click();await check();await page.screenshot({path:`work/screenshots/reveal-${width}-${test.info().project.name}.png`,fullPage:true});await page.getByRole('button',{name:'次の県へ',exact:true}).click();await answer(page);await check();
});
