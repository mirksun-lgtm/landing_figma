const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

test('SEO: title, description, один H1, язык страницы и alt у картинок', () => {
  const html = read('index.html');
  assert.match(html, /<html[^>]+lang="en"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta\s+name="description"\s+content="[^"]{40,}"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  assert.ok(imgs.length > 0, 'на странице должны быть картинки');
  for (const img of imgs) assert.match(img, /alt="[^"]+"/);
});

test('адаптив: есть стили для 1024 / 768 / 480px и запрет горизонтальной прокрутки', () => {
  const css = read('styles.css');
  for (const w of [1024, 768, 480]) {
    assert.ok(css.includes(`${w}px`), `нет медиазапроса ${w}px`);
  }
  assert.match(css, /overflow-x:\s*hidden/);
});

test('макет: локальные картинки exist', () => {
  const html = read('index.html');
  const srcs = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  const local = srcs.filter((s) => !/^https?:/.test(s));
  assert.ok(local.length > 0, 'картинки макета должны быть локальными');
  for (const src of local) {
    assert.ok(fs.existsSync(path.join(root, src)), `нет файла ${src}`);
  }
});
