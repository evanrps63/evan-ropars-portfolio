// Usage: node render.js out.mp4 [fps] [subframes] -> full video with motion blur
//        node render.js --stills dir t1 t2 -> PNG stills for review
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?t=0');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  if (args[0] === '--stills') {
    const dir = args[1];
    for (const t of args.slice(2)) {
      await page.evaluate(t => render(t), parseFloat(t));
      await page.screenshot({ path: path.join(dir, `t${t}.png`) });
    }
  } else {
    const out = args[0], fps = parseInt(args[1] || '30');
    const dur = await page.evaluate(() => DURATION);
    const SUB = parseInt(args[2] || '4'), SHUTTER = 0.5;
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps * SUB), '-i', '-',
      '-vf', `tmix=frames=${SUB},select='eq(mod(n,${SUB}),${SUB - 1})',setpts=N/${fps}/TB`, '-r', String(fps),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    // motion blur: SUB sub-frames per frame over a 180° shutter, averaged by ffmpeg (tmix)
    const n = Math.round(dur * fps);
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < SUB; k++) {
        await page.evaluate(t => render(t), (i + k * SHUTTER / SUB) / fps);
        const buf = await page.screenshot({ type: 'png' });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      }
      if (i % 60 === 0) process.stderr.write(`frame ${i}/${n}\n`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
