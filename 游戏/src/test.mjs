import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const load = (p) => require(join(here, p));
load('engine.js');
['data/items.js','data/entities.js','data/orgs.js','data/endings.js','data/starts.js'].forEach(load);
for (const f of readdirSync(join(here,'data/levels')).filter(f=>f.endsWith('.js'))) load(join('data/levels', f));
const GAME = globalThis.GAME;
GAME.DROP_POOL = ['L0:corridors','L1:entry','L2:entry'].filter(t=>{const i=t.indexOf(':');return GAME.levels[t.slice(0,i)]&&GAME.levels[t.slice(0,i)].nodes[t.slice(i+1)];});

const starts = Object.keys(GAME.starts);
const WALKS = 1500, CAP = 600;
let crashes = 0, deadends = 0, capped = 0; const endHist = {};
for (let i = 0; i < WALKS; i++) {
  const startId = starts[i % starts.length];
  const rng = GAME.makeRng(1000 + i);
  let s;
  try { s = GAME.newState(startId, 1000 + i); } catch(e){ crashes++; console.log('newState 崩溃 '+startId+': '+e.message); continue; }
  let steps = 0;
  while (!s.ended && steps < CAP) {
    let choices;
    try { choices = GAME.visibleChoices(s); } catch(e){ crashes++; console.log(`visibleChoices 崩溃 @${s.level}:${s.node}: ${e.message}`); break; }
    if (!choices.length) { deadends++; console.log(`死胡同 @${s.level}:${s.node}（start=${startId} seed=${1000+i}）`); break; }
    try { GAME.choose(s, Math.floor(rng() * choices.length)); } catch(e){ crashes++; console.log(`choose 崩溃 @${s.level}:${s.node}: ${e.message}`); break; }
    steps++;
  }
  if (s.ended) endHist[s.ended] = (endHist[s.ended]||0)+1;
  else if (steps >= CAP) capped++;
}
console.log(`\n漫游 ${WALKS} 局：崩溃 ${crashes}，死胡同 ${deadends}，超步未结束 ${capped}`);
console.log('结局分布：', endHist);
process.exit((crashes || deadends) ? 1 : 0);
