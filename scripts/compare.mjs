import sharp from 'sharp';
for(const [state,source] of [['question','01-question-fukuoka'],['correct','02-correct-fukuoka'],['incorrect','03-incorrect-fukuoka']]){
 const original=await sharp(`../design-inputs/${source}.png`).resize(390,844).toBuffer();
 const screen=await sharp(`work/screenshots/${state}-390.png`).toBuffer();
 await sharp({create:{width:780,height:844,channels:3,background:'#ddd'}}).composite([{input:original,left:0,top:0},{input:screen,left:390,top:0}]).png().toFile(`work/screenshots/compare-${state}.png`);
}
