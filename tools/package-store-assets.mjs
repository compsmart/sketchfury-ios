// Render the existing Play Store screenshot artwork in Apple-sized layouts.
// Source artwork is preserved without cropping or changing the depicted UI.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const game = path.resolve(process.env.SKETCHFURY_SOURCE || '../sketchfury');
const { launch } = await import(pathToFileURL(path.join(game, 'tools/promo/lib.mjs')));
const browser = await launch(['--disable-gpu']);
try {
  for (const [name, source, W, H, files] of [
    ['iphone','phone',1206,2622,['01-home.png','02-fight.png','03-draw.png','04-sketches.png','06-fighters.png']],
    ['ipad','tablet10',2064,2752,['01-home.png','07-fight.png','02-draw.png','03-sketches.png','04-fighters.png']],
  ]) {
    const out = path.resolve('store/apple-assets', name); fs.mkdirSync(out,{recursive:true});
    for(let i=0;i<files.length;i++) {
      const file=files[i], landscape=file.includes('fight.png');
      const width=landscape?H:W, height=landscape?W:H;
      const png=fs.readFileSync(path.join(game,'mobile/store/screens',source,file));
      const page=await browser.newPage();
      await page.setViewport({width,height,deviceScaleFactor:1});
      await page.setContent(`<!doctype html><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:radial-gradient(ellipse at top,#502818,#110d1d 70%)}img{display:block;width:100%;height:100%;object-fit:contain}</style><img src="data:image/png;base64,${png.toString('base64')}">`);
      await page.waitForFunction(()=>document.images[0].complete);
      await page.screenshot({path:path.join(out,String(i+1).padStart(2,'0')+'-'+file.slice(3)),type:'png'});
      await page.close(); console.log(name+': '+file);
    }
  }
} finally { await browser.close(); }
