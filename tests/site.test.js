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

test('картинки сохраняют пропорции: у изображений в контейнерах есть height:auto', () => {
  const css = read('styles.css');
  assert.match(css, /\.laptop img\{[^}]*height:auto/);
  assert.match(css, /\.podium\{[^}]*height:auto/);
});

test('навигация: все внутренние ссылки ведут на существующие блоки', () => {
  const html = read('index.html');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  assert.ok(targets.length > 0);
  for (const target of targets) assert.ok(ids.has(target), `нет блока #${target}`);
});

test('мобильное меню поверх hero: шапка создаёт слой выше контента', () => {
  const css = read('styles.css');
  const topbar = css.match(/\.topbar\{([^}]*)\}/)[1];
  assert.match(topbar, /position:relative/);
  assert.match(topbar, /z-index:10/);
});

test('логотипы сохраняют естественную пропорцию рамки', () => {
  const css = read('styles.css');
  const logos = css.match(/\.logos img\{([^}]*)\}/)[1];
  assert.match(logos, /height:auto/);
  assert.match(logos, /object-fit:contain/);
  assert.match(css, /@media \(max-width:480px\)\{[\s\S]*?\.logos img\{height:auto;max-height:30px/);
});

test('мобильный hero: зелёная панель не выходит за пределы hero', () => {
  const css = read('styles.css');
  assert.match(css, /\.sage-panel\{height:calc\(100% - 40px\);top:40px\}/);
});

test('интерактив: мобильное меню закрывается, запись честно помечена как демо', () => {
  const html = read('index.html');
  const js = read('script.js');
  assert.match(js, /Escape/);
  assert.match(js, /nav\.querySelectorAll\('a'\)/);
  assert.match(html, /id="demo-note"[^>]*hidden/);
  assert.doesNotMatch(html, /data-slide=/);
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
