// engine.js — 纯逻辑，无 DOM，Node 可测。挂 globalThis.GAME。禁用 import/export。
(function (g) {
  const GAME = (g.GAME = g.GAME || {});
  GAME.levels = GAME.levels || {};
  GAME.items = GAME.items || {};
  GAME.entities = GAME.entities || {};
  GAME.orgs = GAME.orgs || {};
  GAME.endings = GAME.endings || {};
  GAME.starts = GAME.starts || {};

  GAME.clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  // 种子化 RNG（mulberry32），可复现
  GAME.makeRng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  GAME.sanityTier = function (s) {
    if (s >= 70) return 'calm';
    if (s >= 40) return 'unease';
    if (s >= 15) return 'dread';
    return 'broken';
  };

  GAME.newState = function (startId, seed) {
    const start = GAME.starts[startId];
    if (!start) throw new Error('unknown start: ' + startId);
    return {
      level: start.level, node: start.node,
      sanity: 100, thirst: 0, stamina: 100, turns: 0,
      inv: Object.assign({}, start.inv || {}),
      flags: {}, trust: 0, visited: {}, seed: seed >>> 0,
      redCooldown: 0, ended: null,
    };
  };

  GAME.goto = function (state, target) {
    let level = state.level, node = target;
    const i = target.indexOf(':');
    if (i >= 0) { level = target.slice(0, i); node = target.slice(i + 1); }
    state.level = level; state.node = node;
    const key = level + ':' + node;
    state.visited[key] = (state.visited[key] || 0) + 1;
  };

  GAME.dropLevel = function (state) {
    const rng = GAME.makeRng((state.seed + state.turns) >>> 0);
    const pool = GAME.DROP_POOL && GAME.DROP_POOL.length ? GAME.DROP_POOL : ['L0:entry'];
    GAME.goto(state, pool[Math.floor(rng() * pool.length)]);
  };

  GAME.applyEffects = function (state, effects) {
    if (!effects) return state;
    for (const e of effects) {
      const op = e[0], a = e[1], b = e[2];
      switch (op) {
        case 'sanity': state.sanity = GAME.clamp(state.sanity + a, 0, 100); break;
        case 'thirst': state.thirst = GAME.clamp(state.thirst + a, 0, 100); break;
        case 'stamina': state.stamina = GAME.clamp(state.stamina + a, 0, 100); break;
        case 'give': state.inv[a] = (state.inv[a] || 0) + (b == null ? 1 : b); break;
        case 'take':
          state.inv[a] = Math.max(0, (state.inv[a] || 0) - (b == null ? 1 : b));
          if (!state.inv[a]) delete state.inv[a];
          break;
        case 'flag': state.flags[a] = (b == null ? true : b); break;
        case 'trust': state.trust += a; break;
        case 'drop': GAME.dropLevel(state); break;
        default: throw new Error('unknown effect op: ' + op);
      }
    }
    return state;
  };

  GAME.tick = function (state) {
    state.turns += 1;
    const rng = GAME.makeRng((state.seed * 7919 + state.turns) >>> 0);
    let drain = 1 + Math.floor(rng() * 3);
    if (state.flags.addicted) drain += 1;
    const lvl = GAME.levels[state.level];
    if (lvl && lvl.safe) drain = -5;
    state.sanity = GAME.clamp(state.sanity - drain, 0, 100);
    state.thirst = GAME.clamp(state.thirst + 2, 0, 100);
    if (state.thirst >= 90) state.stamina = GAME.clamp(state.stamina - 5, 0, 100);
    if (state.sanity <= 0 && !state.ended) state.ended = 'sanity_zero';
    if (state.stamina <= 0 && !state.ended) state.ended = 'collapse';
    return state;
  };

  GAME.currentNode = function (state) {
    const lvl = GAME.levels[state.level];
    if (!lvl) throw new Error('no level ' + state.level);
    const node = lvl.nodes[state.node];
    if (!node) throw new Error('no node ' + state.level + ':' + state.node);
    return node;
  };

  GAME.visibleChoices = function (state) {
    const node = GAME.currentNode(state);
    return (node.choices || []).filter(c => !c.requires || c.requires(state));
  };

  GAME.choose = function (state, idx) {
    const c = GAME.visibleChoices(state)[idx];
    if (!c) throw new Error('bad choice idx ' + idx);
    if (Array.isArray(c.effects)) GAME.applyEffects(state, c.effects);
    if (c.ending) { state.ended = c.ending; return state; }
    if (c.goto) GAME.goto(state, c.goto);
    if (!c.noTick && !state.ended) GAME.tick(state);
    if (!state.ended) {
      const n = GAME.currentNode(state);
      if (n.onEnter) {
        const eff = (typeof n.onEnter === 'function') ? n.onEnter(state) : n.onEnter;
        if (Array.isArray(eff)) GAME.applyEffects(state, eff);
      }
    }
    return state;
  };

  GAME.nodeText = function (state) {
    const node = GAME.currentNode(state);
    let t = node.text;
    const tier = GAME.sanityTier(state.sanity);
    if (node.variants && node.variants[tier] != null) t = node.variants[tier];
    if (typeof t === 'function') t = t(state);
    return String(t);
  };

  function b64enc(s) {
    if (typeof btoa !== 'undefined') return btoa(unescape(encodeURIComponent(s)));
    return Buffer.from(s, 'utf8').toString('base64');
  }
  function b64dec(s) {
    if (typeof atob !== 'undefined') return decodeURIComponent(escape(atob(s)));
    return Buffer.from(s, 'base64').toString('utf8');
  }
  GAME.serialize = (state) => b64enc(JSON.stringify(state));
  GAME.deserialize = (str) => JSON.parse(b64dec(str));
})(typeof window !== 'undefined' ? window : globalThis);
