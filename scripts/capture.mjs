import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH});
mkdirSync('work/screenshots',{recursive:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
async function capture(state){ for(const width of [320,390,1280]){await page.setViewportSize({width,height:width===390?844:900});await page.screenshot({path:`work/screenshots/${state}-${width}.png`,fullPage:width!==390});}await page.setViewportSize({width:390,height:844});}
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.addInitScript(()=>{Math.random=()=>.999999;});
await page.goto('http://127.0.0.1:4178');
await page.getByRole('button',{name:'はじめる',exact:true}).click();
// Traverse 39 cards through the real UI to capture the approved Fukuoka state.
for(let i=0;i<39;i++){await page.getByRole('button',{name:'わからないときは、答えを見る'}).click();await page.getByRole('button',{name:'次の県へ',exact:true}).click();}
await page.locator('#answer').blur();await page.evaluate(()=>document.fonts.ready);
await capture('question');
await page.locator('#answer').fill('北九州市');await page.getByRole('button',{name:'回答する',exact:true}).click();
await capture('incorrect');
await page.getByRole('button',{name:'答えを見る',exact:true}).click();
await capture('reveal');
await page.reload();await page.getByRole('button',{name:'はじめる',exact:true}).click();
for(let i=0;i<39;i++){await page.getByRole('button',{name:'わからないときは、答えを見る'}).click();await page.getByRole('button',{name:'次の県へ',exact:true}).click();}
await page.locator('#answer').fill('福岡市');await page.getByRole('button',{name:'回答する',exact:true}).click();
await page.locator('.map img').evaluate(img => img.decode());
await page.locator('.food-row img').evaluateAll(imgs => Promise.all(imgs.map(img=>img.decode())));
await capture('correct');
console.log({errors,title:await page.title(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
await browser.close();
