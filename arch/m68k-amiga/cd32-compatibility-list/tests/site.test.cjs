// Copyright (C) 2026, The AROS Development Team. All rights reserved.
// Run with: node --test arch/m68k-amiga/cd32-compatibility-list/tests/site.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = process.env.COMPATIBILITY_ROOT || path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'cd32-compatibility-list/index.html'), 'utf8');
const markdown = fs.readFileSync(path.join(root, 'CD32-COMPATIBILITY.md'), 'utf8');

class Element {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.events = {};
    this.textContent = '';
    this.value = '';
    this.hidden = false;
  }
  appendChild(child) { this.children.push(child); }
  replaceChildren(...children) { this.children = children; }
  append(...children) {
    for (const child of children) {
      const element = typeof child === "string" ? Object.assign(new Element("#text"), { textContent: child }) : child;
      this.children.push(element);
    }
  }
  addEventListener(name, handler) { this.events[name] = handler; }
  setAttribute(name, value) { this[name] = value; }
}

async function loadPage() {
  const ids = Object.fromEntries(['setup', 'commit', 'roms', 'head', 'rows', 'search', 'count', 'message']
    .map(id => [id, new Element(id)]));
  const document = {
    getElementById: id => ids[id],
    createElement: tag => new Element(tag),
    querySelectorAll: () => [],
  };
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  vm.runInNewContext(scripts.at(-1)[1], {
    document,
    applyTheme() {},
    fetch: async () => ({ ok: true, text: async () => markdown }),
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(ids.message.textContent, '', 'Markdown loads without a rendering error');
  return ids;
}

test('every game renders a CD32 release year without shifting the other columns', async () => {
  const page = await loadPage();
  assert.deepEqual(page.head.children.map(c => c.textContent), ['Game', 'Year', 'Status', 'Tested', 'Details']);
  assert.equal(page.rows.children.length, 16);
  for (const row of page.rows.children) {
    assert.equal(row.children.length, 5);
    assert.match(row.children[1].textContent, /^199[3-5]$/);
    assert.equal(row.children[1].className, 'year');
    assert.equal(row.children[2].children[0].className, 'badge working');
    assert.equal(row.children[3].children[0].className, 'chips');
  }
  const liberation = page.rows.children.find(row => row.children[0].textContent === 'Liberation: Captive II');
  assert.equal(liberation.children[1].textContent, '1993');
});

test('Gloom, Liberation, and Diggers & Oscar show working results', async () => {
  const page = await loadPage();
  for (const name of ['Gloom', 'Liberation: Captive II', 'Diggers & Oscar']) {
    const row = page.rows.children.find(row => row.children[0].textContent === name);
    const badge = row.children.find(cell => cell.className === 'status').children[0];
    assert.equal(badge.textContent, 'Working', name);
    assert.equal(badge.className, 'badge working', name);
  }
});

test('name filtering still works with the additional year column', async () => {
  const page = await loadPage();
  page.search.value = 'liberation';
  page.search.events.input();
  const visible = page.rows.children.filter(row => !row.hidden);
  assert.equal(visible.length, 1);
  assert.equal(visible[0].children[0].textContent, 'Liberation: Captive II');
  assert.match(page.count.textContent, /1 game matching/);
  page.search.value = 'missing game';
  page.search.events.input();
  assert.equal(page.message.textContent, 'No game matches that name.');
});

test('GitHub links point to the AROS fork at the top and bottom', () => {
  for (const tag of ['header', 'footer']) {
    const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
    assert.ok(match, `${tag} is present`);
    const section = match[1];
    assert.match(section, /href="https:\/\/github\.com\/warpdesign\/AROS"/);
  }
});

test('project links show their logos and the footer offers coffee support', () => {
  const links = [...html.matchAll(/<a\b[^>]*href="https:\/\/github\.com\/warpdesign\/AROS"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(links.length, 2);
  for (const [, contents] of links) {
    assert.match(contents, /<svg[^>]*aria-hidden="true"/);
    assert.match(contents, /<use href="#github"/);
  }
  const footer = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/)[1];
  assert.match(footer, /href="https:\/\/buymeacoffee\.com\/warpdesign"/);
  assert.match(footer, /Buy me a coffee/);
  assert.match(footer, /<use href="#coffee"/);
});

test('the ROM download and tested hash match the upstream release', async () => {
  const page = await loadPage();
  const hash = markdown.match(/\*\*Tested commit:\*\*\s*`([0-9a-f]+)`/)[1];
  const date = markdown.match(/\*\*Tested commit:\*\*[^\n]*\((\d{4}-\d{2}-\d{2})\)/)[1];
  assert.equal(page.commit.children[0].href,
    'https://github.com/aros-development-team/AROS/commit/' + hash);
  assert.equal(page.roms.children[0].href,
    `https://github.com/warpdesign/AROS/releases/download/rom-${hash.slice(0, 10)}/aros-amiga-rom-${hash.slice(0, 10)}-${date}.zip`);
});
