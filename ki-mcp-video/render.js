// Rendert Standbilder oder das komplette MP4 aus index.html
//   node render.js stills 1.8 5.2 8.6 12.5 16.8 19.5   → frames/still_XX.png
//   node render.js video                                → out/ki-mcp-erklaervideo.mp4
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?capture=1');
  await page.evaluate(() => document.fonts.ready);
  const shot = async t => {
    await page.evaluate(t => window.renderFrame(t), t);
    return page.locator('#stage').screenshot({ type: 'png' });
  };

  if (mode === 'stills') {
    fs.mkdirSync(path.join(__dirname, 'storyboard'), { recursive: true });
    for (const [i, ts] of rest.entries()) {
      fs.writeFileSync(path.join(__dirname, 'storyboard', `still_${String(i + 1).padStart(2, '0')}_${ts}s.png`), await shot(+ts));
    }
  } else if (mode === 'video') {
    fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
    const out = path.join(__dirname, 'out', 'ki-mcp-erklaervideo.mp4');
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', '30', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', out],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = 20 * 30;
    for (let f = 0; f < N; f++) {
      const buf = await shot(f / 30);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) console.log('Frame', f, '/', N);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('Fertig:', out);
  }
  await browser.close();
})();
