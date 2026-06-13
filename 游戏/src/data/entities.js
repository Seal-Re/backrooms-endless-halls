(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.entities = GAME.entities || {};
  const E = GAME.entities;
  E.hound       = { id:'hound',       name:'Hound（猎犬）',         rule:'循声捕猎；远离声源、保持安静。' };
  E.smiler      = { id:'smiler',      name:'Smiler（微笑者）',       rule:'潜伏黑暗，露出发光笑脸；不可直视，避入全黑区。' };
  E.skinstealer = { id:'skinstealer', name:'Skin-Stealer（剥皮者）', rule:'伪装成同伴；用镜子或杏仁水·红验明。' };
  E.facelings   = { id:'facelings',   name:'Facelings（无面人）',    rule:'多数被动；勿模仿其行为、勿挑衅。' };
  E.deathmoth   = { id:'deathmoth',   name:'Deathmoth（死亡蛾）',    rule:'受光源吸引；黑暗中勿久开手电。' };
  E.partygoer   = { id:'partygoer',   name:'Partygoer（派对客）',    rule:'永恒狂欢；绝不加入、不进食其食物。' };
  E.wretch      = { id:'wretch',      name:'Wretch（可怜虫）',       rule:'扭曲爬行；保持距离、勿触碰。' };
})(typeof window !== 'undefined' ? window : globalThis);
