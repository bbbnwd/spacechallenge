const {openBrowser, selectComposition, renderStill} = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await openBrowser('chrome', {browserExecutable: '/usr/bin/chromium'});
  const serveUrl = path.resolve('build');
  fs.mkdirSync('out/scenes', {recursive:true});
  try {
    const composition = await selectComposition({serveUrl, id:'DropTowerWebtoon', puppeteerInstance:browser});
    if(composition.durationInFrames !== 450 || composition.fps !== 30 || composition.width !== 1920 || composition.height !== 1080) throw new Error('Wrong metadata');
    const frames = [40, 95, 160, 240, 315, 420, 449];
    for(let i=0;i<frames.length;i++) {
      const output=path.resolve(`out/scenes/${i===6?'final-frame':`scene-${i+1}`}.png`);
      await renderStill({composition,serveUrl,puppeteerInstance:browser,output,frame:frames[i],imageFormat:'png'});
      console.log(`Rendered ${output} at frame ${frames[i]}`);
    }
    fs.writeFileSync('out/scenes/frames.json',JSON.stringify({composition,frames},null,2));
  } finally {await browser.close({silent:true});}
})().catch(error=>{console.error(error);process.exitCode=1});
