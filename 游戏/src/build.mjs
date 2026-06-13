import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', '后室-无尽回廊.html');
const read = (p) => readFileSync(join(here, p), 'utf8');

const order = ['engine.js','data/items.js','data/entities.js','data/orgs.js','data/endings.js','data/starts.js'];
const levels = readdirSync(join(here,'data/levels')).filter(f=>f.endsWith('.js')).sort().map(f=>'data/levels/'+f);
const tail = ['data/boot.js','ui.js'];
const files = [...order, ...levels, ...tail];

const js = files.map(f=>`// ===== ${f} =====\n` + read(f)).join('\n\n');
const css = read('style.css');
const html = read('index.template.html').replace('/*__CSS__*/', css).replace('/*__JS__*/', js);
writeFileSync(out, html, 'utf8');
console.log('built →', out, `(${(html.length/1024).toFixed(0)} KB, ${files.length} files)`);
