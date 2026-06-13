import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const load = (p) => require(join(here, p));

load('engine.js');
['data/items.js','data/entities.js','data/orgs.js','data/endings.js','data/starts.js'].forEach(f=>{ try{load(f)}catch(e){ console.log('load fail '+f+': '+e.message); } });
const lvlDir = join(here, 'data/levels');
for (const f of readdirSync(lvlDir).filter(f=>f.endsWith('.js'))) load(join('data/levels', f));

const GAME = globalThis.GAME;
const errors = [], warns = [];
const nodeExists = (target, curLevel) => {
  let lv = curLevel, nd = target; const i = target.indexOf(':');
  if (i>=0){ lv = target.slice(0,i); nd = target.slice(i+1); }
  return !!(GAME.levels[lv] && GAME.levels[lv].nodes[nd]);
};

for (const [lid, lv] of Object.entries(GAME.levels)) {
  for (const [nid, node] of Object.entries(lv.nodes)) {
    const where = `${lid}:${nid}`;
    if (!node.choices || !node.choices.length) errors.push(`死节点（无 choice）: ${where}`);
    for (const c of (node.choices||[])) {
      if (!c.goto && !c.ending) errors.push(`choice 缺 goto/ending: ${where} → "${c.label}"`);
      if (c.goto && !nodeExists(c.goto, lid)) errors.push(`悬空 goto: ${where} → ${c.goto}`);
      if (c.ending && !GAME.endings[c.ending]) errors.push(`未知 ending: ${where} → ${c.ending}`);
      for (const e of (c.effects||[])) {
        if ((e[0]==='give'||e[0]==='take') && !GAME.items[e[1]]) errors.push(`未知物品: ${where} → ${e[1]}`);
      }
    }
    for (const e of (node.onEnter && Array.isArray(node.onEnter) ? node.onEnter : [])) {
      if ((e[0]==='give'||e[0]==='take') && !GAME.items[e[1]]) errors.push(`onEnter 未知物品: ${where} → ${e[1]}`);
    }
  }
}
for (const need of ['sanity_zero','collapse']) if (!GAME.endings[need]) errors.push(`缺内置 ending: ${need}`);
for (const [sid, st] of Object.entries(GAME.starts)) if (!nodeExists(st.node, st.level)) errors.push(`起点目标不存在: ${sid} → ${st.level}:${st.node}`);

const reached = new Set(), reachedEndings = new Set(['sanity_zero','collapse']);
const q = Object.values(GAME.starts).map(s=>`${s.level}:${s.node}`);
while (q.length) {
  const cur = q.shift(); if (reached.has(cur)) continue; reached.add(cur);
  const i = cur.indexOf(':'), lv = cur.slice(0,i), nd = cur.slice(i+1);
  const node = GAME.levels[lv] && GAME.levels[lv].nodes[nd]; if (!node) continue;
  for (const c of (node.choices||[])) {
    if (c.ending) reachedEndings.add(c.ending);
    if (c.goto) { const t = c.goto.indexOf(':')>=0 ? c.goto : `${lv}:${c.goto}`; if (!reached.has(t)) q.push(t); }
  }
}
for (const [lid, lv] of Object.entries(GAME.levels)) for (const nid of Object.keys(lv.nodes))
  if (!reached.has(`${lid}:${nid}`)) warns.push(`不可达节点: ${lid}:${nid}`);
for (const eid of Object.keys(GAME.endings)) if (!reachedEndings.has(eid)) warns.push(`不可达 ending: ${eid}`);

console.log(`lint: ${Object.keys(GAME.levels).length} 层, 错误 ${errors.length}, 警告 ${warns.length}`);
warns.forEach(w=>console.log('  ⚠ '+w));
errors.forEach(e=>console.log('  ✖ '+e));
process.exit(errors.length ? 1 : 0);
