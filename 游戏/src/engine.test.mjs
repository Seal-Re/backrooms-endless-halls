import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
require(join(here, 'engine.js'));
const GAME = globalThis.GAME;

test('sanityTier 边界', () => {
  assert.equal(GAME.sanityTier(100), 'calm');
  assert.equal(GAME.sanityTier(70), 'calm');
  assert.equal(GAME.sanityTier(69), 'unease');
  assert.equal(GAME.sanityTier(40), 'unease');
  assert.equal(GAME.sanityTier(39), 'dread');
  assert.equal(GAME.sanityTier(15), 'dread');
  assert.equal(GAME.sanityTier(14), 'broken');
  assert.equal(GAME.sanityTier(0), 'broken');
});

test('rng 确定性', () => {
  const a = GAME.makeRng(42), b = GAME.makeRng(42);
  assert.equal(a(), b());
  assert.equal(a(), b());
});

test('clamp', () => {
  assert.equal(GAME.clamp(5, 0, 10), 5);
  assert.equal(GAME.clamp(-1, 0, 10), 0);
  assert.equal(GAME.clamp(99, 0, 10), 10);
});

test('newState 取自起点', () => {
  GAME.starts.test = { level: 'L0', node: 'entry', inv: { almond_grey: 2 } };
  const s = GAME.newState('test', 42);
  assert.equal(s.level, 'L0'); assert.equal(s.node, 'entry');
  assert.equal(s.sanity, 100); assert.equal(s.inv.almond_grey, 2);
  assert.equal(s.seed, 42);
});

test('applyEffects 各原语', () => {
  const s = GAME.newState('test', 1);
  GAME.applyEffects(s, [['sanity', -10], ['give', 'firesalt', 1], ['flag', 'met_meg'], ['trust', 2], ['thirst', 5]]);
  assert.equal(s.sanity, 90); assert.equal(s.inv.firesalt, 1);
  assert.equal(s.flags.met_meg, true); assert.equal(s.trust, 2); assert.equal(s.thirst, 5);
  GAME.applyEffects(s, [['take', 'firesalt', 1]]);
  assert.equal(s.inv.firesalt, undefined);
  GAME.applyEffects(s, [['sanity', -1000]]);
  assert.equal(s.sanity, 0);
});

test('goto 跨层 + visited', () => {
  const s = GAME.newState('test', 1);
  GAME.goto(s, 'L1:hall');
  assert.equal(s.level, 'L1'); assert.equal(s.node, 'hall');
  assert.equal(s.visited['L1:hall'], 1);
  GAME.goto(s, 'corner');
  assert.equal(s.level, 'L1'); assert.equal(s.node, 'corner');
});

test('tick 扣理智 + 安全屋回复', () => {
  GAME.levels.L0 = { id: 'L0', name: '阈界', class: 1, safe: false, nodes: {} };
  GAME.levels.SAFE = { id: 'SAFE', name: '安全屋', class: 0, safe: true, nodes: {} };
  const s = GAME.newState('test', 5); s.level = 'L0';
  const before = s.sanity; GAME.tick(s);
  assert.ok(s.sanity < before); assert.equal(s.turns, 1);
  s.level = 'SAFE'; const m = s.sanity; GAME.tick(s);
  assert.ok(s.sanity > m);
});

test('choose 走 goto + tick + 触发 ending', () => {
  GAME.endings.dead = { id: 'dead', title: '困死', text: '...' };
  GAME.levels.L0.nodes = {
    entry: { id: 'entry', text: 'a', choices: [
      { label: '走', goto: 'hall' },
      { label: '放弃', ending: 'dead' },
    ]},
    hall: { id: 'hall', text: 'b', choices: [{ label: '回', goto: 'entry' }] },
  };
  let s = GAME.newState('test', 1); s.level = 'L0'; s.node = 'entry';
  GAME.choose(s, 0);
  assert.equal(s.node, 'hall'); assert.equal(s.turns, 1);
  s = GAME.newState('test', 1); s.level = 'L0'; s.node = 'entry';
  GAME.choose(s, 1);
  assert.equal(s.ended, 'dead');
});

test('visibleChoices 过滤 requires', () => {
  GAME.levels.L0.nodes.entry.choices.push({ label: '用钥匙', requires: (st) => !!st.inv.key, goto: 'hall' });
  const s = GAME.newState('test', 1); s.level = 'L0'; s.node = 'entry';
  assert.equal(GAME.visibleChoices(s).length, 2);
  s.inv.key = 1;
  assert.equal(GAME.visibleChoices(s).length, 3);
});

test('nodeText 走 sanity 变体', () => {
  GAME.levels.L0.nodes.entry.text = '正常';
  GAME.levels.L0.nodes.entry.variants = { broken: '扭曲的低语…' };
  const s = GAME.newState('test', 1); s.level = 'L0'; s.node = 'entry';
  assert.equal(GAME.nodeText(s), '正常');
  s.sanity = 5;
  assert.equal(GAME.nodeText(s), '扭曲的低语…');
});

test('nodeText 函数文本可读状态', () => {
  GAME.levels.L0.nodes.hall.text = (st) => '回合' + st.turns;
  const s = GAME.newState('test', 1); s.level = 'L0'; s.node = 'hall'; s.turns = 3;
  assert.equal(GAME.nodeText(s), '回合3');
});

test('serialize/deserialize 往返（含中文）', () => {
  const s = GAME.newState('test', 7); s.flags.note = '杏仁水·灰';
  const round = GAME.deserialize(GAME.serialize(s));
  assert.deepEqual(round, s);
});
