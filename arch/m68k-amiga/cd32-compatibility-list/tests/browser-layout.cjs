// Copyright (C) 2026, The AROS Development Team. All rights reserved.
// Run with Node 22+ and Chrome installed; CHROME_BIN can override its path.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');

async function main() {
  const root = path.resolve(process.env.COMPATIBILITY_ROOT || path.join(__dirname, '../..'));
  const chrome = process.env.CHROME_BIN || [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].find(file => fs.existsSync(file));
  assert.ok(chrome, 'Chrome is required for the layout regression');
  const profile = await fsp.mkdtemp(path.join(os.tmpdir(), 'cd32-layout-'));
  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname),
      url.pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    try {
      const types = { '.html': 'text/html', '.md': 'text/plain', '.svg': 'image/svg+xml' };
      response.setHeader('Content-Type', (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
      response.end(await fsp.readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const child = spawn(chrome, ['--headless', '--disable-gpu', '--no-sandbox', '--no-first-run',
    '--no-default-browser-check', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'],
    { stdio: 'ignore' });
  const exited = new Promise(resolve => child.once('exit', resolve));
  let ws;
  try {
    const active = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; !fs.existsSync(active) && i < 200; i++) await new Promise(r => setTimeout(r, 50));
    assert.ok(fs.existsSync(active), 'Chrome starts its debugging endpoint');
    const port = (await fsp.readFile(active, 'utf8')).split('\n')[0];
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    let id = 0;
    const waiting = new Map();
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      const pending = waiting.get(message.id);
      if (!pending) return;
      waiting.delete(message.id); clearTimeout(pending.timer);
      message.error ? pending.reject(new Error(JSON.stringify(message.error))) : pending.resolve(message.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const request = ++id;
      const timer = setTimeout(() => { waiting.delete(request); reject(new Error(`${method} timed out`)); }, 15000);
      waiting.set(request, { resolve, reject, timer });
      ws.send(JSON.stringify({ id: request, method, params }));
    });
    const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
    await send('Page.enable');
    const failures = [];
    const check = (condition, message) => { if (!condition) failures.push(message); };
    for (const width of [320, 390, 760, 1100]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: base + '/cd32-compatibility-list/' });
      for (let i = 0; i < 100; i++) {
        if (await evaluate('document.querySelectorAll("#rows tr").length') === 16) break;
        await new Promise(r => setTimeout(r, 30));
      }
      const layout = await evaluate(`(() => {
        const title = document.querySelector('header > div').getBoundingClientRect();
        const controls = document.querySelector('.controls').getBoundingClientRect();
        return { width: innerWidth, scroll: document.documentElement.scrollWidth,
          title: {right:title.right, top:title.top}, controls: {left:controls.left, top:controls.top},
          count: document.querySelectorAll('#rows tr').length, intro: document.querySelector('.intro').textContent };
      })()`);
      check(layout.count === 16, `games render at ${width}px`);
      check(layout.scroll === width, `no horizontal overflow at ${width}px`);
      check(layout.intro === 'Below is a list of CD32 games that have been tested with AROS ROMs.', 'requested description is visible');
      if (width > 640) {
        check(layout.controls.left >= layout.title.right - 1 && Math.abs(layout.controls.top - layout.title.top) < 2,
          `desktop controls stay beside the title at ${width}px`);
      }
      for (const theme of ['light', 'dark']) {
        await evaluate(`document.documentElement.dataset.theme = '${theme}'`);
        const links = await evaluate(`Array.from(document.querySelectorAll('footer a')).map(a => ({
          link: getComputedStyle(a).color, icon: getComputedStyle(a.querySelector('svg')).color
        }))`);
        for (const colors of links) {
          const icon = colors.icon.match(/\d+/g).map(Number);
          const link = colors.link.match(/\d+/g).map(Number);
          check(Math.max(...icon) - Math.min(...icon) <= 20, `neutral ${theme} icon`);
          check(link[2] > link[0] + 20 && colors.link !== colors.icon, `blue ${theme} link text`);
        }
      }
    }
    await send('Browser.close');
    ws.close(); ws = null;
    assert.equal(failures.length, 0, [...new Set(failures)].join('\n'));
    console.log('Layout regression passed: desktop alignment, mobile widths, description, and neutral icons with blue links in both themes.');
  } finally {
    if (ws) ws.close();
    child.kill(); await exited;
    await new Promise(resolve => server.close(resolve));
    await fsp.rm(profile, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
